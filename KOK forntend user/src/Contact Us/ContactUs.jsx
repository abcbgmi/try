

import { useState } from "react";
import axios from "axios";
import { Input, message } from "antd";
import GoogleMap from "./GoogleMap ";
import map_img from "./Images/Location Icon.svg";
import Call_img from "./Images/Phone Icon.svg";
import Email_img from "./Images/Email Icon.svg";
import "./ContactUs.css";

const inputStyle = {
  marginBottom: "16px",
};

const { TextArea } = Input;

const ContactUs = () => {

  const [state, setState] = useState({
    user_first_name: "",
    user_last_name: "",
    user_email: "",
    user_mobile_no: "",
    msg: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { user_first_name, user_last_name, user_email, user_mobile_no, msg } = state;
    let validationErrors = {};

    if (!user_first_name) validationErrors.user_first_name = "First Name is required";
    else if (user_first_name.length < 3) validationErrors.user_first_name = "First Name must be at least 3 characters long";
    if (!user_last_name) validationErrors.user_last_name = "Last Name is required";
    if (!user_email) validationErrors.user_email = "Email is required";
    if (!user_mobile_no) validationErrors.user_mobile_no = "Phone Number is required";
    if (!msg) validationErrors.msg = "Message is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/User/footerContactPage`,
        state,
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      console.log('response::==++', response)
      message.success("Message sent successfully!");
      setState({
        user_first_name: "",
        user_last_name: "",
        user_email: "",
        user_mobile_no: "",
        msg: "",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to send message. Please try again.");
    }
  };

  return (
    <>
      <div className="Contact">
        <div className="Contact1">
          <div className="Contact_part1">
            <h1 className="Get_text">Get in touch</h1>
            <hr className="Get_hr" />
            <form className="Contact_from">
              <lable className="form-lable">First Name</lable>
              <Input
                name="user_first_name"
                placeholder="First Name"
                value={state.user_first_name}
                onChange={handleChange}
                style={inputStyle}
              />
              <div className="error-message-container">
                {errors.user_first_name && <p className="error-message">{errors.user_first_name}</p>}
              </div>
              <lable className="form-lable">Last Name</lable>
              <Input
                name="user_last_name"
                placeholder="Last Name"
                value={state.user_last_name}
                onChange={handleChange}
                style={inputStyle}
              />
              <div className="error-message-container">
                {errors.user_last_name && <p className="error-message">{errors.user_last_name}</p>}
              </div>
              <lable className="form-lable">Email Address</lable>
              <Input
                name="user_email"
                placeholder="Enter Email"
                value={state.user_email}
                onChange={handleChange}
                style={inputStyle}
              />
              <div className="error-message-container">
                {errors.user_email && <p className="error-message">{errors.user_email}</p>}
              </div>
              <lable className="form-lable">Phone Number</lable>
              <Input
                name="user_mobile_no"
                placeholder="Mobile Number"
                value={state.user_mobile_no}
                onChange={handleChange}
                style={inputStyle}
              />
              <div className="error-message-container">
                {errors.user_mobile_no && <p className="error-message">{errors.user_mobile_no}</p>}
              </div>
              <lable className="form-lable">Message</lable>
              <TextArea
                name="msg"
                placeholder="Enter Message"
                value={state.msg}
                onChange={handleChange}
                style={inputStyle}
              />
              <div className="error-message-container">
                {errors.msg && <p className="error-message">{errors.msg}</p>}
              </div>
              <button type="submit" className="Get_button" onClick={handleSubmit}>
                Submit
              </button>
            </form>
          </div>
        </div>
        <div className="Contact2">
          <div className="Contact_Part2">
           
            <GoogleMap />
            <div className="map-main-div">
              <div className="map_div">
                <img src={map_img} alt="map_img" className="map_img" />
                <p>
                  A 44-45 , Sumeru City Mall, <br /> Sudama Chowk, Mota Varacha,
                </p>
              </div>
              <div className="Call_div">
                <img src={Call_img} alt="Call_img" className="Call_img" />
                <p>+91 96648 03121</p>
              </div>
              <div className="Email_div">
                <img src={Email_img} alt="Email_img" className="Email_img" />
                <p>info@ivyaaggarwal.net</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
