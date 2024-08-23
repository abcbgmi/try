import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Product1 from "./images/Product1.png";
import UnderLine from "./images/UnderLine.png";
import StarRatingShow from "../../StarRating/StarRatingShow";
import "./TopPicks.css";

const TopPicks = () => {

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  // Handle product click

  const handleProductClick = async (productId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/User/productGet`,
        {
          method: "POST",
          headers: {
            "Auth-Token": localStorage.getItem("auth_token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product_id: productId }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send product ID");
      }
      const data = await response.json();
      // Navigate based on product_category
      if (data.data.product_category === 1) {
        navigate("/bagAddToCart", { state: { productId: productId } });
      } else {
        navigate("/bagAddToCart", { state: { productId: productId } });
      }
    } catch (error) {
      console.error("Error sending product ID:", error);
      setError("Failed to send product ID");
    }
  };

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // const response = await fetch("http://localhost:4000/User/getTopView", {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/User/getTopView`,
          {
            method: "POST",
            headers: {
              "Auth-Token": localStorage.getItem("auth_token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ product_id: 0 }),
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (Array.isArray(result.data)) {
          setProducts(result.data);
        } else {
          console.error("Expected an array but received:", result.data);
          setError("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch products");
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      {/* <div className="form1">
        <div>
          <img
            src={Product1}
            alt="Product1"
            className="bag_Product1"
            style={{ width: "250px", height: "250px" }}
          />
        </div>
        <div className="form1_part2">
          <p className="part2_text1">End of Summer!</p>
          <p className="part2_text2">Up to 40% off on all items.</p>
          <div className="email_id">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              id="email"
              className="email"
            />
            <button className="SUBSCRIBE_TopPicks">SUBSCRIBE</button>
          </div>
          <p className="part2_text3">
            Sign up to our Newsletter and get the discount code!
          </p>
        </div>
      </div> */}

      <div>
        <div className="TopPicks_Title">
          <h1 className="TopPicks_Text">TOP PICKS</h1>
          <img src={UnderLine} alt="UnderLine" className="UnderLine" />
        </div>
        <div className="User_TopPicks_product">
          <div className="Best_seller-bag">
            {error ? (
              <p className="error">{error}</p>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.product_id}
                  className="product"
                  onClick={() => handleProductClick(product.product_id)}
                >
                  <div className="product-header">
                    <img
                      src={product.imagelink}
                      alt={`Product ${product.product_name}`}
                      className="product-image"
                    />
                  </div>
                  <div className="product-footer">
                    <p className="product-name">
                      <b>{product.product_name.substring(0, 17)}...</b>
                    </p>
                    <p className="product-dec">{product.product_description.substring(0, 60)}...</p>
                    <div className="product_price">
                      <>
                        <strike className="product-price">
                          Rs.{product.product_price}
                        </strike>
                        <p
                          style={{ color: "#CC8F7A" , fontWeight:"bolder", fontSize:"20px"}}
                          className="product-price"
                        >
                          Rs.{product.product_discount_price}
                        </p>
                      </>
                    </div>
                    <StarRatingShow
                      rating={product ? product.average_rating : 0}
                    />
                  </div>
                </div>
              ))
            ) : (
              <h1 className="productNull">No products available</h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopPicks;
