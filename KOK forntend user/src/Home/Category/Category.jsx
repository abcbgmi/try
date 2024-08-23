import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UnderLine from "./images/UnderLine.png";
import Free_icon from "./images/Free Shipping.svg";
import Support from "./images/customer-service-svgrepo-com.svg";
import Money_return from "./images/Last 24.svg";
import Contact from "./images/contact-us-svgrepo-com.svg";
import viken from "./images/img 1.png";
import "./Category.css";

const Category = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const handleCategoryClick = (category_id) => {
    navigate(`/category/${category_id}`);
  };

  const fetchOrders = async () => {
    try {
      const fillResponse = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/User/categoryFill`,
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      setData(fillResponse.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <div className="Category_Title">
        <h1 className="Category_Text1">SHOP BY CATEGORY</h1>
        <img src={UnderLine} alt="UnderLine" className="UnderLine" />
      </div>
      <div className="Category_box">
        {data
          .filter((item) => item.is_active)
          .map((item) => (
            <div
              className="ShowCategory_box"
              key={item.category_id}
              onClick={() => handleCategoryClick(item.category_id)}
            >
              <div className="Category_boximages-main">
                <img
                  src={item.imagelink}
                  className="Category_boximages"
                  alt={item.category_name}
                />
              </div>
              <p className="Category_boximages-p">{item.category_name}</p>
            </div>
          ))}
      </div>
      <div className="Category_box">
        <div className="Shop_Box1">
          <img src={Free_icon} alt="Free_icon" className="Free_icon" />
          <p className="Shop_text1">FREE SHIPPING</p>
          <p className="Shop_text2">
            Free Shipping in India on orders above Rs.499{" "}
          </p>
        </div>
        <div className="Shop_Box1">
          <img src={Support} alt="Free_icon" className="Free_icon" />
          <p className="Shop_text1">CUSTOMER SERVICE</p>
          <p className="Shop_text2">
            At your service <br /> Mon- Sat, 10am to 6pm{" "}
          </p>
        </div>
        <div className="Shop_Box1">
          <img src={Money_return} alt="Free_icon" className="Free_icon" />
          <p className="Shop_text1">SECURE PAYMENT</p>
          <p className="Shop_text2">
            Your payment information is processed securely.{" "}
          </p>
        </div>
        <div className="Shop_Box1">
          <img src={Contact} alt="Free_icon" className="Free_icon" />
          <p className="Shop_text1">CONTACT US</p>
          <p className="Shop_text2">
            Need to contact us? Whatsapp <br /> us on +91-8879680635{" "}
          </p>
        </div>
      </div>
    </>
  );
};

export default Category;
