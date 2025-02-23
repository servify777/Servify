import { useRef, useState } from "react";
import { Navigate, redirect, useNavigate } from "react-router-dom";
const Help = () => {
    const [file, setFile] = useState(null);
    let descriptionRef = useRef(null);
    let issueRef = useRef(null);
    const [path,setPath] = useState('');
    const email = localStorage.getItem('email');
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async ()=>{
        if(!file){
            alert('No File Selected !...');
            return 1;
        }

        const formdata = new FormData();
        formdata.append('screenshot',file);

        try{
            const response = await fetch('http://localhost:5000/upload',{
                method:'POST',
                body:formdata
            });

            if(response.ok){
                setPath(response.filePath);
                alert('File Is Sucessfully Uploaded !..');
            }

            else{
                alert('Error While Uploading @!...');
            }
        }

        catch(error){
            console.error(error);
            
        }

    }

    const handleSubmit = async ()=>{
        const issue = issueRef.current.value;
        const description = descriptionRef.current.value;

        try{
            const response = await fetch('http://localhost:5000/query/raise-query',{
                headers:{'Content-Type':'application/json'},
                method:'POST',
                body:JSON.stringify({email,issue,description,path})
            });

            if(response.ok){
                alert(response.message);
                redirect('/');
            }

            alert(response.message);
        }

        catch(e){
            console.error(e);
            
        }
    }

  return (
    <main className='bg-gradient-to-br from-purple-600 to-blue-500 min-w-full min-h-screen flex items-center justify-center'>
        <div className='transparent-card min-w-fit'>
            <h1 className='new-font text-2xl font-bold text-center'>Contact Us!...</h1>
            <section className="mt-4">
            <label className="new-font">Select What Kind Of Issue Your Facing : </label>
            <select className="rounded-3xl p-2 bg-white ml-3" ref={issueRef}>
                <option value='Pages Are Not Loading!...'>Pages Are Not Loading!...</option>
                <option value="Can't Login !...">Can&apos;t Login !...</option>
                <option value='How To Use This Website ?'>How To Use This Website ?</option>
            </select>
            </section>

            <section className="mt-7">
                <label>Describe the Issue Your Facing : </label>
                <textarea ref={descriptionRef} placeholder="Breifly Describe What Problem You Are Facing !.." className="w-9/12 rounded-2xl border-2 border-black ml-12 mt-3" style={{height:'100px'}}></textarea>
            </section>

            <section>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={handleUpload}
            >
                Upload Screenshot
            </button>
            </section>

            <button className="rounded-2xl text-white bg-purple-600 p-2 new-font ml-9/12 text-end" onClick={handleSubmit}>Submit Query !...</button>
        </div>
    </main>
  )
}

export default Help