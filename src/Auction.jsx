import { useEffect, useState } from "react";
import BidCard from "./BidCard";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });

const Auction = () => {
    const [Data,setData] = useState([]);

    useEffect(()=>{
      const fetchAuctions = async () => {
        const email = localStorage.getItem("email");
        const response = await fetch("http://localhost:5000/cb/auction-data", {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ email }),
        });
        const rd = await response.json();
        if (response.ok) {
            setData(rd.data);
        } else {
            alert(rd.message);
        }
    };

        const handleAuctionFetch = async ()=>{
            const email = localStorage.getItem('email');
            const response = await fetch('http://localhost:5000/cb/auction-data',{
                headers:{'Content-Type':'application/json'},
                method:'POST',
                body:JSON.stringify({email})
            });
            const rd = await response.json();
            if(response.ok){
                console.log('Data For Auctions : ',rd.data);
                setData(rd.data);
            }
            else{
                alert(rd.message);
            }
        }

        handleAuctionFetch();
        fetchAuctions();

        // Listen for auction updates
        socket.on("updateAuction", (updatedAuction) => {
          setData((prevData) =>
              prevData.map((auction) =>
                  auction._id === updatedAuction._id ? updatedAuction : auction
              )
          );
      });

      return () => socket.off("updateAuction");
    },[]);


    return (
      <div className="flex items-center justify-center  min-h-screen mt-32">
        <main className="transparent-card p-5 min-w-fit m-4">
            <h1 className="new-font text-4xl mb-4">Auctions For You:</h1>
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
      <h2 className="text-xl font-semibold" key={index}>{Data.tittle}</h2>
      <p className="text-gray-600" key={index}>{Data.client}</p>
      <h4 className="text-gray-700 mt-2" key={index}>
        Description: {Data.description}
      </h4>
      <hr />
    </div>
    <BidCard Data = {Data} budget={Data.budget}/>
  </section>
                    </>
                )
            })
          )}
        </main>
      </div>
    );
  }
  
  export default Auction;
  