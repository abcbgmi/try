
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoEyeSharp } from "react-icons/io5";
import { PiEyeSlashFill } from "react-icons/pi";
import axios from "axios";
import "./LoginForm.css";

const LoginForm = () => {
  const [user_email, setUserEmail] = useState("");
  const [user_password, setUserPassword] = useState("");
  const [showUserPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSignupRedirect = () => {
    navigate("/registration");
  };

  const handleForgotPasswordRedirect = () => {
    navigate("/forgotPassword");
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!user_email.trim()) {
      validationErrors.user_email = "Email or phone number is required";
    } else if (!/\S+@\S+\.\S+/.test(user_email) && !/^\d{10}$/.test(user_email)) {
      validationErrors.user_email = "Enter a valid email or phone number";
    }

    if (!user_password.trim()) {
      validationErrors.user_password = "Password is required";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/User/login`, {
        user_email,
        user_password,
      });
      if (response.data.status === 1) {
        const authToken = response.data.data.auth_token;
        const userId = response.data.data.user_id;
        localStorage.setItem("auth_token", authToken);
        localStorage.setItem("user_id", userId);
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(response.data.message || response.data.m);
      }
      setUserEmail("");
      setUserPassword("");
    } catch (error) {
      console.error("Login failed:", error.message);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
    setErrors({
      ...errors,
      user_email: '',
    });
  };

  const handlePasswordChange = (e) => {
    setUserPassword(e.target.value);
    setErrors({
      ...errors,
      user_password: '',
    });
  };

  return (
    <>
      <div className="background">
        <div className="Login_From">
          <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-header">Sign in</div>
              <div className="form-group">
                <p>Email or phone number</p>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Email or mobile phone number"
                  value={user_email}
                  onChange={handleEmailChange}
    
                />
                {errors.user_email && <span className="error-message">{errors.user_email}</span>}
              </div>
              <div className="form-group">
                <p>Password</p>
                <div className="pass-wrapper">
                  <input
                    type={showUserPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Your password"
                    value={user_password}
                    onChange={handlePasswordChange}
                    
                  />
                  <span
                    className="show-password"
                    onClick={togglePasswordVisibility}
                  >
                    {showUserPassword ?
                      <PiEyeSlashFill style={{ fontSize: "28px" }} />
                      :
                      <IoEyeSharp style={{ fontSize: "28px" }} />}
                  </span>
                </div>
                {errors.user_password && <span className="error-message">{errors.user_password}</span>}
              </div>
              <div
                className="form-links"
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginBottom: "20px",
                }}
              >
                <span className="link" onClick={handleForgotPasswordRedirect}>
                  Forget your password
                </span>
              </div>
              <button type="submit" className="login-button">
                Log in
              </button>
              <div className="signup-section">
                <p>
                  Don't have an Account?{" "}
                  <Link
                    to="/registration"
                    style={{ color: "#3395ff", textDecoration: "none" }}
                  >
                    Register
                  </Link>
                </p>
                <div className="terms-agreement">
                  By continuing, you agree to the Terms of use and Privacy
                  Policy.
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default LoginForm;
