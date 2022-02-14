// import React from "react";
// import Carousel from "react-material-ui-carousel";
import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

class DemoCarousel extends Component {
  render() {
    return (
      <Carousel
        swipeable={true}
        showArrows={true}
        useKeyboardArrows={true}
        infiniteLoop={true}
        autoPlay={false}
        showIndicators={false}
        dynamicHeight={true}
        transitionTime="500"
      >
        <div>
          <img src="assets/img/test.jpg" />
        </div>
        <div>
          <img src="assets/img/facebook.png" />
        </div>
        <div>
          <img src="assets/img/wide-angle-panorama-autumn-forestmisty-260nw-1195159864.jpg" />
        </div>
      </Carousel>
    );
  }
}

export default DemoCarousel;

// const Renderimages = ({ img }) => {
//   return (
//     <figure>
//       <img
//         src={img}
//         style={{
//           width: "100%",
//           height: "auto",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//         alt=""
//       />
//     </figure>
//   );
// };

// function FamilyPortrait({ family }) {
//   return (
//     <div>
//       <Carousel indicators={false} navButtonsAlwaysVisible={true}>
//         {family && family.imgs.map((img) => <Renderimages img={img.url} />)}
//       </Carousel>
//     </div>
//   );
// }

// export default FamilyPortrait;
