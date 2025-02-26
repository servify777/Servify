import { useRef, useState } from "react";
import {  useNavigate } from "react-router-dom";
const ITSkills = [
  "Web Development", "Machine Learning", "Cybersecurity", 
  "Cloud Computing", "Data Science", "Blockchain", 
  "DevOps", "Software Testing", "Mobile App Development", 
  "Game Development", "AI & Automation", "UI/UX Design",
  "React","Node.js","MongoDB",
  "Python","Flutter","PostgreSQL",
  "c#","MERN Stack","Ethical Hacking"
];

const PI = () => {
    const [selectedSkills, setSelectedSkills] = useState([]);
    let descRef = useRef(null);
    let urlRef = useRef(null);
    const navigate = useNavigate();

  const handleCheckboxChange = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) // Remove if already selected
        : [...prev, skill] // Add if not selected
    );
  };

  const handleSubmit = async ()=>{
    const description = descRef.current.value;
    const url = urlRef.current.value;
    const email = localStorage.getItem("email");

    if(selectedSkills.length === 0){
      alert('Skills Are Not Selected !...');
      return 1;
    }
    try{
        const response = await fetch('http://localhost:5000/users/personal-informations',{
            headers:{'Content-type':'application/json'},
            method:'POST',
            body:JSON.stringify({email,description,url,skill:selectedSkills})
        })
    
        if(response.ok){
            alert(response.message);
            navigate('/');
        }
    
        else{
            alert(response.message);
        }
    }

    catch{
        console.log("error while saving to database !...");
    }
  }

  return (
    <main className='bg-gradient-to-br from-blue-500 to-purple-600 w-full h-full min-h-screen pb-3 '>
        <h1 className='new-font text-4xl flex justify-center items-center text-center text-white pt-8 pb-8'>Personal Informations :</h1>
        <div style={{width:'fit-content',margin:'10px auto',padding:'24px',background:'rgba(255,255,255,0.5)'}} className=" rounded-2xl">
            <form action={handleSubmit}>
            <section className="flex flex-row items-center">
            <label className='new-font '>Description : </label>
            <textarea ref={descRef} required type='text' className='bg-white new-font rounded-xl border-2 text-gray-600 w-9/12 ml-2 pl-1' placeholder="Describe Yourself"/>
            </section>

            <section>
            <label className="new-font">Profile URL : </label>
            <input ref={urlRef} required className="bg-white border-2 text-gray-600 w-9/12 ml-2 mt-3 pl-1" type="text" placeholder="URL to Picture Picture"/>
            </section>

            <section className='mt-4'>
          <label className='block mb-2 font-semibold'>Select Your Skills:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {ITSkills.map((skill, index) => (
              <label key={index} className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  value={skill} 
                  checked={selectedSkills.includes(skill)} 
                  onChange={() => handleCheckboxChange(skill)}
                  className="w-4 h-4"
                />
                {skill}
              </label>
            ))}
          </div>
        </section>
        <button>Submit Details</button>
            </form>
        </div>
    </main>
  )
}

export default PI