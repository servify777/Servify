import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

const socket = io("http://localhost:5000");

const BidCard = ({ Data, budget }) => {
  const validBudget = budget ? parseFloat(budget) : 0;
  console.log('Data For BidCard : ',Data);
  
  const [lowestBid, setLowestBid] = useState(Data.lowestBid || validBudget);
  const [bidAmount, setBidAmount] = useState(0);
  const [lastBidder, setLastBidder] = useState(null);

  useEffect(() => {
    socket.on("updateAuction", (updatedAuction) => {
      if (updatedAuction._id === Data._id) {
        if(updatedAuction.lowestBid <= budget/10){
          alert('Maximum Threshold!');
          return;
        }
        setLowestBid(updatedAuction.lowestBid);
      }
    });

    socket.on("noBids", async ({ auctionId, lastBidder }) => {
      if (auctionId === Data._id) {
        setLastBidder(lastBidder);
        const saving = await fetch('http://localhost:5000/cb/save-auction',{
          headers:{'Content-Type':'application/json'},
          method:'POST',
          body:JSON.stringify({auctionId})
        });

        const response = await saving.json();
        if(response.ok){
          alert(response.message);
          console.log('Successful Save');
        } else {
          console.error(response.message);
          console.log('Error While Saving Auction Data!');
        }
      }
    });

    return () => {
      socket.off("updateAuction");
      socket.off("noBids");
    };
  }, [Data]);

  const handleBid = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      console.error("No email found in localStorage!");
      return;
    }

    let newBidAmount = lowestBid - (lowestBid * 0.05); 
    newBidAmount = Math.max(newBidAmount, 1);

    socket.emit("placeBid", { auctionId: Data._id, bidAmount: newBidAmount, userEmail: email });
    setBidAmount(newBidAmount);
  };

  const leaveAuction = () => {
    console.log("User left auction");
    setLastBidder(null);
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8}} className="w-96 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-5 shadow-lg text-white"
    >
      {lastBidder ? (
        <p className="text-white text-lg font-semibold text-center items-center italic">
          Last Bid: {lastBidder}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-4 rounded-lg text-white font-semibold shadow-md">
              <p className="text-sm">Quotation:</p>
              <p className="text-lg">{budget}</p>
              <section className="mt-8">
                <p className="text-sm">Least Offer:</p>
                <p className="text-lg">{budget/10}</p>
              </section>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="bg-white text-black px-3 py-1 rounded-md text-sm">My Bid</div>
              <div className="p-3 rounded-lg text-white font-semibold bg-gray-300 shadow-md">
                {Math.floor(bidAmount) || "----"}
              </div>
              <div className="bg-white text-black px-3 py-1 rounded-md text-sm">Lowest Bid</div>
              <div className="bg-gradient-to-r from-black to-blue-600 p-3 rounded-lg text-white font-semibold shadow-md">
                {Math.floor(lowestBid)}
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg flex items-center" style={{background:'rgba(255,255,255,0.5'}}>
            <button className="bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-600 transition-all mr-2" onClick={handleBid}>
              Bid Now
            </button>
            <button className="bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600 transition-all" onClick={leaveAuction}>
              Leave Auction
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default BidCard;
