// import React from "react";
// import Carousel from "react-material-ui-carousel";
import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

function FamilyPortrait({ family }) {
  return (
    <div>
      <Carousel
        showThumbs={true}
        swipeable={true}
        showArrows={true}
        useKeyboardArrows={true}
        infiniteLoop={true}
        autoPlay={true}
        showIndicators={false}
        dynamicHeight={true}
        transitionTime="500"
      >
        {family &&
          family.img.map((img) => (
            <div>
              <img src={img} />
            </div>
          ))}
      </Carousel>
    </div>
  );
}

export default FamilyPortrait;
