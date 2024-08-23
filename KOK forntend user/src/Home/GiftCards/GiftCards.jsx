import React, { useState, useEffect } from "react";
import axios from "axios";

const Modal = ({ isOpen, onClose, children }) => {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    const id = { couponCard_id: 1 };
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

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          margin: "auto",
          padding: "2%",
          border: "2px solid #000",
          borderRadius: "10px",
          boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const GiftCards = () => {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [data, setData] = useState([]);

  const handleClose = () => {
    setOpen(false);
    setSelectedCard(null);
  };

  const handleOpen = (card) => {
    setSelectedCard(card);
    setOpen(true);
  };

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

  return (
    <div>
      <h1>Gift Cards</h1>
      <div className="gift-cards">
        {data.map((item) => (
          <div
            key={item.couponCard_id}
            className="card-gift"
            onClick={() => handleOpen(item)}
          >
            <img
              style={{ width: "300px", height: "200px", border: "none" }}
              src={item.imagelink}
              alt={item.couponCard_name}
            />
            <div className="card-body" style={{ textAlign: "center" }}>
              <h4>{item.couponCard_name}</h4>
            </div>
          </div>
        ))}

        <Modal isOpen={open} onClose={handleClose}>
          {selectedCard && (
            <>
              <img
                style={{ width: "100%" }}
                src={selectedCard.imagelink}
                alt={selectedCard.couponCard_name}
              />
              <h4>{selectedCard.couponCard_name}</h4>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default GiftCards;
