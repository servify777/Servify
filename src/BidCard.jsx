import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const BidCard = ({ Data, budget }) => {
  const [bidAmount, setBidAmount] = useState(0);
  const [lowestBid, setLowestBid] = useState(Data.lowestBid || budget);
  const [lastBidder, setLastBidder] = useState(null);
  const [finishedProjects,setFinishedProjects] = useState(null);
  const [isCompleted,setIsCompleted] = useState(Data.isCompleted);

  useEffect(() => {
  
    socket.on("updateAuction", (updatedAuction) => {

      
      if (updatedAuction._id === Data._id) {
        if(updatedAuction.lowestBid <= budget/10){
          alert('Maximum Threashold !...');
          return ;
        }
        setLowestBid(updatedAuction.lowestBid);
      }
    });

  
    socket.on("noBids", async ({ auctionId, lastBidder }) => {
      if (auctionId === Data._id) {
        setLastBidder(lastBidder);
        // localStorage.setItem(`lastBidder_${auctionId}`, lastBidder); // Save to localStorage
        // finalizeBid();
        const saving = await fetch('http://localhost:5000/cb/save-auction',{
          headers:{'Content-Type':'application/json'},
          method:'POST',
          body:JSON.stringify({auctionId})
        });

        const response = await saving.json();
        if(response.ok){
          alert(response.message);
          console.log('Sucessfull Save');
        }

        else{
          console.error(response.message);
          console.log('Error While Saving Auction Data !..');
          
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

    let newBidAmount = lowestBid - (lowestBid * 0.05); // Reduce bid by 5%
    newBidAmount = Math.max(newBidAmount, 1); // Ensure bid doesn't go below 1

    socket.emit("placeBid", { auctionId: Data._id, bidAmount: newBidAmount, userEmail: email });
    setBidAmount(newBidAmount);
  };


  const leaveAuction = () => {
    console.log("User left auction");
    setLastBidder(null);
  };

  return (
    <div className="w-96 bg-gray-500 rounded-lg p-4 shadow-md">
      {lastBidder ? (
        <p className="text-white text-lg font-semibold text-center italic">
          Last Bid: {lastBidder}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-3 rounded-lg text-white font-semibold">
              <p className="text-sm">Quotation:</p>
              <p className="text-lg">{budget}</p>
              <section className="mt-8">
              <p className="text-sm">Least Offer:</p>
              <p className="text-lg">{budget/10}</p>
              </section>
            </div>
  
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-white px-2 py-1 rounded-md text-sm">My Bid</div>
              <div className="bg-gradient-to-r from-black to-blue-600 p-3 rounded-lg text-white font-semibold">
                {bidAmount || "----"}
              </div>
              <div className="bg-white px-2 py-1 rounded-md text-sm">Lowest Bid</div>
              <div className="bg-gradient-to-r from-black to-blue-600 p-3 rounded-lg text-white font-semibold">
                {lowestBid}
              </div>
            </div>
          </div>
  
          <div className="mt-4 bg-gray-700 p-4 rounded-lg flex items-center">
            <button className="bg-red-500 text-white text-sm px-3 py-1 rounded-md mr-2" onClick={handleBid}>
              Bid Now
            </button>
            <button className="bg-gray-400 px-3 py-1 rounded-md text-black italic" onClick={leaveAuction}>
              Leave Auction
            </button>
          </div>
        </>
      )}
    </div>
  );
  
};

export default BidCard;
