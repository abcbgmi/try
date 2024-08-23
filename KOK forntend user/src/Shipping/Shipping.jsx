import { useState } from "react";
import img1 from "./images/img1.svg";
import Porduct1 from "./images/Product1.png";
import "./Shipping.css";

const Shipping = () => {
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
      <div className="All_Two_part">
        <div className="Part1">
          <div className="Account_Part1">
            <div className="Account_hedar">
              <p className="Account_text">Account</p>
              <img src={img1} alt="img1" className="img1" />
              <p className="Account_text">Shipping</p>
              <img src={img1} alt="img1" className="img1" />
              <p>Payment</p>
            </div>
            <div>
              <p className="Account_text1">Shipping details</p>
              <div className="address_Shipping">
                <p>Use saved address</p>
                <select name="Address" className="Address_Select" id="Address">
                  <option value="123 , Electric avenue">
                    123 , Electric avenue
                  </option>
                </select>
              </div>
              <div className="Form_Shipping">
                <p className="Shipping_Text">First line of address</p>
                <input
                  type="text"
                  name="Address"
                  id="Address"
                  className="Address"
                  placeholder=" Enter Address"
                />
                <p className="Shipping_Text">Street name</p>
                <input
                  type="text"
                  name="Street"
                  id="Street"
                  className="Address"
                  placeholder="Enter Street"
                />
              </div>
              <div className="Address_Postcode">
                <div>
                  <p>Postcode</p>
                  <input
                    type="text"
                    name="Postcode"
                    id="Postcode"
                    className="Postcode"
                    placeholder="Enter Postcode"
                  />
                </div>
                <div>
                  <p>Select shipping</p>
                  <select
                    name="Select_shipping"
                    className="shipping_Address"
                    id="Select_shipping"
                  >
                    <option value="Free delivery">Free delivery</option>
                  </select>
                </div>
              </div>
              <hr />
              <div className="Shipping_bution">
                <p>Cancel order</p>
                <button className="Login_ButtionPart1">Payment</button>
              </div>
            </div>
          </div>
        </div>
        <div className="Part2">
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
        </div>
      </div>
    </>
  );
}

export default Shipping;
