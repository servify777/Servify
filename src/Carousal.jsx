/* eslint-disable no-unused-vars */
import React from 'react'
import { useState,useEffect } from 'react'
const Carousal = ({images}) => {
    console.log("Images for Carousal !...",images)
    const [currentIndex,setCurrentIndex] = useState(0);

    useEffect(()=>{
        // setting the interval
        const interval = setInterval(()=>{
            nextSlide();
        },3000);

        return ()=>{clearInterval(interval)}
    },[currentIndex]);

    // moving to nexct slide 
    const nextSlide = ()=>{
        setCurrentIndex((preIndex)=>(preIndex + 1 ) % images.length);
    }

    // moving to previous slide 
    const prevSlide = ()=>{
        setCurrentIndex((preIndex)=>(preIndex === 0 ? images.length - 1 : preIndex -1));
    }

  return (
    <div className='relative w-full mx-auto mt-32' >
        <img src={images[currentIndex]} alt={`Carousal${currentIndex}`} className='bg-red-200 w-full h-80 object-cover rounded-lg transition-opacity duration-500'/>
        {/* previous button */}
        <button onClick={prevSlide} className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full'>❮</button>
        <button onClick={nextSlide} className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full'>❯</button>
    </div>
  )
}

export default Carousal