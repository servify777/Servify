import Carousal from './Carousal'
import Cards from './Cards';
import About from './About';
import { useState , useEffect} from 'react';

const Home = () => {
  const [cb,setCb] = useState([]);
    const carousalImage = [
        "https://th.bing.com/th/id/OIP.6FTXmVV6u0qf3iwZF-h8agHaEK?w=184&h=103&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th?id=OIP.r60V2-OCYbTI7lKZRpDNPQHaEK&w=333&h=187&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
  "https://th.bing.com/th/id/OIP.CPsj6NxZIRlovOCvkZ7C-wHaD4?w=184&h=96&c=7&r=0&o=5&pid=1.7",
  "https://th.bing.com/th/id/OIP.NKNbaxGWUQOFlQsWomf4KgHaEK?w=184&h=103&c=7&r=0&o=5&pid=1.7",
    ];

    useEffect(() => {
      const fetchCurrentBiddings = async () => {
        try {
          const fetching = await fetch('http://localhost:5000/cb/current-biddings');
          const data = await fetching.json(); // Missing 'await' fixed
          setCb(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchCurrentBiddings();
    }, []);
  return (
    <main>
        <Carousal images={carousalImage}/>
        
        <h1 className='new-font text-4xl mt-8 font-extrabold'>Current Bidding&apos;s : </h1>

        {/* Cards Here !.. */}
        <div className="relative flex justify-center gap-8 mt-4 mb-4">
            <Cards cb={cb}/>
            </div>
        <br></br>
        <br></br>
        <About />
    </main>
  )
}

export default Home