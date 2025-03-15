import React, { useEffect, useRef, useState } from 'react'

const EmailVerify = ({email,phone}) => {

  const EmailOTPRef = useRef(null);
  const PhoneOTPRef = useRef(null);
  const [isFresh,setIsFresh] = useState(false);

  console.log('Email from props : ',email);
  

  useEffect(()=>{
    const handleVerification = async ()=>{
      try {
        const response = await fetch('http://localhost:5000/users/verify',{
          headers:{'Content-Type':'application/json'},
          method:'POST',
          body:JSON.stringify({email,phone})
        });
        const result = await response.json();
        alert(result.message);
      } catch (error) {
        console.error(error);
      }
    }

    handleVerification();
  },[isFresh]);

  const handleDataSend = async ()=>{
    const Emailotp = EmailOTPRef.current.value;
    console.log('Email OTP : ',Emailotp);
    
    const Phoneotp = PhoneOTPRef.current.value;

    try {
      const response = await fetch('http://localhost:5000/users/otp-verify',{
        headers:{'Content-Type':'application/json'},
        method:'POST',
        body:JSON.stringify({email,Emailotp,phone,Phoneotp})
      });

      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1 className='new-font text-center font-extrabold mb-6 '>Verify Your Email And Phone Number</h1>
      <label className='new-font ml-1 '>Enter OTP from Email : </label>
      <input ref={EmailOTPRef} type='text' className='rounded-3xl  mt-2 p-2  w-full bg-white items-center mb-6'/>
      <label className='new-font ml-1 '>Enter OTP from Message : </label>
      <input ref={PhoneOTPRef} type='text' className='rounded-3xl  mt-2 p-2  w-full bg-white items-center'/>

      <button onClick={handleDataSend} className='bg-pink-500 rounded-xl mt-6 p-2' style={{marginLeft:'37%'}}>Verify OTP</button>
    </div>
  )
}

export default EmailVerify
