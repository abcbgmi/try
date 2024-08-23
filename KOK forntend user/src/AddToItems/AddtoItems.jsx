import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosBriefcase } from "react-icons/io";
import { IoTrashBinSharp } from "react-icons/io5";
import iconimg from "./images/go_to_checkout.jpg";
import axios from "axios";
import "./AddtoItems.css";
import img1 from "../userimage/dumyimg2.png"
const AddtoItems = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState([]);
  const [amt, setAmt] = useState(null);
  const [cartData, setCartData] = useState([]);
  const [count, setCount] = useState({});
  const [orderGet, setOrderGet] = useState({});
  const [orderId, setOrderId] = useState(null);
  const handleUpdate = (productId, mycartId) => {
    const product = cartData.find((item) => item.product_id === productId);
    const productModifyObject = product ? product.product_modify_object : null;
    navigate("/bagAddToCart", {
      state: { productId, productModifyObject, mycartId },
    });
  };
  const handleIncrementCount = (productId) => {
    const product = cartData.find((item) => item.product_id === productId);
    const maxQuantity = product?.ProductData?.product_quantity || 1;
    setCount((prevCounts) => ({
      ...prevCounts,
      [productId]:
        (prevCounts[productId] || 1) + 1 <= maxQuantity
          ? (prevCounts[productId] || 1) + 1
          : maxQuantity,
    }));
  };
  const handleDecrementCount = (productId) => {
    setCount((prevCounts) => ({
      ...prevCounts,
      [productId]:
        (prevCounts[productId] || 1) > 1 ? prevCounts[productId] - 1 : 1,
    }));
  };
  const fetchOrders = async () => {
    try {
      const orderTotal = cartData.reduce((total, item) => {
        const productPrice = item.ProductData.product_discount_price;
        const quantity = count[item.product_id] || 1;
        return total + productPrice * quantity;
      }, 0);
      const payload = {
        order_id: 0,
        user_id: localStorage.getItem("user_id"),
        // order_total: cartData.reduce((total, item) => total + (item.ProductData.product_discount_price * (count[item.product_id] || 1)), 0),
        order_total: orderTotal,
        user_first_name: "",
        user_last_name: "",
        user_mobile_no: "",
        user_address: "",
        user_pincode: "",
        user_country: "",
        user_state: "",
        payment_type: "",
        SubData: cartData.map((item) => ({
          orderTrn_id: 0,
          mycart_id: item.mycart_id,
          product_id: item.product_id,
          product_modify_object: item.product_modify_object,
          product_quantity: count[item.product_id] || 1,
          // product_price: item.ProductData.product_discount_price,
          product_price:
            (count[item.product_id] || 1) *
            item.ProductData.product_discount_price,
          Product_GST: 0,
          Product_tax: 100,
          order_coupon_code: 0,
        })),
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/User/addToOrder`,
        JSON.stringify(payload),
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      setOrderGet(response.data.data);
      setOrderId(response?.data?.order_id);
      return response?.data?.order_id;
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };
  const handleGoToCheckout = async () => {
    try {
      const orderId = await fetchOrders();
      navigate("/checkoutOrders", { state: { order_id: orderId } });
    } catch (error) {
      console.error("Error navigating to checkout:", error);
    }
  };
  const handleCheckout = () => {
    const user_id = localStorage.getItem("user_id");
    const orderIds = order.map((item) => item.order_id);
    const order_sub_total = amt.SubTotalAmt;
    const order_total_gst = amt.TotalGst;
    const order_total_tax = amt.TotalTax;
    const order_shipping = amt.Shipping;
    const order_discount = amt.Discount;
    const order_total_Amt = amt.TotalAmt;
    fetch(`${process.env.REACT_APP_API_BASE_URL}/User/goToCheckOut`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Auth-Token": localStorage.getItem("auth_token"),
      },
      body: JSON.stringify({
        user_id,
        order_sub_total,
        order_total_gst,
        order_total_tax,
        order_shipping,
        order_discount,
        order_total_Amt,
        order_ids: JSON.stringify(orderIds),
      }),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));
  };
  const handleDelete = async (mycartId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/User/CartProductDelete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
          body: JSON.stringify({ mycart_id: mycartId }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrder((prevOrder) =>
        prevOrder.filter((order) => order.mycart_id !== mycartId)
      );
      fetchData();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };
  const fetchData = async () => {
    const myCartId = { mycart_id: 0 };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/User/CartGet`,
        myCartId,
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      setCartData(response.data.data);
      const initialCounts = {};
      response.data.data.forEach((product) => {
        initialCounts[product.product_id] = 1;
      });
      setCount(initialCounts);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log("length",cartData.length)
  return (
    <>
      <div className="cart-container">
        <div className="all-bag">
          <div className="Cart_name">
            <h1>CART</h1>
          </div>
          <button
            type="submit"
            className="check-btn"
            onClick={handleGoToCheckout}
          >
            Go To Checkout
          </button>
          <button
            type="submit"
            className="check-icon"
            onClick={handleGoToCheckout}
          >
            <img src={iconimg} alt="" />{" "}
          </button>
          <div className="seller-bag">
            {cartData.length > 0 ? (
              <>
                <table className="product-table">
                  <thead>
                    <tr style={{ color: "#867e7a", fontWeight: 300 }}>
                      <th>Product Image</th>

                      <th>Quantity</th>
                      <th>Sub Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(cartData) &&
                      cartData.map((product) => (
                        <tr key={product.product_id}>
                          <td className="prouct_images">
                            <div className="product-img-name">
                              <img
                                src={product?.ProductData?.imagelink}
                                alt={`Product ${product?.ProductData?.imagelink}`}
                                className="product-image"
                                style={{ cursor: "pointer" }}
                              />
                      
                            <p>{product?.ProductData?.product_name}</p>
                            </div>
                          </td>
                          <td>
                            <div className="quantityBtn">
                              <button className="minus-btn"
                                onClick={() =>
                                  handleDecrementCount(product.product_id)
                                }
                              >
                                -
                              </button>
                              <div className="item-number">{count[product.product_id] || 1}</div>
                              <button className="pluse-btn"
                                onClick={() =>
                                  handleIncrementCount(product.product_id)
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>
                            <p style={{textAlign:"center"}}>
                              {(count[product.product_id] || 1) *
                                product?.ProductData?.product_discount_price}
                            </p>
                          </td>
                          <td className="Product_description">
                            <div className="Product_Button">
                              <div
                                style={{
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                  color: "#867e7a",
                                }}
                                onClick={() =>
                                  handleUpdate(
                                    product.product_id,
                                    product.mycart_id
                                  )
                                }
                              >
                             <button className="edit-btn">Edit</button>
                              </div>
                              <div
                                style={{
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                  color: "#867e7a",
                                }}
                                onClick={() => handleDelete(product.mycart_id)}
                              >
                               <button className="delete-btn">Delete</button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            ) : (
              <>
              
              <img src={img1} className="dumy-img"/>
            
              </>
            )}
          </div>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};
export default AddtoItems;
