import { useRef, useState } from 'react';
import './AddProject.css';
import { useNavigate } from 'react-router-dom';

const AddProject = () => {

    const [selectedSkills, setSelectedSkills] = useState([]);
    const urlRef = useRef(null);
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const budgetRef = useRef(null);
    const navigate = useNavigate();
    const ITSkills = [
        "Web Development", "Machine Learning", "Cybersecurity", 
        "Cloud Computing", "Data Science", "Blockchain", 
        "DevOps", "Software Testing", "Mobile App Development", 
        "Game Development", "AI & Automation", "UI/UX Design",
        "React","Node.js","MongoDB",
        "Python","Flutter","PostgreSQL",
        "c#","MERN Stack","Ethical Hacking"
      ];

    const [file,setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleCheckboxChange = (skill) => {
      setSelectedSkills(prev => 
        prev.includes(skill) 
          ? prev.filter(s => s !== skill) // Remove if already selected
          : [...prev, skill] // Add if not selected
      );
    };

    const getFileNameFromPath = (path) => {
      return path.split('\\').pop(); // Extracts only the filename
  };
  

    const handleUpload = async ()=>{
        if(!file){
            alert('No File Selected !...');
            return 1;
        }

        

        const formdata = new FormData();
        formdata.append('Profile',file);

        try {
            const response = await fetch('http://localhost:5000/upload-projectimg',{
                method:'POST',
                body:formdata
            });
            const answer = await response.json();
            alert(answer.message);
        } catch (error) {
            console.error(error);
            
        }
    };

    const handleAddition = async (e)=>{
      // Data Derivatio
      handleUpload();
      const title = titleRef.current.value;
      const description = descriptionRef.current.value;
      const budget = budgetRef.current.value;
      const url = getFileNameFromPath(urlRef.current.value);
      console.log('Extracted File Name:', url);

      const client = localStorage.getItem('User')
      try {
        const dataEntry = await fetch('http://localhost:5000/cb/add-project',{
          headers:{'Content-Type':'application/json'},
          method:'POST',
          body:JSON.stringify({url,title,description,budget,technical_aspects:selectedSkills,client})
        });

        const response = await dataEntry.json();
        if(dataEntry.ok){
          alert(response.message);
          navigate('/');
        }

        else{
          alert(response.message);
        }
      } catch (error) {
        alert(error);
      }
    }

  return (
    <div className="add-background mt-20">
      <div className='bg-[#FFFFFF99] rounded-xl p-4'>
        <h1 className='text-center font-extrabold new-font text-2xl'>Add Your Project To Bidding </h1>

        <form action={handleAddition}>
            <section className='flex m-4'>
                <label className='new-font text-xl font-semibold'>Image About Your Project :</label>
                <section className='w-fit flex'>
            <input ref={urlRef} type="file" accept="image/*" onChange={handleFileChange} />
            {/* <button 
            type='button'
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={handleUpload}>
                Upload Screenshot
            </button> */}
            </section>
            </section>
            
            <section className='m-4'>
                <label className='text-xl font-semibold pr-2 new-font'>Project Title : </label>
                <input ref={titleRef} type='text' placeholder='Project Title' className='rounded p-1 new-font'/>
            </section>

            <section className=' flex m-4'>
                <label className='new-font text-xl font-semibold '>Project Description </label>
                <textarea minLength={250} ref={descriptionRef} placeholder=' Project Description' className="w-9/12 rounded-2xl border-2 border-black ml-8 mt-3 p-1 h-32"/>
            </section>

            <section className='m-4'>
                <label className='new-font text-xl font-semibold rounded'>Budget For Your Project : </label>
                <input ref={budgetRef} type='number'/>
            </section>

            <section className='grid grid-cols-2 md:grid-cols-3 gap-2 m-4'>
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
            </section>

            <button type='submit' className='p-3 bg-purple-600 text-white rounded-2xl'>Go To Auction</button>
        </form>
      </div>
    </div>
  )
}

export default AddProject
