import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StarRatingShow from "../../StarRating/StarRatingShow";
import "./AllBag.css";

const Product = () => {
  
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleProductClick = async (productId) => {
    setSelectedProductId(productId);
    try {
      // const response = await fetch("http://localhost:4000/User/productGet", {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/User/productGet`, {
        method: "POST",
        headers: {
          "Auth-Token": localStorage.getItem("auth_token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: productId }),
      });
      if (!response.ok) {
        throw new Error("Failed to send product ID");
      }
      const data = await response.json();
      navigate("/bagAddToCart", { state: { productId: productId } });
    } catch (error) {
      console.error("Error sending product ID:", error);
      setError("Failed to send product ID");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          // "http://localhost:4000/User/productFillByCategory",
          `${process.env.REACT_APP_API_BASE_URL}/User/productFillByCategory`,
          {
            method: "POST",
            headers: {
              "Auth-Token": localStorage.getItem("auth_token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ product_id: 0, category: 2 }),
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
    <div className="all-bag">
      <div className="seller-bag">
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
                <StarRatingShow rating={product ? product.average_rating : 0} />
              </div>
            </div>
          ))
        ) : (
          <h1 className="productNull">No products available</h1>
        )}
      </div>
    </div>
  );
};

export default Product;
