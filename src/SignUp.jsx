import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const typeRef = useRef(null);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) navigate('/');
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const phone = phoneRef.current.value;
    const password = passwordRef.current.value;
    const type = typeRef.current.value;

    try {
      const response = await fetch('http://localhost:5000/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phone, password, type }),
      });

      const data = await response.json();
      if (data.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email',email);
        localStorage.setItem('Account-Type',type);
        alert('Sign Up Successful!');
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="w-full gradient-background flex justify-center items-center min-h-screen bg-gray-100">
      <div className="transparent-card">
        <h1 className="text-center text-2xl font-bold mb-4">Sign Up</h1>

        <form onSubmit={handleSubmit} className="grid gap-3">
          {/* First Row: Username & Email */}
          <div className="grid  gap-3">
            <label className='new-font'>Username : </label><input ref={usernameRef} type="text" placeholder="Username" className="rounded-3xl p-2 bg-white ml-3" />
            <label className='new-font'>Email : </label><input ref={emailRef} type="email" placeholder="Email" className="rounded-3xl p-2 bg-white ml-3" />
          </div>

          {/* Second Row: Phone & Password */}
          <div className="grid grid-cols-2 gap-3">
            <input ref={phoneRef} type="text" placeholder="Phone" className="rounded-3xl p-2 bg-white ml-3" />
            <input ref={passwordRef} type="password" placeholder="Password" className="rounded-3xl p-2 bg-white ml-3" />
          </div>

          {/* Account Type Dropdown */}
          <select ref={typeRef} className="rounded-3xl p-2 bg-white ml-3">
            <option value="">Select Account Type</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>

          {/* Submit Button */}
          <button type="submit" style={{background:'linear-gradient(90deg,lightblue,purple)'}} className=" text-white rounded-2xl py-2 m-2">Sign Up</button>
        </form>

        <p className="mt-3 text-center new-font">
          Already have an account? <a href="/login" className="text-purple-600 new-font">Log In</a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
