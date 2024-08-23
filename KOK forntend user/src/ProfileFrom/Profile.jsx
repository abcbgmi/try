
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    user_first_name: "",
    user_last_name: "",
    user_mobile_no: "",
    user_email: "",
    user_address: "",
    user_pincode: "",
    user_country: "",
    user_state: "",
    user_profile_photo: "",
    imagelink: "",
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let errorMsg = "";
    switch (name) {
      case "user_first_name":
      case "user_last_name":
        if (!value.trim()) {
          errorMsg = `${name.split('_').join(' ')} is required`;
        }
        break;
      case "user_mobile_no":
        if (!value.trim()) {
          errorMsg = "Mobile number is required";
        } else if (!/^\d{10}$/.test(value)) {
          errorMsg = "Mobile number should be 10 digits";
        }
        break;
      case "user_pincode":
        if (!value.trim()) {
          errorMsg = "Pincode is required";
        } else if (!/^\d{6}$/.test(value)) {
          errorMsg = "Pincode should be 6 digits";
        }
        break;
      case "user_email":
        if (!value.trim()) {
          errorMsg = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMsg = "Enter a valid email";
        }
        break;
      case "user_address":
        if (!value.trim()) {
          errorMsg = "Address is required";
        }
        break;
      case "user_country":
        if (!value.trim()) {
          errorMsg = "Country is required";
        }
        break;
      case "user_state":
        if (!value.trim()) {
          errorMsg = "State is required";
        }
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const validateForm = () => {
    const validationErrors = {};
    for (const key in userData) {
      validateField(key, userData[key]);
      if (errors[key]) {
        validationErrors[key] = errors[key];
      }
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const updateUserData = async () => {
    const formData = new FormData();
    formData.append("user_id", localStorage.getItem("user_id"));
    for (const key in userData) {
      if (key !== "user_email") {
        formData.append(key, userData[key]);
      }
    }
    if (image) {
      formData.append("image", image);
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/User/update`,
        {
          method: "POST",
          headers: {
            "Auth-Token": localStorage.getItem("auth_token"),
          },
          body: formData,
        }
      );
      const data = await response.json();
      if (data.status === 1) {
        toast.success(data.msg);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("An error occurred while updating user data");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      updateUserData();
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const body = {
        user_id: localStorage.getItem("user_id"),
      };
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/User/fill`,
          {
            method: "POST",
            headers: {
              "Auth-Token": localStorage.getItem("auth_token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );
        const data = await response.json();
        if (data && data.data) {
          setUserData({
            user_first_name: data.data.user_first_name || "",
            user_last_name: data.data.user_last_name || "",
            user_mobile_no: String(data.data.user_mobile_no) || "",
            user_email: data.data.user_email || "",
            user_address: data.data.user_address || "",
            user_pincode: data.data.user_pincode || "",
            user_country: data.data.user_country || "",
            user_state: data.data.user_state || "",
            user_profile_photo: data.data.imagelink || "",
          });
        } else {
          toast.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("An error occurred while fetching user data");
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="main-profile">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="inputs">
          <div className="input-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="user_first_name"
              placeholder="First Name"
              className="input-field"
              value={userData.user_first_name}
              onChange={handleInputChange}
            />
            {errors.user_first_name && (
              <span className="error-message">{errors.user_first_name}</span>
            )}
          </div>
          <div className="input-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="user_last_name"
              placeholder="Last Name"
              className="input-field"
              value={userData.user_last_name}
              onChange={handleInputChange}
            />
            {errors.user_last_name && (
              <span className="error-message">{errors.user_last_name}</span>
            )}
          </div>
        </div>
        <div className="inputs">
          <div className="input-group">
            <label className="form-label">Mobile Number</label>
            <input
              type="text"
              name="user_mobile_no"
              placeholder="Mobile Number"
              className="input-field"
              value={userData.user_mobile_no}
              onChange={handleInputChange}
            />
            {errors.user_mobile_no && (
              <span className="error-message">{errors.user_mobile_no}</span>
            )}
          </div>
          <div className="input-group">
            <label className="form-label">Enter Pincode</label>
            <input
              type="text"
              name="user_pincode"
              placeholder="Enter Pincode"
              className="input-field"
              value={userData.user_pincode}
              onChange={handleInputChange}
            />
            {errors.user_pincode && (
              <span className="error-message">{errors.user_pincode}</span>
            )}
          </div>
        </div>
        <div className="inputs-2">
          <div className="input-group">
            <label className="form-label">Enter Address</label>
            <input
              type="text"
              name="user_address"
              placeholder="Enter Address"
              className="input-field"
              value={userData.user_address}
              onChange={handleInputChange}
            />
            {errors.user_address && (
              <span className="error-message">{errors.user_address}</span>
            )}
          </div>
          <div className="input-group">
            <label className="form-label">Enter Email</label>
            <input
              type="text"
              name="user_email"
              placeholder="Enter Email"
              className="input-field"
              value={userData.user_email}
              readOnly
            />
          </div>
        </div>
        <div className="inputs">
          <div className="input-group">
            <label className="form-label">Enter Country</label>
            <input
              type="text"
              name="user_country"
              placeholder="Enter Country"
              className="input-field"
              value={userData.user_country}
              onChange={handleInputChange}
            />
            {errors.user_country && (
              <span className="error-message">{errors.user_country}</span>
            )}
          </div>
          <div className="input-group">
            <label className="form-label">Enter State</label>
            <input
              type="text"
              name="user_state"
              placeholder="Enter State"
              className="input-field"
              value={userData.user_state}
              onChange={handleInputChange}
            />
            {errors.user_state && (
              <span className="error-message">{errors.user_state}</span>
            )}
          </div>
        </div>
        <div>
          <img src={userData.user_profile_photo} alt="" className="Show_img" />
          <input
            type="file"
            name="image"
            className="input-field"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Profile;
