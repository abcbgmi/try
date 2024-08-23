import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "./images/img1.svg";
import "./Account.css";

function Account() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginClick = async () => {
    try {
      // const response = await fetch("http://localhost:4000/User/login", {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/User/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: email,
          user_password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate("/shipping");
      } else {
        console.error("Login failed", await response.json());
        navigate("/");
      }
    } catch (error) {
      console.error("An error occurred", error);
      navigate("/");
    }
  };

  const handleShippingClick = () => {
    navigate("/shipping");
  };

  const handleRegisterClick = () => {
    navigate("/registration");
  };

  return (
    <div className="All_Two_part">
      <div className="Part1">
        <div className="Account_Part1">
          <div className="Account_hedar">
            <p className="Account_text">Account</p>
            <img src={img1} alt="img1" className="Account_img1" />
            <p>Shipping</p>
            <img src={img1} alt="img1" className="Account_img1" />
            <p>Payment</p>
          </div>

          <div>
            <p className="Account_text1">Account details</p>
            <div>
              <p className="Email_text">Email Address</p>
              <input
                type="email"
                name="Email"
                id="Email"
                placeholder="Email@myemail.com"
                className="Email_InputBox"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="Password_text">Email Password</p>
              <input
                className="Email_Password"
                type="password"
                name="password"
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="Login_Buttion">
              <p className="Register_Form" onClick={handleRegisterClick}>
                Register for account
              </p>
              <button className="Login_ButtionPart" onClick={handleLoginClick}>
                Login
              </button>
            </div>
            <hr />
            <div className="Shipping_bution">
              <p>Cancel order</p>
              <button
                className="Login_ButtionPart1"
                onClick={handleShippingClick}
              >
                Shipping details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
