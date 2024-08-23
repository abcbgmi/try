import React, { useState, useEffect } from "react";
import Porduct1 from "./images/Product1.png";
import "./Payment.css";

const Payment = () => {
  const [country, setCountry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [lastName, setLastName] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const pricePerItem = 999;
  const tax = 80;
  const shipping = 0;

  const increment = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrement = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };
  const subtotal = pricePerItem * quantity;
  const total = subtotal + tax + shipping;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("http://localhost:4000/User/paymentIn"); // Replace with your API endpoint
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const data = await response.json();
  //     } catch (error) {
  //       setError(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Place order</h1>
      <div className="Payment">
        <div>
          <form className="delivery-form">
            <h2>Delivery Form</h2>

            <div className="Name">
              <input
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Enter first name"
              />
              <input
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Enter Last name"
              />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter your number"
            />
            <input
              type="email"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter your email"
            />
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Enter your Address"
            />
            <div className="Name">
              <input
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Enter your City"
              />
              <input
                type="text"
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                placeholder="Enter your Country"
              />
            </div>
            <div className="Name">
              <input
                type="text"
                value={state}
                onChange={(event) => setState(event.target.value)}
                placeholder="Enter your State"
              />
              <input
                type="text"
                value={pinCode}
                onChange={(event) => setPinCode(event.target.value)}
                placeholder="Enter your  PIN Code"
              />
            </div>
          </form>
        </div>
        <div>
          <div className="Porduct1_header">
            <p className="Order_Summary">Order Summary</p>
            <img src={Porduct1} alt="Porduct1" className="Porduct1" />
          </div>
          <div className="Price_Section">
            <div className="Price_Section1">
              <p>Passport Cover</p>
              <p>₹{pricePerItem}</p>
            </div>
          </div>
          <div className="Price">
            <div>
              <p>Sub total</p>
              <p>Tax</p>
              <p>Shipping</p>
              <p>
                <b>Total</b>
              </p>
            </div>
            <div>
              <p>₹{subtotal}</p>
              <p>₹{tax}</p>
              <p className="Free_text">
                {shipping === 0 ? "Free" : `₹${shipping}`}
              </p>
              <p>₹{total}</p>
              <div>
                <button>Place order</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
