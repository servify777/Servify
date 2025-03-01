import { useScroll } from 'framer-motion';
import { io } from 'socket.io-client';
import React, { useState,useEffect } from 'react'
import BidCard from './BidCard';
import DummyCard from './DummyCard';

const YourProjects = () => {
const [Data,setData] = useState();
const email = localStorage.getItem('email');
const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });

useEffect(()=>{

        const handleAuctionFetch = async ()=>{
            console.log('EMail : ',email)
            try {
            const response = await fetch('http://localhost:5000/cb/profile-data',{
              headers:{'Content-Type':'application/json'},
              method:'POST',
              body:JSON.stringify({lastBidder:email})
            });
            let auctions = await response.json();
            console.log('Data From Server : ',auctions);
            
            setData(auctions);
            } catch (error) {
              console.error(error);
            }
        }

        handleAuctionFetch(); 

        // const timer = setInterval(handleAuctionFetch,1000);

        // Listen for auction updates
        socket.on("updateAuction", (updatedAuction) => {
          setData((prevData) =>
              prevData.map((auction) =>
                  auction._id === updatedAuction._id ? updatedAuction : auction
              )
          );
      });

      socket.on("auctionCompleted", ({ auctionId }) => {
        setData((prevData) => prevData.filter(auction => auction._id !== auctionId));
    });

    return () => {
        socket.off("updateAuction");
        socket.off("auctionCompleted");
        // clearInterval(timer);
    };
    },[]);

    return (
        <div className="flex items-center justify-center  min-h-screen mt-32">
          <main className="transparent-card p-5 min-w-fit m-4">
              <h1 className="new-font text-4xl mb-4">Your Auctions :</h1>
              {Data && (
              Data.map((Data,index)=>{
                  return (
                      <>
                      <hr />
                      <section className="flex space-x-6 m-4 min-w-fit">
                      <div>
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                              <img src={Data.url || "/default-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
                          </div>
                      </div>
  
      <div>
        <h2 className="text-xl font-semibold" key={index}>{Data.title}</h2>
        <p className="text-gray-600" key={index}>{Data.client}</p>
        <h4 className="text-gray-700 mt-2" key={index}>
          Description: {Data.description}
        </h4>
        <hr />
      </div>
      <DummyCard />
    </section>
                      </>
                  )
              })
            )}
          </main>
        </div>
      );
}

export default YourProjects
