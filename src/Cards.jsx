import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Cards = ({ cb }) => {
  const [startIndex, setStartIndex] = useState(0);
  const cardsToShow = 4;
  const cardsToMove = 4;
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  const handleRedirect = (_id)=>{
    navigate(`/details/${_id}`);
  }

    const handleImage  = async (url)=>{
      const response = await fetch('http://localhost:5000/image',{
        headers:{'Content-Type':'application/json'},
        method:'POST',
        body:JSON.stringify({url})
      });
      const data = await response.json();
      console.log('Image URL from Server : ',data.path);
      return data.path;
    }
  useEffect(() => {
    console.log("Updated startIndex:", startIndex);
  }, [startIndex]);

  const nextSlide = () => {
    console.log("Before update:", startIndex);
    if (startIndex + cardsToShow < cb.length) {
      setDirection(1); // Forward animation
      setStartIndex(startIndex + cardsToMove);
    }
  };

  const prevSlide = () => {
    console.log("Before update:", startIndex);
    if (startIndex > 0) {
      setDirection(-1); 
      setStartIndex(startIndex - cardsToMove);
    }
  };

  console.log("value from home:", cb);

  return (
    <div className="relative flex justify-center items-center gap-8 overflow-hidden w-full">
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
        onClick={prevSlide}
      >
        ❮
      </button>

      <motion.div
        key={startIndex} // Forces re-render to animate when index changes
        initial={{ opacity: 0, x: direction * 100 }} // Start position
        animate={{ opacity: 1, x: 0 }} // Transition to normal position
        exit={{ opacity: 0, x: -direction * 100 }} // Exit animation
        transition={{ type: "spring", stiffness: 120, damping: 10 }} // Smooth transition
        className="flex gap-4"
      >
        {cb.slice(startIndex, startIndex + cardsToShow).map( (data, index) => (
          <motion.div
            key={index}
            className="items-center w-80 p-4 bg-white border-2 border-gray-300 rounded-lg shadow-md text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full h-32 flex items-center justify-center bg-gray-200 rounded-t-lg mt-4">
            <img src={`http://localhost:5000/project-profile/${data.url.split('\\').pop()}`} 
     alt={data.title} 
     className="m-4 object-fit h-32"/>
            </div>
            <div className="p-4">
              <h2 className="italic text-lg font-semibold mt-4">{data.title}</h2>
              <p className="text-sm line-clamp-3 text-gray-600 mt-2">{data.description}</p>
              <button
                style={{ background: "linear-gradient(90deg, #A66EFE, #7AC7FF)" }}
                className="p-2 rounded-2xl text-white new-font text-lg mt-4"
                onClick={()=>handleRedirect(data._id)}
              >
                View Details ❯...
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Right Button */}
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
        onClick={nextSlide}
      >
        ❯
      </button>
    </div>
  );
};

export default Cards;
