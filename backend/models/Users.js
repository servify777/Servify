import mongoose from 'mongoose';
import express from 'express';
import bcrypt from 'bcryptjs';
import nodemailer  from 'nodemailer';
import dotenv  from 'dotenv';
import fast2sms from "fast-two-sms";
import fetch from 'node-fetch';


dotenv.config();

const router = express.Router();
const otpStore = {};
const emailOTPStore = {};
const messageOTP = {}
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, enum: ['client', 'freelancer'], required: true },
    image:{type:String,required:false},
    description : {type:String,required:false},
    skills:{type:Array,required:false}
});

const User = mongoose.model('Users',userSchema);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // ✅ Important for port 587 (TLS)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false, // ✅ Prevents SSL/TLS errors
    }
});


const sendEmailNotification = async (email,OTP) => {
    console.log("SMTP Config:", process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER);
    console.log('Sending Email to Gmails : ',email);    
    
    const mailOptions = {
        from:'servifysss@gmail.com',
        to:email,
        subject:'Forgot Password For Your Servify Account is Initiated',
        text:`Here is An OTP To Login Your Servify Account As Of Now : ${OTP}`
    };

    try {
        const operation = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error While Sending OTP Mail');
        return false;
    }
};

const sendMailOTP = async (email,emailOTP) => {
    console.log("SMTP Config:", process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER);
    console.log('Sending Email to Gmails : ',email);
    
    const mailOptions = {
        from: 'servifysss@gmail.com',
        to: email,
        subject: `Verify Your New Servify Email`,
        text: `Verify Email Address \n One Time Password (OTP) for Your Account Is ${emailOTP}. Visit the platform to Verify now.`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Emails sent successfully.");
        console.log("SMTP Response:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

router.post('/verify',async (req,res)=>{
    console.log('Entering !....');
    const {email,phone} = req.body;

    try {
        const emailOTP = Math.floor(10000 + Math.random() * 1000);
        const phoneOTP = Math.floor(10000 + Math.random() * 1000);
        emailOTPStore[email] = emailOTP; 
        messageOTP[phone] = phoneOTP;
        const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
        const token = process.env.ULTRAMSG_TOKEN;
        const url = `https://api.ultramsg.com/${instanceId}/messages/chat`;
        const data = {
            token: token,
            to: phone,
            body: `Your Servify OTP is: ${phoneOTP}`,
        };
        console.log('OTP For Email : ',emailOTP);
        console.log('Phone Otp for user : ',phoneOTP);
        
        
        setTimeout(() => {
            delete emailOTPStore[email]; 
            console.log(`OTP for ${email} expired`);
        }, 5 * 60 * 1000); // 5 minutes 
        setTimeout(() => {
            delete messageOTP[phone]; 
            console.log(`OTP for ${phone} expired`);
        }, 5 * 60 * 1000); // 5 minutes 

        sendMailOTP(email,emailOTP,'One Time Password (OTP) for Servify');
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
        res.json(result);
        console.log('OTP Sent to Whatsapp!');
        
        }

        catch(error){
            console.error(error);
            
        }
        
        
    } catch (error) {
        console.error(error);
        return res.status(513).json({message:'OTP Sent Process failed ',ok:false});
        
    }
});

router.post('/otp-verify', async (req,res)=>{
    const {email,Emailotp,phone,Phoneotp} = req.body;
    console.log('OTP From user : ',Emailotp);
    console.log('OTP From Server : ',emailOTPStore[email]);
    console.log('Mobile OTP From Client : ',Phoneotp,' ',phone);
    console.log('Mobile OTP from Server : ',messageOTP[phone]);
    
    if(!emailOTPStore[email]){
        return res.status(513).json({message:'OTP is Expired !...',ok:false});
    }

    if(emailOTPStore[email] == Emailotp ){

        if(messageOTP[phone] == Phoneotp){
            delete messageOTP[phone];
            delete emailOTPStore[email];
            return res.status(200).json({message:'OTP is Valid Suceesfully !..',ok:true});
        }
        return res.status(514).json({message:'Mobile OTP IS Inavlid !..',ok:true});
    }
    return res.status(400).json({ message: 'Invalid OTP' });
})

router.post('/forgot',async (req,res)=>{
    const {email} = req.body;
        try {
           const matchingUsers = await User.findOne({email});
           if(!matchingUsers){
            return res.status(404).json({message:'No User Found On Email Address',ok:true});
           }
           const OTP = Math.floor(10000 + Math.random() * 90000); 
           otpStore[email] = OTP; 
        console.log(`Generated OTP for ${email}:`, OTP);

        setTimeout(() => {
            delete otpStore[email]; 
            console.log(`OTP for ${email} expired`);
        }, 5 * 60 * 1000); // 5 minutes 
            sendEmailNotification(matchingUsers.email,OTP, 'One Time Password (OTP) for Servify');
           return res.status(200).json({message:'OTP is sent to Your Email',ok:true});
       } 
       catch (error) {
           console.error('Email Sending Failed',error);
           return res.status(404).json({message:'Error Sending Email To your Account !...'});
       }
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!otpStore[email]) {
        return res.status(400).json({ message: 'OTP expired or not found' });
    }

    if (otpStore[email] === otp) {
        delete otpStore[email]; 
        console.log('User Verified Suceesfully !..');
        
        return res.status(200).json({message:'OTP Is Verified Sucessfully !..',ok:true});
    }

    return res.status(400).json({ message: 'Invalid OTP' });
});


router.post('/signin', async (req,res)=>{
    console.log('Sucessfully routed !..');
    
    const {username,email,phone,password,type} = req.body;
    // checking whether the user is already available
    const duplication = await User.findOne({email});
    if(duplication){
        return res.status(501).json({error:'User Already Exists'})
    }

    // encryting the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    // function punnda({ram})
    try {
        const response = new User({
            username,
            email,
            phone,
            password:hashedPassword,
            type
        });

        await response.save();
        console.log('Sucessfully Inserted the User !...');
        
        return res.status(200).json({message:'Sucessfully Inserted the User !...',ok:true})
    } catch (error) {
        console.error('Error While addding User to Database !..',error);
    }
});

router.use('/login', async (req,res)=>{
    const {email,password} = req.body;
    console.log('Email from frontend  : ',email);
    
    const response = await User.findOne({email});
    console.log(response);
    if(!response){
        return res.status(502).json({message:'User Does Not Exists !...'});
    }

    const hashedpassword = response.password;
    console.log('pass',password);
    const passlogic = await bcrypt.compare(password,hashedpassword);
    if(passlogic){
        return res.status(200).json({message:'Login Sucessfull !..',ok:true,AccountType:response.type,User:response.username});
    }
    return res.status(503).json({message:'Password Does not Matches !...',ok:false});
});

router.use('/personal-informations', async (req,res)=>{
    const {email,description,url,skill} = req.body;

    try{
        const updation = await User.findOneAndUpdate({email},{$set:{description,image:url,skills:skill}},{new:true});

    if(updation){
        console.log('Sucessfully Updated !...');
        return res.status(200).json({message:'Personal Data is Sucessfully Added !..',ok:true});
    }

    else{
        console.log('Error While Updation !..');
        return res.status(505).json({message:'Error While Updation !..',ok:false});
    }
    }

    catch(error){
        console.error(error);
        return res.status(505).json({message:error,ok:false});
    }
});

router.use('/settings', async (req,res)=>{
    const {email} = req.body;

    const response = await User.findOne({email});
    if(!response){
        return res.status(404).json({message:'No User Found ON Database'});
    }

    return res.status(200).json({message:'User Settings Found !..',url: response.image , username: response.username , description:response.description , accountType:response.type , data:response});
})

export default router;
export {User};