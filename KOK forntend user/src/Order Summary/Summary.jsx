import React, { useState } from "react";
import Porduct1 from "./images/Product1.png";

function Summary() {
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

  return (
    <>
      <div className="Porduct1_header">
        <p className="Order_Summary">Order Summary</p>
        <img src={Porduct1} alt="Porduct1" className="Porduct1" />
      </div>
      <div className="Price_Section">
        <div className="Price_Section1">
          <p>Passport Cover</p>
          <p>₹{pricePerItem}</p>
        </div>
        <div className="Price_Section2">
          <button onClick={decrement} className="increment">
            -
          </button>
          <p>{quantity}</p>
          <button onClick={increment}>+</button>
        </div>
      </div>
      <p className="GiftCard">Gift Card / Discount code</p>
      <div className="Code">
        <input type="text" name="Code" id="Code" className="Code_input" />
        <button className="Applay_Button">Apply</button>
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
        </div>
      </div>
    </>
  );
}

export default Summary;
