import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GiftCards.css";

const Modal = ({ isOpen, onClose, cardId }) => {
  const navigate = useNavigate();

  const [cardDetails, setCardDetails] = useState(null);
  const [productId, setProductId] = useState(null); // State to store the clicked product ID

  useEffect(() => {
    const fetchCardDetails = async () => {
      if (!cardId) return;

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/User/couponCardFill`,
          { couponCard_id: cardId },
          {
            headers: {
              "Content-Type": "application/json",
              "Auth-Token": localStorage.getItem("auth_token"),
            },
          }
        );
        setCardDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching card details:", error);
      }
    };

    fetchCardDetails();
  }, [cardId]);

  const handleProductClick = (productId) => {
    navigate("/cart", { state: { productId: productId } });
    setProductId(productId);
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
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
      onClick={onClose}
    >
      <div
        className="modal-content"
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
        {cardDetails && (
          <>
            <h2>{cardDetails.couponCard_name}</h2>
            <img
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
                cursor: "pointer",
              }}
              src={cardDetails.imagelink}
              alt={cardDetails.couponCard_name}
              onClick={() =>
                handleProductClick(cardDetails.product_details.product_id)
              }
            />
            <p>Discount Code: {cardDetails.discount_code}</p>
            {cardDetails.product_details && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h3>Product Details:</h3>
                  <p>Name: {cardDetails.product_details.product_name}</p>
                  <p>Price: {cardDetails.product_details.product_price}</p>
                </div>
                <div>
                  <img
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                      cursor: "pointer",
                    }}
                    src={cardDetails.product_details.imagelink}
                    alt={cardDetails.product_details.product_name}
                    onClick={() =>
                      handleProductClick(cardDetails.product_details.product_id)
                    }
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
