import './static/tailwind.css'
import { useEffect, useRef, useState } from 'react'
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';


// const CLIENT_ID = '493022169817-7ofv109mrudioksamgsql5invmf0pjlp.apps.googleusercontent.com';

const Login = () => {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [forgot,setForgot] = useState(false);
    const fpassRef = useRef(null);

    const navigate = useNavigate();

    // chancking whether there is any token available in localstorage 
      useEffect(()=>{
        const handleAuthentication = ()=>{
          const token = localStorage.getItem('token');
          console.log('existing token : ',token);
          if(token){
            navigate('/');
          }
        }
    
        // handleAuthentication();
      },[]);


    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:5000/users/login',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    email,
                    password
                })
            });

            // checking the response state 

        const data = await response.json();
        console.log('Data from Server : ',data);
        if(data.ok){
          localStorage.setItem('token',data.token);
          console.log('Login Sucessfull and the token is : ',data.token);
            // alert('LOG IN Successfull !...');
            console.log('token from server' ,data.token);
            localStorage.setItem('token',data.token);
            localStorage.setItem('Account-Type',data.AccountType);
            const salt = await bcrypt.genSalt(10);
            const usercredential = await bcrypt.hash(email,salt);
            localStorage.setItem('credentials',usercredential);
            navigate('/')
        }

        else{
            alert(data.message);
        }
        }

        catch(error){
            console.log('Error While fetching ',error);
        }

        
    }

    const handleForgotPassword = async ()=>{
      try {
        const response = await fetch('http://localhost:5000/users/forgot',{
          headers:{'Content-Type':'application/json'},
          method:'POST',
          body:JSON.stringify({email})
        });

        const returnData = await response.json();
        alert(returnData.message);
        setForgot(true);
      } catch (error) {
        console.error('Errror While Trying Send OTP to Email : ',error);
      }
    }

    const handleForgotVerify = async ()=>{
      const fpass = fpassRef.current.value;
      try{
        const response = await fetch('http://localhost:5000/users/verify-otp',{
          headers:{'Content-Type':'application/json'},
          method:'POST',
          body:JSON.stringify({email,otp:fpass})
        });

        const returnResponse  = await response.json();
        if(returnResponse.ok){
          alert(returnResponse.message);
          navigate('/home');
        }
        else{
          alert(returnResponse.message);
        }
      }

      catch(error){
        console.error('Error While Verifying OTP');
      }
    }

  return (
    <>
    <div className='gradient-background'>

<div className='transparent-card'>
{/* <div className=' flex justify-center items-center'>
    <h1 className='text-center font-bold'>Sign In :</h1>
</div> */}
<h1 className='text-center font-bold new-font raleway-font'>Servify (Login)</h1>
<br/>
<label  className='new-font'>Email : </label>
<input type='email' placeholder='Email Id' className="rounded-3xl p-2 bg-white m-3 ml-9" onChange={(e) => {setEmail(e.target.value)}}/>
<br/>
<label className='new-font'>Password : </label>
<input type='password' placeholder='Password' className="rounded-3xl p-2 bg-white m-3"  onChange={(e) => {setPassword(e.target.value)}}/>
<a onClick={handleForgotPassword} className='text-blue-500 text-end flex ml-[200px] underline'>Forgot Password !</a>
<br />
<br />

{forgot ? (
  <section>
    <label className='new-font'>Enter The OTP From Email : </label>
    <input ref={fpassRef} type='text' placeholder='OTP From Email' className='rounded-3xl p-2 w-full min-w-full mt-2 mb-3 bg-white '/>
  </section>
) : null}
<button className='new-font p-2 rounded-2xl' style={{backgroundColor:'rgba(255, 0, 132, 0.42)',marginLeft:'50%',width:'150px'}}onClick={forgot ? handleForgotVerify : handleSubmit}>Log In</button>
<br />
<br />
<br />
<p className='new-font font-semibold'>Already Don&apos;t  Have An Account <a href='/signup' className='text-red-500 no-underline ml-2'>Sign In</a></p>
<br />
<br />
{/* <GoogleOAuthProvider clientId={CLIENT_ID}>
<GoogleLogin
onSuccess={handleSuccess}
onError={handleFailure}
/>
</GoogleOAuthProvider> */}
</div>
</div>
    </>
  )
}

export default Login