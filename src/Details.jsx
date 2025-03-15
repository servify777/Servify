import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";
import BidCard from './BidCard';
const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });

const Details = () => {

    const {_id} = useParams();
    console.log('ID from Auction : ',_id);
    const [Data,setData] = useState([]);

    

    useEffect(()=>{
        const handleDetails = async ()=>{
            try {
                console.log('Fetching !...');
                
                const response = await fetch('http://localhost:5000/cb/details',{
                    headers:{'Content-Type':'application/json'},
                    method:"POST",
                    body:JSON.stringify({_id})
                });
        
                const RD = await response.json();
    
                setData(RD.data);
                console.log(RD.data);
            } catch (error) {
                console.error('Error While Make Response To Server : ',error);
            }
           
        }

        handleDetails();

        socket.on("updateAuction", (updatedAuction) => {
            setData((prevData) => {
                console.log('PrevData for mapping:', prevData);
        
                if (prevData._id) {
                    return prevData._id === updatedAuction._id 
                        ? { ...prevData, ...updatedAuction } 
                        : prevData;
                }
        
                return Array.isArray(prevData)
                    ? prevData.map((auction) =>
                        auction._id === updatedAuction._id
                            ? { ...auction, ...updatedAuction }
                            : auction
                    )
                    : [];
            });
        });
        
        

      socket.on("auctionCompleted", ({ auctionId }) => {
        setData((prevData) => prevData.filter(auction => auction._id !== auctionId));
    });

    return () => {
        socket.off("updateAuction");
        socket.off("auctionCompleted");
    };
    },[]);

    return Data.length === 0 ? (<p>Loading !...</p>) : (
    <main className='mt-32'>
      <img src={`http://localhost:5000/project-profile/${Data.url.split('\\').pop()}`} className='w-full h-[500px] object-cover mb-3'/>
      <h1 className='text-center new-font text-4xl font-extrabold mb-2'>{Data.title}</h1>
      <h4 className='text-center new-font text-2xl font-extrabold text-gray-600 mb-8'>Client Username : {Data.client}</h4>
      <div className='flex'>
      <section className='mr-6 ml-6'>
        <p className='new-font text-xl mb-8'>{Data.description}</p>
        <h2 className="new-font text-2xl font-semibold mb-3 flex">Required Skills:  <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pl-5 text-gray-700 text-lg">
    {Data.technical_aspects?.map((skill, index) => (
        <li key={index} className="flex items-center">
            ✅ <span className="ml-2">{skill}</span>
        </li>
    ))}
</ul>
</h2>
      </section>

      <div style={{margin:'10px 20px',  width:'100%'}}>
        <BidCard Data = {Data} budget={Data.budget}/>
        </div>
      </div>


    </main>
  )
}

export default Details
