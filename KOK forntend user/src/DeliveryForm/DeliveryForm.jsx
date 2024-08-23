import React, { useState } from "react";
import "./DeliveryForm.css";

const DeliveryForm = () => {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="delivery-form">
      <div className="form-section">
        <h2>Delivery</h2>
        <div className="form-group">
          <label htmlFor="country">Country/Region</label>
          <select id="country" className="form-control">
            <option value="India">India</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First name</label>
          <input
            type="text"
            id="firstName"
            className="form-control"
            value={state.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last name</label>
          <input
            type="text"
            id="lastName"
            className="form-control"
            value={state.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="company">Company (optional)</label>
          <input
            type="text"
            id="company"
            className="form-control"
            value={state.company}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            className="form-control"
            value={state.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="apartment">Apartment, suite, etc. (optional)</label>
          <input
            type="text"
            id="apartment"
            className="form-control"
            value={state.apartment}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            className="form-control"
            value={state.city}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <select id="state" className="form-control" value={state.state} onChange={handleChange}>
            <option value="">Select State</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="pinCode">PIN code</label>
          <input
            type="text"
            id="pinCode"
            className="form-control"
            value={state.pinCode}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            className="form-control"
            value={state.phone}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
};

export default DeliveryForm;
