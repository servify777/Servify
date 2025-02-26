import mongoose from 'mongoose';
import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

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
        return res.status(200).json({message:'Login Sucessfull !..',ok:true,AccountType:response.type});
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