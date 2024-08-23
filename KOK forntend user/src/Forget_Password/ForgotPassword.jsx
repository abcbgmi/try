import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import "./ForgotPassword.css";
import undraw_my_password_re_ydq7 from "./undraw_my_password_re_ydq7 (1) 1.svg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email field is empty");
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        // "http://localhost:4000/User/forgotPassword",
        `${process.env.REACT_APP_API_BASE_URL}/User/forgotPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_email: email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        if (data.status === 1) {
          toast.success("Code Sent to Your Email.");
          setTimeout(() => {
            navigate("/Rpassword");
          }, 5000); // Delay navigation by 3 seconds
        } else {
          setEmail("");
          toast.error("User Not Exist With This Email!");
        }
      } else {
        toast.error("Failed to send password reset Email");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <div class="Main-container">
        <div class="container">
          <img
            src={undraw_my_password_re_ydq7}
            class="forgot_password_img"
            alt="forgot_password_img"
          />
          <h1 class="forgot_password_Title">Forgot your password?</h1>
          <p>Enter your Email we'll help you reset your password.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              class="input-field"
              placeholder="Enater Email"
            />
            <button class="continue-btn">Forgot Password</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ForgotPassword;
