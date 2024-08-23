import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Order from "./order";
import "./MyOrderes.css";
import img1 from "../userimage/dumyimg.jpg"
const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderIdGet, setOrderIdGet] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/User/myOrderGet`,
        { order_id: 0 },
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      setOrders(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOrderClick = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/User/myOrderGet`,
        { order_id: orderId },
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      setOrderIdGet(response.data.data);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="orders-container">
        <div className="all-bag">
          <div className="Cart_name">
            <h1>My Orders</h1>
          </div>
          <div className="seller-bag">
            {orders.length > 0 ? (
              <>
                <table className="order-table">
                  <thead>
                    <tr style={{ color: "#867e7a", fontWeight: 300 }}>
                      <th>Order ID</th>
                      <th>Order Total</th>
                      <th>Payment Type</th>
                      <th>User Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.order_id}>
                        <td
                          onClick={() => handleOrderClick(order.order_id)}
                          className="order-id"
                          style={{ cursor: "pointer" }}
                        >
                          {order.order_id}
                        </td>
                        <td>{order.order_total}</td>
                        <td>{order.payment_type || "N/A"}</td>
                        <td>
                          <p>
                            {order.user_first_name} {order.user_last_name}
                          </p>
                          <p>{order.user_address}</p>
                          <p>{order.user_country}</p>
                          <p>
                            {order.user_state} {order.user_pincode}
                          </p>
                          <p>Mobile: {order.user_mobile_no}</p>
                          <p>Mobile: {order?.orderstatus}</p>
                          
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <>
              <img src="dummy-img"/>
              </>
            )}
          </div>
        </div>
      </div>
      <Order
        open={open}
        setOpen={setOpen}
        loading={loading}
        setLoading={setLoading}
        orderIdGet={orderIdGet}
      />
    </>
  );
};

export default MyOrders;
