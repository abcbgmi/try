import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Product3 from "./images/Product3.png";
import instagram from "./images/instagram.png";
import twitter from "./images/twitter.png";
import FaceBook from "./images/Face book.png";
import videoTha from "./images/video-play-512.png";

function AddCouponCode() {
  const location = useLocation();

  const { order_id } = location.state || {};
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [subdata, setSubdata] = useState({});
  const [mainImage, setMainImage] = useState(Product3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charms, setCharms] = useState([]);
  const [orderCouponCode, setOrderCouponCode] = useState("");
  const [formData, setFormData] = useState({
    orderTrn_id: order_id,
    product_one_name: "",
    product_two_name: "",
    product_one_charm: "",
    product_two_charm: "",
    product_one_color: "",
    product_two_color: "",
  });
  const [currentMedia, setCurrentMedia] = useState({
    type: product?.videolink ? "video" : "image",
    src:
      product?.videolink ||
      (product?.OtherImages && product.OtherImages[0]?.imagelink),
  });

  const handleMediaClick = (type, src) => {
    setCurrentMedia({ type, src });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageClick = (imageSrc) => {
    setMainImage(imageSrc);
  };

  const fetchProducts = async () => {
    if (!order_id) {
      setError("Order ID not provided");
      return;
    }

    try {
      // const response = await fetch("http://localhost:4000/User/CartGet", {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/User/CartGet`,
        {
          method: "POST",
          headers: {
            "Auth-Token": localStorage.getItem("auth_token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order_id }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      const { productData, subData } = result.data;
      if (productData.OtherImages && Array.isArray(productData.OtherImages)) {
        setProductImages(productData.OtherImages);
        setProduct(productData);
        setSubdata(subData);
        if (productData.OtherImages.length > 0) {
          setMainImage(productData.OtherImages[0].imagelink);
        }
        setFormData({
          orderTrn_id: order_id,
          product_one_name: subData.product_one_name || "",
          product_two_name: subData.product_two_name || "",
          product_one_charm: subData.product_one_charm || "",
          product_two_charm: subData.product_two_charm || "",
          product_one_color: subData.product_one_color || "",
          product_two_color: subData.product_two_color || "",
        });
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch products");
    }
  };

  const fetchCharms = async () => {
    try {
      // const response = await fetch("http://localhost:4000/User/charmGet", {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/User/charmGet`,
        {
          method: "POST",
          headers: {
            "Auth-Token": localStorage.getItem("auth_token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ charm_id: 0 }),
        }
      );

      const data = await response.json();
      if (Array.isArray(data.data)) {
        setCharms(data.data);
      } else {
        console.error("Unexpected response format:", data);
        setCharms([]);
      }
    } catch (error) {
      console.error("Error fetching charms:", error);
      setCharms([]);
    }
  };

  const handleCouponCodeChange = (event) => {
    setOrderCouponCode(event.target.value);
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const user_id = parseInt(localStorage.getItem("user_id"));
    // const mycart_id = { mycart_id: 0 };
    const product_id = product?.product_id;
    const parsedData = {
      mycart_id: 0,
      order_id,
      user_id,
      product_id,
      SubData: formData,
    };
    try {
      // const response = await fetch("http://localhost:4000/User/addToCart", {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/User/addToCart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
          body: JSON.stringify({ JsonData: JSON.stringify(parsedData) }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === 1) {
        localStorage.setItem("order_id", order_id);
        toast.success("Update success");
      } else {
        toast.error("Failed success");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed success");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCouponApply = () => {
    // fetch("http://localhost:4000/User/applyCodeOnOrder", {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/User/applyCodeOnOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Auth-Token": localStorage.getItem("auth_token"),
      },
      body: JSON.stringify({ order_coupon_code: orderCouponCode, order_id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {})
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const callFuncation = () => {
    handleSubmit();
    handleCouponApply();
  };

  useEffect(() => {
    fetchProducts();
    fetchCharms();
  }, [order_id]);

  return (
    <div className="AddToCard">
      <div className="images_seacation">
        <div className="Images_div">
          {currentMedia.type === "video" ? (
            <video autoPlay width="80%" height="215px" className="Video_show">
              <source src={currentMedia.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={currentMedia.src}
              alt="Main Product"
              id="Images"
              className="Product3"
              type
            />
          )}
        </div>
        <div className="Footer_img" style={{ overflow: "scroll" }}>
          {product?.OtherImages?.map((imageObj, index) => (
            <img
              key={index}
              src={imageObj.imagelink}
              alt={`cart_product${index + 1}`}
              className="cart_product"
              onClick={() => handleMediaClick("image", imageObj.imagelink)}
              style={{ cursor: "pointer" }}
            />
          ))}
          {product?.videolink && (
            <img
              src={videoTha}
              alt="Product Video"
              className="cart_product"
              onClick={() => handleMediaClick("video", product.videolink)}
              style={{ cursor: "pointer", height: "50px", width: "50px" }}
            />
          )}
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="All_text">
        <h1>{product ? product.product_name : "PERSONALIZE PASSPORT COVER"}</h1>
        <p className="Description">
          {product ? product.product_description : ""}
        </p>
        <div className="personalize_Text">
          <h3>{product ? `Rs. ${product.product_discount_price}` : "-"}</h3>
          {product && product.product_discount_price ? (
            <>
              <h3>
                <strike>Rs. {product.product_price}</strike>
              </h3>
              <h3 className="personalize_SubText">
                SAVE RS. {product.product_discount}
              </h3>
            </>
          ) : (
            <>
              <h3>
                <strike>Rs.0</strike>
              </h3>
              <h3 className="personalize_SubText">SAVE RS. 0</h3>
            </>
          )}
        </div>
        <div className="personalize_Cover">
          <p className="personalize_Cover_Box">Cover - 1</p>
          <p className="personalize_Cover_Box">Cover - 2</p>
        </div>
        <div className="personalize_Cover_Row">
          <p>Passport Cover : Name</p>
          <input
            type="text"
            name="product_one_name"
            className="personalize_Cover_Row1_name"
            placeholder="Enter Name"
            value={formData.product_one_name}
            onChange={handleInputChange}
            readOnly
          />
          <input
            type="text"
            name="product_two_name"
            className="personalize_Cover_Row1_name"
            placeholder="Enter Name"
            value={formData.product_two_name}
            onChange={handleInputChange}
            readOnly
          />
        </div>
        <div className="personalize_Cover_Row">
          <p>Passport Cover : Color</p>
          <input
            type="text"
            name="product_one_color"
            className="personalize_Cover_Row1_Color"
            value={formData.product_one_color}
            onChange={handleInputChange}
            readOnly
          />
          <input
            type="text"
            name="product_two_color"
            className="personalize_Cover_Row1_Color"
            value={formData.product_two_color}
            onChange={handleInputChange}
            readOnly
          />
        </div>
        <div className="personalize_Cover_Row">
          <p>Passport Cover : Charm</p>
          <input
            type="text"
            name="product_one_charm"
            className="personalize_Cover_Row1_Color"
            value={formData.product_one_charm}
            onChange={handleInputChange}
            readOnly
          />
          <input
            type="text"
            name="product_two_charm"
            className="personalize_Cover_Row1_Color"
            value={formData.product_two_charm}
            onChange={handleInputChange}
            readOnly
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "30px",
            marginBottom: "20px",
            marginTop: "30px",
          }}
        >
          <div className="personalize_Cover_Row">
            <b>Applay Coupon Code</b>
            <input
              type="tel"
              maxLength={6}
              value={orderCouponCode}
              onChange={handleCouponCodeChange}
              className="personalize_Cover_Row1_Color"
            />
          </div>
        </div>
        <button
          className="personalize_Cover_Button"
          onClick={callFuncation}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Add to cart"}
        </button>
        <div className="Share">
          Share
          <img src={twitter} alt="twitter" className="twitter" />
          <img src={FaceBook} alt="facebook" className="facebook" />
          <img src={instagram} alt="instagram" className="instagram" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddCouponCode;
