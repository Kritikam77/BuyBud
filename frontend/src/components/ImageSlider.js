// ImageSlider.js
import React, { useEffect, useState } from "react";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const ImageSlider = ({ imageArr }) => {
  const [current, setCurrent] = useState(0);
  const [images, setImages] = useState();
  const length = imageArr.length;


  useEffect(() => {
    const fetchImage = async () => {
      try {
        imageArr.forEach(async(image) => {
          const response = await fetch(image.url);
          const blob = await response.blob(); // Convert response to Blob object
          setImages((prevImages)=>{
            return [...prevImages,blob]
          });
        });
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();

    setTimeout(() => {
      console.log(images)
    }, 3000);
  }, []);

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(imageArr) || imageArr.length <= 0) {
    return null;
  }

  
 

  return (
    <section className="slider-container">
      <ChevronLeftIcon className="arrow left-arrow" onClick={prevSlide} />
      <ChevronRightIcon className="arrow right-arrow" onClick={nextSlide} />
      {imageArr.map((slide, index) => (
        <div
          className={index === current ? "slide active" : "slide"}
          key={index}
        >
          {index === current && <img src={slide.url} alt={`slide-${index}`} />}
        </div>
      ))}
    </section>
  );
};

export default ImageSlider;
