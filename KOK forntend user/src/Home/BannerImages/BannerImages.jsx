
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BannerImages.css";

const BannerImages = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/User/headerimageoneFill`,
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      setData(response.data.data.imagelink);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log(data);

  const [data2, setData2] = useState([]);

  const fetchData2 = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/User/headerimagetwoFill`,
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      setData2(response.data.data.imagelink);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData2();
  }, []);
  console.log(data2);
  return (
    <div className="Banner2">
      <div>
        <img src={data} alt="Banner2_img" className="Banner2_img1" />
      </div>
      <div className="hh">
        <div className="Blank_box"></div>
        <img src={data2} alt="Banner2_img2" className="Banner2_img2" />
      </div>
    </div>
  );
};

export default BannerImages;
