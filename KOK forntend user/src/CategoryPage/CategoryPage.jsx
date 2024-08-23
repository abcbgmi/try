
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import StarRatingShow from "../StarRating/StarRatingShow";
import "./Categorypage.css";

const CategoryPage = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);
  const [categoryimage, setCategoryImage] = useState("")

  console.log("products>>", products);

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
    const fetchCategoryData = async () => {
      const getData = { product_id: 0, category: categoryId };
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/User/productFillByCategory`,
          getData,
          {
            headers: {
              "Content-Type": "application/json",
              "Auth-Token": localStorage.getItem("auth_token"),
            },
          }
        );
        setProducts(response.data.data);
        setCategory(response.data.categoryname.category_name);
        setCategoryImage(response.data.categoryBanner.imagelink)
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch category data");
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  return (
    <div className="category-part">
      <div className="category-image-part">
        <img src={categoryimage} className="category-image" />
      </div>
      <h1 className="category-text">{category}</h1>
      <div className="display-flex-1">
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
                  <b>{product.product_name.substring(0, 23)}...</b>
                </p>
                <p className="product-dec">{product.product_description.substring(0, 60)}...</p>

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

export default CategoryPage;
