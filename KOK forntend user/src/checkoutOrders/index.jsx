import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Razorpay from "razorpay";
import { Input, message } from "antd";
import { PiAddressBook } from "react-icons/pi";
import ProductImage from "./assets/img/Product3.png";

import ShippingAdd from "./shippingAdd";
import "./CheckoutOrders.css";

const inputStyle = {
  margin: "8px",
};

const CheckoutOrders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order_id } = location.state || {};

  const [orderData, setOrderData] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [couponCodes, setCouponCodes] = useState([]);
  const [discountAmounts, setDiscountAmounts] = useState([]);

  useEffect(() => {
    fetchData();
  }, [order_id]);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/User/OrderGet`,
        { order_id },
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      setOrderData(response.data.data);
      console.log(
        "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",
        response.data.data
      );
      setCouponCodes(response.data.data.subData.map(() => ""));
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const handleShippingAdd = () => {
    setOpen(true);
  };

  const handleAddressAdd = (newAddress) => {
    setSelectedShippingAddress(newAddress);
    setOpen(false);
  };

  const handleCouponCodeChange = (e, index) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      const newCouponCodes = [...couponCodes];
      newCouponCodes[index] = value;
      setCouponCodes(newCouponCodes);
    }
  };

  const handleApplyBtnClick = async (index) => {
    const couponCode = couponCodes[index];
    if (couponCode.length !== 6) {
      message.error("Coupon code must be 6 digits.");
      return;
    }
    try {
      const payload = {
        order_id: order_id,
        product_id: orderData?.subData[index]?.product_id,
        order_coupon_code: couponCode,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/User/applyCodeOnOrder`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      setDiscountAmounts(response.data.data);
      fetchData();
    } catch (error) {
      console.error("Error applying coupon code:", error);
      // message.error("Error applying coupon code.");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
    };
    document.body.appendChild(script);
  }, []);

  const handlePayBtnClick = async () => {
    try {
      let totalPayableAmt = 0;
      if (orderData?.subData?.length > 0) {
        totalPayableAmt =
          orderData.subData.reduce(
            (total, item) =>
              total +
              (item?.Product_GST || item?.Product_tax || 0) +
              item?.product_price,
            0
          ) +
          Math.min(
            ...orderData.subData.map(
              (item) => item.productdata[0]?.shipping_charge
            )
          );
      }

      const payload = {
        order_total: totalPayableAmt,
        currency: "INR",
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/User/paynow`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );

      const paymentData = response.data.data;
      const options = {
        // key: "rzp_test_cO8zLJTMAEjQgL",
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: paymentData.amount * 100,
        currency: paymentData.currency,
        name: "Your Company Name",
        description: "Test Transaction",
        handler: function (response) {
          const razorpay_payment_id = response.razorpay_payment_id;
          navigate("/orderSuccess", { state: { order_id: order_id } });
          updateOrder(razorpay_payment_id);
        },
        prefill: {
          name: selectedShippingAddress
            ? `${selectedShippingAddress.user_first_name} ${selectedShippingAddress.user_last_name}`
            : `${orderData?.userData?.user_first_name} ${orderData?.userData?.user_last_name}`,
          email: "test@example.com",
          contact: selectedShippingAddress
            ? selectedShippingAddress.user_mobile_no
            : orderData?.userData?.user_mobile_no,
        },
        notes: {
          address: selectedShippingAddress
            ? selectedShippingAddress.user_address
            : orderData?.userData?.user_address,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const updateOrder = async (razorpay_payment_id) => {
    try {
      let totalPayableAmt = 0;
      if (orderData?.subData?.length > 0) {
        totalPayableAmt =
          orderData.subData.reduce(
            (total, item) =>
              total +
              (item?.Product_GST || item?.Product_tax || 0) +
              item?.product_price,
            0
          ) +
          Math.min(
            ...orderData.subData.map(
              (item) => item.productdata[0]?.shipping_charge
            )
          );
      }
      const mobileNo = String(
        selectedShippingAddress?.user_mobile_no ||
          orderData?.userData?.user_mobile_no
      );
      const orderUpdatePayload = {
        order_total: totalPayableAmt,
        order_id: order_id,
        payment_id: razorpay_payment_id,
        user_first_name:
          selectedShippingAddress?.user_first_name ||
          orderData?.userData?.user_first_name,
        user_last_name:
          selectedShippingAddress?.user_last_name ||
          orderData?.userData?.user_last_name,
        user_mobile_no: mobileNo,
        user_pincode:
          selectedShippingAddress?.user_pincode ||
          orderData?.userData?.user_pincode,
        user_country:
          selectedShippingAddress?.user_country ||
          orderData?.userData?.user_country,
        user_state:
          selectedShippingAddress?.user_state ||
          orderData?.userData?.user_state,
        user_address:
          selectedShippingAddress?.user_address ||
          orderData?.userData?.user_address,
      };

      const orderUpdateResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/User/orderUpdate`,
        orderUpdatePayload,
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      fetchData();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <>
      <div className="checkout-container">
        <div className="checkout-part">
          <div className="detail-div">
            <div>
              <h2>Billing Details</h2>
            </div>
            <hr />
            <div>
              {selectedShippingAddress ? (
                <>
                  <p className="detail-p">
                    <span>First Name: </span>{" "}
                    {selectedShippingAddress.user_first_name}
                  </p>
                  <p className="detail-p">
                    <span>Last Name: </span>{" "}
                    {selectedShippingAddress.user_last_name}
                  </p>
                  <p className="detail-p">
                    <span>Mobile No: </span>{" "}
                    {selectedShippingAddress.user_mobile_no}
                  </p>
                </>
              ) : (
                <>
                  <p className="detail-p">
                    <span>First Name: </span>{" "}
                    {orderData?.userData?.user_first_name}
                  </p>
                  <p className="detail-p">
                    <span>Last Name: </span>{" "}
                    {orderData?.userData?.user_last_name}
                  </p>
                  <p className="detail-p">
                    <span>Mobile No: </span>{" "}
                    {orderData?.userData?.user_mobile_no}
                  </p>
                </>
              )}
            </div>
            <hr />
            <div className="adderess">
              <h2>Shipping Address</h2>
              <PiAddressBook
                className="address-icon"
                onClick={handleShippingAdd}
              />
            </div>
            <hr />
            <div>
              {selectedShippingAddress ? (
                <>
                  <p className="Add-p">
                    Address: {selectedShippingAddress.user_address}
                  </p>
                  <p className="Add-p">
                    State: {selectedShippingAddress.user_state}
                  </p>
                  <p className="Add-p">
                    Countery: {selectedShippingAddress.user_country}
                  </p>
                  <p className="Add-p">
                    Pincode: {selectedShippingAddress.user_pincode}
                  </p>
                </>
              ) : (
                <>
                  <p className="Add-p">
                    Address: {orderData?.userData?.user_address}
                  </p>
                  <p className="Add-p">
                    State: {orderData?.userData?.user_state}
                  </p>
                  <p className="Add-p">
                    Countery: {orderData?.userData?.user_country}
                  </p>
                  <p className="Add-p">
                    Pincode: {orderData?.userData?.user_pincode}
                  </p>
                </>
              )}
            </div>
            <hr />
          </div>
          <div className="order-summery-div">
            <h2>
              Order Summary <br />{" "}
              <span className="fs-16">
                {orderData?.subData?.length || 0} Item(s) in Cart
              </span>
            </h2>
            {orderData?.subData?.length > 0 ? (
              <>
                <div>
                  {orderData?.subData?.map((item, index) => (
                    <div key={index}>
                      <div className="order-summary">
                        <div>
                          <img
                            src={item.productdata[0]?.imagelink || ProductImage}
                            alt={
                              item.productdata[0]?.product_name ||
                              "Product Image"
                            }
                            className="product-img"
                          />
                        </div>
                        <h5 className="product-name">
                          {item.productdata[0]?.product_name}
                        </h5>
                        <div>
                          <p className="qty">Qty : {item?.product_quantity}</p>
                          <p className="amount">{item?.product_price} Rs.</p>
                        </div>
                      </div>
                      <div className="coupon-code-div">
                        <p className="coupon-code-p">
                          Do you have a coupon code?
                        </p>
                      </div>
                      <div className="coupon-code-input-btn">
                        <Input
                          name={`coupon_code_${index}`}
                          placeholder="Coupon Code"
                          value={couponCodes[index]}
                          onChange={(e) => handleCouponCodeChange(e, index)}
                          style={inputStyle}
                        />
                        <div>
                          <button
                            type="submit"
                            className="apply-now-btn"
                            onClick={() => handleApplyBtnClick(index)}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              "No order data found."
            )}
            {orderData?.subData?.length > 0 && (
              <>
                <div className="total-amt">
                  <h4>Coupon Card Discount Prise</h4>
                  <p className="amounts">{discountAmounts} Rs.</p>
                </div>
                <hr />
                <div className="total-amt">
                  <h4>Total Shipping Charge</h4>
                  <p className="amounts">
                    {orderData &&
                      Math.min(
                        ...orderData.subData.map(
                          (item) => item.productdata[0]?.shipping_charge
                        )
                      )}{" "}
                    Rs.
                  </p>
                </div>
                <hr />
                <div className="total-amt">
                  <h4>Total GST / Tax</h4>
                  <p className="amounts">
                    {orderData?.subData.reduce(
                      (total, item) =>
                        total + (item?.Product_GST || item?.Product_tax || 0),
                      0
                    )}{" "}
                    Rs.
                  </p>
                </div>
                <hr />
                <div className="total-amt">
                  <h4>Total Payable Amt</h4>
                  <p className="amounts">
                    {orderData?.subData.reduce(
                      (total, item) =>
                        total +
                        (item?.Product_GST || item?.Product_tax || 0) +
                        item?.product_price,
                      0
                    ) +
                      Math.min(
                        ...orderData.subData.map(
                          (item) => item.productdata[0]?.shipping_charge
                        )
                      )}{" "}
                    Rs.
                  </p>
                </div>
                <hr />
                <div>
                  <button
                    type="submit"
                    className="place-order-btn"
                    onClick={() => handlePayBtnClick()}
                  >
                    Pay Now
                  </button>
                </div>
                <hr />
              </>
            )}
          </div>
        </div>
      </div>
      <ShippingAdd
        open={open}
        setOpen={setOpen}
        setSelectedShippingAddress={setSelectedShippingAddress}
        handleAddressAdd={handleAddressAdd}
      />
    </>
  );
};

export default CheckoutOrders;
