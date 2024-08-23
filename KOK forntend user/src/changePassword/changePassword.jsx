
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo_images from "./images/Logo.png";
import "./changePassword.css";

const ChangePassword = ({ userId }) => {
  const navigate = useNavigate();
  const [old_password, setOld_password] = useState("");
  const [new_password, setNew_password] = useState("");
  const [new_confirm_password, setNew_confirm_password] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "old_password") {
      setOld_password(value);
    } else if (name === "new_password") {
      setNew_password(value);
      setPasswordsMatch(value === new_confirm_password);
    } else if (name === "new_confirm_password") {
      setNew_confirm_password(value);
      setPasswordsMatch(value === new_password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new_password !== new_confirm_password) {
      setPasswordsMatch(false);
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/User/changePassword`,
        {
          method: "POST",
          headers: {
            "Auth-Token": localStorage.getItem("auth_token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            old_password,
            new_password,
            new_confirm_password,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        if (
          responseData.status === 1 &&
          responseData.msg === "Password Changed."
        ) {
          // Handle success, possibly navigate away or show success message
          setTimeout(() => {
            navigate("/login");
          }, 5000);
        } else {
          // Handle other success statuses or messages here if needed
          console.log(responseData.msg);
        }
      } else {
        const responseData = await response.json();
        if (
          responseData.status === 0 &&
          responseData.msg === "Old_Password is Wrong!"
        ) {
          // Handle incorrect old password error
          console.log("Old password is incorrect. Please try again.");
        } else if (responseData.msg) {
          // Handle other error messages
          console.log(responseData.msg);
        } else {
          console.error("An error occurred. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      console.error("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <div className="ChangPassword">
        <div className="ChangPassword_container">
          <img src={Logo_images} alt="Logo_images" className="Logo_images" />
          <hr />
          <h3 className="Change_Text">Change Password</h3>
          <form onSubmit={handleSubmit}>
            <input
              type={showPassword ? "text" : "password"}
              name="old_password"
              value={old_password}
              onChange={handleChange}
              placeholder="Old password"
              className="changePassword_input"
            />
            <br />
            <input
              type={showPassword ? "text" : "password"}
              name="new_password"
              value={new_password}
              onChange={handleChange}
              placeholder="New password"
              className="changePassword_input"
            />
            <br />
            <input
              type={showPassword ? "text" : "password"}
              name="new_confirm_password"
              value={new_confirm_password}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="changePassword_input"
            />
            <br />
            {!passwordsMatch && (
              <span className="error-message">Passwords do not match.</span>
            )}
            <div className="ChangPassword_chackBox">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />{" "}
              <label>{showPassword ? "Hide password" : "Show password"}</label>
            </div>
            <br />
            <button className="ChangPassword_button" type="submit">
              Reset
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
