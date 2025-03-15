import Carousal from './Carousal'
import Cards from './Cards';
import About from './About';
import { useState , useEffect} from 'react';

const Home = () => {
  const [cb,setCb] = useState([]);
    const [image,setImage] = useState([]);
    const carousalImage = [
        `http://localhost:5000/carousal/${image[0]}`,
  `http://localhost:5000/carousal/${image[1]}`,
  `http://localhost:5000/carousal/${image[2]}`,
  `http://localhost:5000/carousal/${image[3]}`,
  `http://localhost:5000/carousal/${image[4]}`
    ];

    useEffect(() => {

      const handleImageFetch = async ()=>{
        try {
          const response = await fetch('http://localhost:5000/api/images');
          const Data = await response.json();
          setImage(Data.images);
        } catch (error) {
          console.error('Error While Trying to Fetch Carousal Images : ',error);
          
        }
      }
      const fetchCurrentBiddings = async () => {
        try {
          const fetching = await fetch('http://localhost:5000/cb/current-biddings');
          const data = await fetching.json(); // Missing 'await' fixed
          setCb(data);
          
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      handleImageFetch();
      fetchCurrentBiddings();
    }, []);
  return (
    <main>
        <Carousal images={carousalImage}/>
        {console.log('Array From Carousal : ',image)}
        <h1 className='new-font text-4xl mt-8 font-extrabold '>Current Bidding&apos;s : </h1>

        {/* Cards Here !.. */}
        <div className="relative flex justify-center gap-8 mt-8  mb-4">
            <Cards cb={cb}/>
            </div>
        <br></br>
        <br></br>
        <About />
    </main>
  )
}

export default Home