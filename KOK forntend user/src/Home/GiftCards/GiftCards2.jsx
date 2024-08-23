
import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal"; // Ensure correct import path
import "./GiftCards.css";

const GiftCards2 = () => {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const id = { couponCard_id: 0 };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/User/couponCardFill`,
        id,
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setSelectedCard(null);
  };

  const handleOpen = (card) => {
    setSelectedCard(card);
    setOpen(true);
  };

  return (
    <div className="couponCards-container">
      <h1>Coupon Cards</h1>
      <div className="couponCards">
        {data.map((item) => (
          <div
            key={item.couponCard_id}
            className="card"
            onClick={() => handleOpen(item)}
          >
            <img
              className="couponCards-image"
              src={item.imagelink}
              alt={item.couponCard_name}
            />
            <div className="card-body">
              <h4>{item.couponCard_name}</h4>
            </div>
          </div>
        ))}
      </div>
      {selectedCard && (
        <Modal isOpen={open} onClose={handleClose} cardId={selectedCard.couponCard_id} />
      )}
    </div>
  );
};

export default GiftCards2;
