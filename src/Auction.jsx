import { useEffect, useState } from "react";
import BidCard from "./BidCard";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });
import { motion } from "framer-motion";

const Auction = () => {
    const [Data,setData] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{

        const handleAuctionFetch = async ()=>{
            try {
              const response = await fetch('http://localhost:5000/cb/current-biddings');
            let auctions = await response.json();
            // Fetch completed auctions
            const completedResponse = await fetch("http://localhost:5000/cb/completed-bid");
            const completedAuctions = await completedResponse.json();
            // Filter out completed auctions
            auctions = auctions.filter(auction => !completedAuctions.includes(auction._id));
            console.log('Fetched Data from Database !..');
            
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


      const handleRedirect = (_id)=>{
        navigate(`/details/${_id}`);
      }
      
    return (
      <div className="flex items-center justify-center  min-h-screen mt-32">
        <main className="transparent-card p-5 min-w-fit m-4">
            <h1 className="new-font text-4xl mb-4">Auctions For You:</h1>
            {Data && (
            Data.map((Data)=>{
                return (
                    <>
                    <hr />
                    <motion.section
                    initial={{opacity:0,y:100}}
                    animate={{opacity:1,y:0}}
                    exit={{opacity:0,y:-100}}
                    transition={{duration:0.2}}
                     className="flex space-x-6 m-4 min-w-fit">
                    <div>
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                            <img src={`http://localhost:5000/project-profile/${Data.url.split('\\').pop()}` || "/default-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>

    <div>
      <h2 className="text-xl font-semibold" onClick={()=>{handleRedirect(Data._id)}} key={Data._id}>{Data.title}</h2>
      <p className="text-gray-600" key={Data._id}>{Data.client}</p>
      <h4 className="text-gray-700 mt-2 min-w-80 w-80" key={Data._id}>
        Description: {Data.description.length > 100 ? Data.description.slice(0,100)+'...' : Data.description}
      </h4>
      <hr />
    </div>
    <BidCard Data = {Data} budget={Data.budget}/>
  </motion.section>
                    </>
                )
            })
          )}
        </main>
      </div>
    );
  }
  
  export default Auction;
  