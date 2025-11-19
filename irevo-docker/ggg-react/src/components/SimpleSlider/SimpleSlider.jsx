import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./SimpleSlider.css";

export const images = [
  "./images/iRevo.png",
  "./images/iRevo2.png",
  "./images/iRevo3.png",
  "./images/iRevo4.png",
  "./images/iRevo5.png",
];

export default function SimpleSlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '60px',
    autoplay: true,
    autoplaySpeed: 2400,
    pauseOnHover: true,
    focusOnSelect: true,
  };
  return (
    <Slider {...settings}>
      {images.map((src) => (
        <div className="image-container" key={src}>
          <img src={src} alt={`img-${src}`} />
        </div>
        
      ))}
    </Slider>
  );
}
