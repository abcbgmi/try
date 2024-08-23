import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StarRatingShow from "../StarRating/StarRatingShow";
import "./AllProducts.css";

function AllProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

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
      navigate("/bagAddToCart", { state: { productId: productId } });
    } catch (error) {
      console.error("Error sending product ID:", error);
      setError("Failed to send product ID");
    }
  };

  useEffect(() => {
    const userNavBar = async () => {
      const product_id = { product_id: 0 };
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/User/productGet`,
          product_id,
          {
            headers: {
              "Content-Type": "application/json",
              "Auth-Token": localStorage.getItem("auth_token"),
            },
          }
        );
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userNavBar();
  }, []);
  return (
    <>
      <div className="User_TopPicks_product2">
        <h1 className="text-center">All Product</h1>
        <div className="seller-bag2">
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
                    <b>{product.product_name}</b>
                  </p>
                  <p className="product-dec">{product.product_description}</p>

                  <div className="product_price">
                    <>
                      <strike className="product-price">
                        Rs.{product.product_price}
                      </strike>
                      <p style={{ color: "#cc8f7a" }} className="product-price">
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
    </>
  );
}

export default AllProducts;
