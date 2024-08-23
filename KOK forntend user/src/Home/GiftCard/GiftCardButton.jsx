
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GiftCard.css";

const GiftCardButton = () => {

  const navigate = useNavigate();
  const [data, setData] = useState("");

  const showGiftCard = () => {
    navigate("/contactUs");
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/User/footerimageFill`,
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
    <>
      <div className="contact-banner">
        <div className="contact-banner-part1">
          <div className="contact-details">
          <h1 >{data?.image_tital}</h1>
          <p className="">

            {data?.image_description}
          </p>
          <button className="Banner2_Button-2" onClick={showGiftCard}>
            Contact Us
          </button>
        </div>
        </div>
        <div className="contact-banner-part2">
          <img className="gift-img" src={data?.imagelink} />
        </div>
      </div>
    </>
  );
};

export default GiftCardButton;
