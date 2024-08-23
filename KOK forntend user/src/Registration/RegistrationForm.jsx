
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img1 from "./images/A1.jpg";
import "./RegistrationForm.css";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values) => {
    const { firstName, lastName, email, user_mobile_no, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/User/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_first_name: firstName,
            user_last_name: lastName,
            user_email: email,
            user_password: password,
            user_confirm_password: confirmPassword,
            user_mobile_no: user_mobile_no,
          }),
        }
      );
    
      const result = await response.json();

      if (response.ok) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error(result.message || result.msg);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleShowPasswordChange = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <ToastContainer />
      <div className="register-section">
        <div className="User_registration">
          <div className="main-form-box">
            <div className="registration_form">
              <Form
                onFinish={handleSubmit}
                className="registration-form"
              >
                <h2 className="form-title">Create Account</h2>
                <div className="Name">
                  <Form.Item
                    name="firstName"
                    rules={[{ required: true, message: "Please input your first name!" }]}
                  >
                    <Input placeholder="First Name" />
                  </Form.Item>
                  <Form.Item
                    name="lastName"
                    rules={[{ required: true, message: "Please input your last name!" }]}
                  >
                    <Input placeholder="Last Name" />
                  </Form.Item>
                </div>
                <div className="Email_Address">
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Please input your email!" },
                      { type: "email", message: "The input is not a valid email!" },
                    ]}
                  >
                    <Input placeholder="Email address" />
                  </Form.Item>
                  <Form.Item
                    name="user_mobile_no"
                    rules={[{ required: true, message: "Please input your mobile number!" }]}
                  >
                    <Input placeholder="Mobile Number" />
                  </Form.Item>
                </div>
                <div className="Password">
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                  >
                    <Input.Password placeholder="Password" type={showPassword ? "text" : "password"} />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    rules={[{ required: true, message: "Please confirm your password!" }]}
                  >
                    <Input.Password placeholder="Confirm password" type={showPassword ? "text" : "password"} />
                  </Form.Item>
                </div>
                <Form.Item>
                  <Checkbox checked={showPassword} onChange={handleShowPasswordChange}>Show Password</Checkbox>
                </Form.Item>
                <Button type="primary" htmlType="submit" className="submit_button">
                  Register
                </Button>
                <p className="form-SubTitle">
                  <Link to="/login">
                    Already have an account?
                  </Link>
                </p>
              </Form>
            </div>
            <div className="register-img">
              <img src={img1} alt="Registration Illustration" className="img1-register" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
