import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import "./Banner.css";

const Banner = () => {

  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/User/headerimagesFill`,
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (

    // <div className="">
    //   <Slider {...settings} style={{ width: "100%" }}>
    //     {data.map((item, index) => (
    //       <div key={index}>
    //         <img
    //           // style={{ height: "1920px", width:"100%", margin:"auto" }}
    //           src={item.imagelink}
    //           style={{ height: "100vh", width: "100%", margin: "auto" }}
    //         />
    //       </div>
    //     ))}
    //   </Slider>
    // </div>
    <div className="banner">
      <Slider {...settings}>
        {data.map((item, index) => (
          <div key={index} className="slide">
            <img
              src={item.imagelink}
              alt={`slide-${index}`}
              className="slide-image"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
