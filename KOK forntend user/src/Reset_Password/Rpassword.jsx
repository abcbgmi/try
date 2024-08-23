import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./Rpassword.css";

const Rpassword = () => {

  const [userEmail, setUserEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  let timeoutId;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        // "http://localhost:4000/User/changePasswordWithVerificationCode",
        `${process.env.REACT_APP_API_BASE_URL}/User/changePasswordWithVerificationCode`,
        {
          user_email: userEmail,
          user_password: userPassword,
          verify_code: verifyCode,
        }
      );
      if (response.status === 200) {
        if (response.data.status === 0) {
          toast.error("Verification Code is Not Valid!");
        } else {
          toast.success("Password reset successfully!");
          // Clear input fields
          setUserEmail("");
          setVerifyCode("");
          setUserPassword("");
          // Delay navigation to the login page by 2 seconds
          timeoutId = setTimeout(() => {
            navigate("/login");
          }, 4000);
        }
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200
        toast.error(error.response.data.message || "Try again ");
      } else {
        // Other errors (e.g., network errors)
        toast.error("Empty field is not allowed");
      }
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup timeout if the component unmounts
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return (
    <>
      <div className="Reset_Password">
        <div className="reset-password-container">
          <h2>Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="user_email">Email *</label>
              <input
                type="email"
                id="user_email"
                name="user_email"
                className="form-control"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="verify_code">Verify Code *</label>
              <input
                type="text"
                id="verify_code"
                name="verify_code"
                className="form-control"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div className="password-text">
                <label htmlFor="user_password">New Password *</label>
                <p
                  className="toggle-password-text"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </p>
              </div>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="user_password"
                  name="user_password"
                  className="form-control"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="reset-password-btn">
              Reset Password
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Rpassword;
