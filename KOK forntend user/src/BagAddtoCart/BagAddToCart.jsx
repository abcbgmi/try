// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import StarRating from "../StarRating/StarRating";
// import StarRatingShow from "../StarRating/StarRatingShow";
// import Product3 from "./imgas/Product3.png";
// import videoTha from "./imgas/video-play-512.png";
// import "./BagAddToCart.css";

// const BagAddToCart = () => {
//   const location = useLocation();
//   const { productId } = location.state || {};
//   const [error, setError] = useState(null);
//   const [getProduct, setGetProduct] = useState(null);
//   const [isCouple, setIsCouple] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [newPrice, setNewPrice] = useState(null);
//   const [formData, setFormData] = useState({});

//   const [currentMedia, setCurrentMedia] = useState({
//     type: "image",
//     src: Product3,
//   });

//   const handleMediaClick = (type, src) => {
//     setCurrentMedia({ type, src });
//   };

//   const handleCoupleClick = () => {
//     setIsCouple(true);
//   };

//   const callAllFunctions = () => {
//     handleCoupleClick();
//   };

//   useEffect(() => {
//     const fetchProducts = async () => {
//       if (!productId) {
//         setError("Product ID not provided");
//         return;
//       }
//       try {
//         const response = await fetch(
//           `${process.env.REACT_APP_API_BASE_URL}/User/productGet`,
//           {
//             method: "POST",
//             headers: {
//               "Auth-Token": localStorage.getItem("auth_token"),
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ product_id: productId }),
//           }
//         );
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const result = await response.json();
//         if (result.data && typeof result.data === "object") {
//           setGetProduct(result.data);
//           if (result.data.OtherImages && result.data.OtherImages.length > 0) {
//             setCurrentMedia({
//               type: "image",
//               src: result.data.OtherImages[0].imagelink,
//             });
//           } else if (result.data.videolink) {
//             setCurrentMedia({
//               type: "video",
//               src: result.data.videolink,
//             });
//           }
//         } else {
//           setError("Unexpected response format");
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Failed to fetch products");
//       }
//     };
//     fetchProducts();
//   }, [productId]);

//   let productObj = {};

//   if (getProduct && getProduct.product_modify_object) {
//     try {
//       productObj = JSON.parse(JSON.parse(getProduct.product_modify_object));
//     } catch (error) {
//       console.error('Error parsing JSON:', error);
//     }
//   } else {
//     console.warn('getProduct or getProduct.product_modify_object is undefined or null.');
//   }

//   const handleInputChange = (key, newValue) => {
//     setFormData((prevProductObj) => ({
//       ...prevProductObj,
//       [key]: newValue,
//     }));
//   };

//   const handleDropdownChange = (key, selectedValue) => {
//     const parsedValue = JSON.parse(selectedValue);
//     setFormData((prevProductObj) => ({
//       ...prevProductObj,
//       [key]: parsedValue,
//     }));
//   };

//   const renderInput = (key, value) => {
//     if (value === "Text") {
//       return (
//         <input
//         className="input-style"
//           type="text"
//           placeholder={`Enter ${key}`}
//           value={formData[key] || ''}
//           onChange={(e) => handleInputChange(key, e.target.value)}
//         />
//       );
//     } else if (typeof value === 'string' || typeof value === 'number') {
//       return (
//         <input
//                 className="input-style"
//           type="text"
//           value={value}
//           readOnly
//         />
//       );
//     } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
//       return (
//         <select         className="input-style" onChange={(e) => handleDropdownChange(key, e.target.value)}>
//           {value.map((item, index) => (
//             <option key={index} value={JSON.stringify(item)}>
//               {Object.keys(item)
//                 .filter((subKey) => subKey !== 'id')
//                 .map((subKey) => item[subKey])
//                 .join(', ')}
//             </option>
//           ))}
//         </select>
//       );
//     } else {
//       return <span>{JSON.stringify(value)}</span>;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return;
//     setIsSubmitting(true);
//     const user_id = parseInt(localStorage.getItem("user_id"));
//     const product_id = productId;
//     const SubData = { ...formData };
//     const order_id = 0;
//     const mycart_id = 0;
//     const order_total = isCouple
//       ? newPrice?.total_Price || 0
//       : getProduct?.product_discount_price || 0;
//     const parsedData = {
//       mycart_id,
//       product_id,
//       user_id,
//       product_modify_object: SubData,
//     };
//     const requestBody = JSON.stringify(parsedData);
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_BASE_URL}/User/addToCart`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Auth-Token": localStorage.getItem("auth_token"),
//           },
//           body: requestBody,
//         }
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const result = await response.json();
//       if (result.status === 1) {
//         toast.success("Added to cart");
//         callAllFunctions(order_id);
//       } else {
//         toast.error("Failed to add to cart");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Error adding to cart");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <div className="AddToCard">
//         <div className="images_seacation">
//           <div className="Images_div">
//             {currentMedia.type === "video" ? (
//               <video autoPlay width="80%" height="215px" className="Video_show">
//                 <source src={currentMedia.src} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             ) : (
//               <img
//                 src={currentMedia.src}
//                 alt="Main Product"
//                 id="Images"
//                 className="Product3"
//               />
//             )}
//           </div>
//           <div className="Footer_img" style={{ overflowX: "scroll", display: "flex", whiteSpace: "nowrap" }}>
//   {getProduct?.OtherImages?.map((imageObj, index) => (
//     <img
//       key={index}
//       src={imageObj.imagelink}
//       alt={`cart_product${index + 1}`}
//       className="cart_product"
//       onClick={() => handleMediaClick("image", imageObj.imagelink)}
//       style={{ cursor: "pointer", margin: "0 5px" }}
//     />
//   ))}
//   {getProduct?.videolink && (
//     <img
//       src={videoTha}
//       alt="Product Video"
//       className="cart_product"
//       onClick={() => handleMediaClick("video", getProduct.videolink)}
//       style={{ cursor: "pointer", height: "50px", width: "50px", margin: "0 5px" }}
//     />
//   )}
// </div>
//         </div>
//         {error && <p className="error">{error}</p>}
//         <div className="All_text">
//           <h1>
//             {getProduct ? getProduct.product_name : "PERSONALIZE PASSPORT COVER"}
//           </h1>
//           <p className="Description">{getProduct?.product_description || ""}</p>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "start",
//               alignItems: "center",
//               gap: "13px",
//             }}
//           >
//             <b>Public review</b>
//             <StarRatingShow rating={getProduct ? getProduct.average_rating : 0} />
//           </div>
//           <div className="personalize_Text">
//             <h2>
//               {isCouple
//                 ? `RS. ${newPrice?.total_Price || 0}`
//                 : `RS. ${getProduct?.product_discount_price || 0}`}
//             </h2>
//             <div className="Personalize_Text">
//               <h4>
//                 <strike>
//                   {isCouple
//                     ? `RS. ${newPrice?.New_Price || 0}`
//                     : `RS. ${getProduct?.product_price || 0}`}
//                 </strike>
//               </h4>
//               <h4 className="personalize_SubText">
//                 SAVE
//                 {isCouple
//                   ? ` RS. ${newPrice?.save_Price || 0}`
//                   : ` RS. ${getProduct?.product_discount || 0}`}
//               </h4>
//             </div>
//           </div>
//           <div>
//             {Object.keys(productObj).map((key) => (
//               <div style={{margin:"20px 0px"}} key={key}>
//                 <strong >{key}: </strong>
//                 {renderInput(key, productObj[key])}
//               </div>
//             ))}
//           </div>
//           <button
//             className="personalize_Cover_Button"
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Submitting..." : "ADD TO CART"}
//           </button>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "start",
//               alignItems: "center",

//             }}
//           >
//             <b>Your rating</b>
//             <StarRating productId={productId} />
//           </div>
//         </div>
//         <ToastContainer />
//       </div>

//       <h3 className="review-text">Reviews</h3>
//       <div className="review-box2">
//         {getProduct?.taxt_comment.map((comment, index) => (
//           <Review key={index} comment={comment} />
//         ))}
//       </div>
//     </>
//   );
// };

// const Review = ({ comment }) => {
//   const [isTruncated, setIsTruncated] = useState(true);
//   const toggleTruncate = () => setIsTruncated(!isTruncated);

//   const { user_data, review_text } = comment;
//   const { user_first_name, user_last_name, imagelink } = user_data;

//   const words = review_text.split(' ');
//   const displayText = isTruncated ? words.slice(0, 20).join(' ') + (words.length > 20 ? '...' : '') : review_text;

//   return (
//     <div className="img-box">
//       <div>
//         <img src={imagelink} alt="User Profile" className="profile-img" />
//       </div>
//       <div>
//         <h4>{user_first_name} {user_last_name}</h4>
//         <p>{displayText}</p>
//         {words.length > 20 && (

//           <span onClick={toggleTruncate} className="read-more-text"> {isTruncated ? 'Read more' : 'Show less'}</span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BagAddToCart;

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import StarRating from "../StarRating/StarRating";
// import StarRatingShow from "../StarRating/StarRatingShow";
// import Product3 from "./imgas/Product3.png";
// import videoTha from "./imgas/video-play-512.png";
// import "./BagAddToCart.css";
// import axios from "axios";

// const BagAddToCart = () => {

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { productId, mycartId, productModifyObject } = location.state || {};

//   const [error, setError] = useState(null);
//   const [getProduct, setGetProduct] = useState(null);
//   const [isCouple, setIsCouple] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [newPrice, setNewPrice] = useState(null);
//   const [formData, setFormData] = useState({});

//   const [currentMedia, setCurrentMedia] = useState({
//     type: "image",
//     src: Product3,
//   });

//   const handleMediaClick = (type, src) => {
//     setCurrentMedia({ type, src });
//   };

//   const handleCoupleClick = () => {
//     setIsCouple(true);
//   };

//   const callAllFunctions = () => {
//     handleCoupleClick();
//   };

//   useEffect(() => {
//     const fetchProducts = async () => {
//       if (!productId) {
//         setError("Product ID not provided");
//         return;
//       }
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_BASE_URL}/User/productGet`,
//           { product_id: productId },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               "Auth-Token": localStorage.getItem("auth_token"),
//             },
//           }
//         );
//         const result = response?.data;
//         if (productModifyObject) {
//           setFormData(JSON.parse(productModifyObject));
//         } else {
//           setGetProduct(response?.data);
//         }
//         if (result.data && typeof result.data === "object") {
//           setGetProduct(result.data);
//           if (result.data.OtherImages && result.data.OtherImages.length > 0) {
//             setCurrentMedia({
//               type: "image",
//               src: result.data.OtherImages[0].imagelink,
//             });
//           } else if (result.data.videolink) {
//             setCurrentMedia({
//               type: "video",
//               src: result.data.videolink,
//             });
//           }
//         } else {
//           setError("Unexpected response format");
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Failed to fetch products");
//       }
//     };
//     fetchProducts();
//   }, [productId, productModifyObject]);

//   let productObj = {};
//   if (getProduct && getProduct.product_modify_object) {
//     try {
//       productObj = JSON.parse(JSON.parse(getProduct.product_modify_object));
//     } catch (error) {
//       console.error("Error parsing JSON:", error);
//     }
//   } else {
//     console.warn(
//       "getProduct or getProduct.product_modify_object is undefined or null."
//     );
//   }

//   // Handle manual text input change
//   const handleInputChange = (key, newValue) => {
//     setFormData((prevProductObj) => ({
//       ...prevProductObj,
//       [key]: newValue,
//     }));
//   };

//   // Handle dropdown selection change
//   const handleDropdownChange = (key, selectedValue) => {
//     const parsedValue = JSON.parse(selectedValue);
//     setFormData((prevProductObj) => ({
//       ...prevProductObj,
//       [key]: parsedValue,
//     }));
//   };

//   const renderInput = (key, value) => {
//     if (value === "Text") {
//       return (
//         <input
//           type="text"
//           className="input-style"
//           placeholder={`Enter ${key}`}
//           value={formData[key] || ""}
//           onChange={(e) => handleInputChange(key, e.target.value)}
//         />
//       );
//     } else if (typeof value === "string" || typeof value === "number") {
//       return (
//         <input type="text" className="input-style" value={value} readOnly />
//       );
//     } else if (
//       Array.isArray(value) &&
//       value.length > 0 &&
//       typeof value[0] === "object"
//     ) {
//       const selectedOption = formData[key]
//         ? JSON.stringify(formData[key])
//         : JSON.stringify(value[0]);
//       return (
//         <select
//           value={selectedOption}
//           className="input-style"
//           onChange={(e) => handleDropdownChange(key, e.target.value)}
//         >
//           {value.map((item, index) => (
//             <option key={index} value={JSON.stringify(item)}>
//               {Object.keys(item)
//                 .filter((subKey) => subKey !== "id")
//                 .map((subKey) => item[subKey])
//                 .join(", ")}
//             </option>
//           ))}
//         </select>
//       );
//     } else {
//       return <span>{JSON.stringify(value)}</span>;
//     }
//   };

//   const handleSubmit = async (e) => {
//     navigate("/addtocart");
//     e.preventDefault();
//     if (isSubmitting) return;
//     setIsSubmitting(true);

//     const user_id = parseInt(localStorage.getItem("user_id"));
//     const product_id = productId;

//     const SubData = { ...formData };
//     const order_id = 0;
//     const mycart_id = mycartId ? mycartId : 0;

//     const order_total = isCouple
//       ? newPrice?.total_Price || 0
//       : getProduct?.product_discount_price || 0;

//     const parsedData = {
//       mycart_id,
//       product_id,
//       user_id,
//       product_modify_object: SubData,
//     };

//     const requestBody = JSON.stringify(parsedData);

//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_BASE_URL}/User/addToCart`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Auth-Token": localStorage.getItem("auth_token"),
//           },
//           body: requestBody,
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       if (result.status === 1) {
//         // toast.success("Added to cart");
//         callAllFunctions(order_id);
//       } else {
//         // toast.error("Failed to add to cart");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       // toast.error("Error adding to cart");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <div className="AddToCard">
//         <div className="images_seacation">
//           <div className="Images_div">
//             {currentMedia.type === "video" ? (
//               <video autoPlay width="80%" height="215px" className="Video_show">
//                 <source src={currentMedia.src} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             ) : (
//               <img
//                 src={currentMedia.src}
//                 alt="Main Product"
//                 id="Images"
//                 className="Product3"
//               />
//             )}
//           </div>
//           <div className="Footer_img" style={{ overflow: "scroll" }}>
//             {/* <div
//             className="Footer_img"
//             style={{
//               overflowX: "scroll",
//               display: "flex",
//               whiteSpace: "nowrap",
//             }}
//           > */}
//             {getProduct?.OtherImages?.map((imageObj, index) => (
//               <img
//                 key={index}
//                 src={imageObj.imagelink}
//                 alt={`cart_product${index + 1}`}
//                 className="cart_product"
//                 onClick={() => handleMediaClick("image", imageObj.imagelink)}
//                 // style={{ cursor: "pointer" }}
//                 style={{ cursor: "pointer", margin: "0 5px" }}
//               />
//             ))}
//             {getProduct?.videolink && (
//               <img
//                 src={videoTha}
//                 alt="Product Video"
//                 className="cart_product"
//                 onClick={() => handleMediaClick("video", getProduct.videolink)}
//                 // style={{ cursor: "pointer", height: "50px", width: "50px" }}
//                 style={{
//                   cursor: "pointer",

//                   margin: "0 5px",
//                 }}
//               />
//             )}
//           </div>
//         </div>
//         {error && <p className="error">{error}</p>}
//         <div className="All_text">
//           <h1>
//             {getProduct
//               ? getProduct.product_name
//               : "PERSONALIZE PASSPORT COVER"}
//           </h1>
//           <p className="Description">{getProduct?.product_description || ""}</p>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "start",
//               alignItems: "center",
//               gap: "13px",
//             }}
//           >
//             <b>Public review</b>
//             <StarRatingShow
//               rating={getProduct ? getProduct.average_rating : 0}
//             />
//           </div>
//           <div className="personalize_Text">
//             <h2>
//               {isCouple
//                 ? `RS. ${newPrice?.total_Price || 0}`
//                 : `RS. ${getProduct?.product_discount_price || 0}`}
//             </h2>
//             <h4>
//               <strike>
//                 {isCouple
//                   ? `RS. ${newPrice?.New_Price || 0}`
//                   : `RS. ${getProduct?.product_price || 0}`}
//               </strike>
//             </h4>
//           </div>
//           <div className="Personalize_Text">
//             <h4 className="personalize_SubText">
//               SAVE
//               {isCouple
//                 ? ` RS. ${newPrice?.save_Price || 0}`
//                 : ` RS. ${getProduct?.product_discount || 0}`}
//             </h4>
//           </div>

//           <div>
//             {Object.keys(productObj).map((key) => (
//               <div style={{ margin: "20px 0px" }} key={key}>
//                 <strong>{key}: </strong>
//                 {renderInput(key, productObj[key])}
//               </div>
//             ))}
//           </div>
//           <button
//             className="personalize_Cover_Button"
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Submitting..." : "ADD TO CART"}
//           </button>
//           <div className="responsive-review">
//             <StarRating productId={productId} />
//           </div>
//         </div>
//         <ToastContainer />
//       </div>
//       <div className="main-review">
//         <h3 className="review-text">Reviews</h3>
//         <div className="review-box2">
//           {getProduct?.taxt_comment.map((comment, index) => (
//             <Review key={index} comment={comment} />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// const Review = ({ comment }) => {
//   const [isTruncated, setIsTruncated] = useState(true);
//   const toggleTruncate = () => setIsTruncated(!isTruncated);

//   const { user_data, review_text } = comment;
//   const { user_first_name, user_last_name, imagelink } = user_data;

//   const words = review_text.split(" ");
//   const displayText = isTruncated
//     ? words.slice(0, 20).join(" ") + (words.length > 20 ? "..." : "")
//     : review_text;

//   return (
//     <>
//       <div className="img-box">
//         <div className="img-name">
//           <div>
//             <img src={imagelink} alt="User Profile" className="profile-img" />
//           </div>

//           <div>
//             <h4>
//               {user_first_name} {user_last_name}
//             </h4>
//           </div>
//         </div>
//         <div>
//           <div className="review-padding">
//             <p>{displayText}</p>
//             {words.length > 20 && (
//               <span onClick={toggleTruncate} className="read-more-text">
//                 {" "}
//                 {isTruncated ? "Read more" : "Show less"}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BagAddToCart;



import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StarRating from "../StarRating/StarRating";
import StarRatingShow from "../StarRating/StarRatingShow";
import Product3 from "./imgas/Product3.png";
import videoTha from "./imgas/video-play-512.png";
import "./BagAddToCart.css";
import axios from "axios";

const BagAddToCart = () => {
  const location = useLocation();
  const { productId, mycartId, productModifyObject } = location.state || {};

  const [error, setError] = useState(null);
  const [getProduct, setGetProduct] = useState(null);
  const [isCouple, setIsCouple] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPrice, setNewPrice] = useState(null);
  const [formData, setFormData] = useState({});
  const[cartData, setCartData] = useState("")
  const [currentMedia, setCurrentMedia] = useState({
    type: "image",
    src: Product3,
  });

  const handleMediaClick = (type, src) => {
    setCurrentMedia({ type, src });
  };

  const handleCoupleClick = () => {
    setIsCouple(true);
  };

  const callAllFunctions = () => {
    handleCoupleClick();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!productId) {
        setError("Product ID not provided");
        return;
      }
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/User/productGet`,
          { product_id: productId },
          {
            headers: {
              "Content-Type": "application/json",
              "Auth-Token": localStorage.getItem("auth_token"),
            },
          }
        );
        const result = response?.data;
        if (productModifyObject) {
          setFormData(JSON.parse(productModifyObject));
        } else {
          setGetProduct(response?.data);
        }
        if (result.data && typeof result.data === "object") {
          setGetProduct(result.data);
          if (result.data.OtherImages && result.data.OtherImages.length > 0) {
            setCurrentMedia({
              type: "image",
              src: result.data.OtherImages[0].imagelink,
            });
          } else if (result.data.videolink) {
            setCurrentMedia({
              type: "video",
              src: result.data.videolink,
            });
          }
        } else {
          setError("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch products");
      }
    };
    fetchProducts();
  }, [productId, productModifyObject]);

  let productObj = {};
  if (getProduct && getProduct.product_modify_object) {
    try {
      productObj = JSON.parse(JSON.parse(getProduct.product_modify_object));
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  } else {
    console.warn(
      "getProduct or getProduct.product_modify_object is undefined or null."
    );
  }

  // Handle manual text input change
  const handleInputChange = (key, newValue) => {
    setFormData((prevProductObj) => ({
      ...prevProductObj,
      [key]: newValue,
    }));
  };

  // Handle dropdown selection change
  const handleDropdownChange = (key, selectedValue) => {
    const parsedValue = JSON.parse(selectedValue);
    setFormData((prevProductObj) => ({
      ...prevProductObj,
      [key]: parsedValue,
    }));
  };

  const renderInput = (key, value) => {
    if (value === "Text") {
      return (
        <input
          type="text"
          className="input-style"
          placeholder={`Enter ${key}`}
          value={formData[key] || ""}
          onChange={(e) => handleInputChange(key, e.target.value)}
        />
      );
    } else if (typeof value === "string" || typeof value === "number") {
      return (
        <input type="text" className="input-style" value={value} readOnly />
      );
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object"
    ) {
      const selectedOption = formData[key]
        ? JSON.stringify(formData[key])
        : JSON.stringify(value[0]);
      return (
        <select
          value={selectedOption}
          className="input-style"
          onChange={(e) => handleDropdownChange(key, e.target.value)}
        >
          {value.map((item, index) => (
            <option key={index} value={JSON.stringify(item)}>
              {Object.keys(item)
                .filter((subKey) => subKey !== "id")
                .map((subKey) => item[subKey])
                .join(", ")}
            </option>
          ))}
        </select>
      );
    } else {
      return <span>{JSON.stringify(value)}</span>;
    }
  };
  const navigate = useNavigate();
  const fetchDataCart = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/User/getCartCount`,

        {
          headers: {
            "Content-Type": "application/json",

            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );

      setCartData(response.data.data.Product_count_cart);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchDataCart();
  }, [cartData]);

  const handleSubmit = async (e) => {


  
    navigate("/addtocart");
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const user_id = parseInt(localStorage.getItem("user_id"));
    const product_id = productId;

    const SubData = { ...formData };
    const order_id = 0;
    const mycart_id = mycartId ? mycartId : 0;

    const order_total = isCouple
      ? newPrice?.total_Price || 0
      : getProduct?.product_discount_price || 0;

    const parsedData = {
      mycart_id,
      product_id,
      user_id,
      product_modify_object: SubData,
    };

    const requestBody = JSON.stringify(parsedData);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/User/addToCart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
          body: requestBody,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === 1) {
        // toast.success("Added to cart");
        callAllFunctions(order_id);
      } else {
        // toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error:", error);
      // toast.error("Error adding to cart");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="AddToCard">
        <div className="images_seacation">
          <div className="Images_div">
            {currentMedia.type === "video" ? (
              <video autoPlay width="100%" height="100%" className="Video_show">
                <source src={currentMedia.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={currentMedia.src}
                alt="Main Product"
                id="Images"
                className="Product3"
              />
            )}
          </div>
          <div className="footer-img-section">
          <div className="Footer_img" >
            {/* <div
            className="Footer_img"
            style={{
              overflowX: "scroll",
              display: "flex",
              whiteSpace: "nowrap",
            }}
          > */}
            {getProduct?.OtherImages?.map((imageObj, index) => (
              <img
                key={index}
                src={imageObj.imagelink}
                alt={`cart_product${index + 1}`}
                className="cart_product"
                onClick={() => handleMediaClick("image", imageObj.imagelink)}
                // style={{ cursor: "pointer" }}
                style={{ cursor: "pointer", margin: "0 5px" }}
              />
            ))}
            {getProduct?.videolink && (
              <img
                src={videoTha}
                alt="Product Video"
                className="cart_product"
                onClick={() => handleMediaClick("video", getProduct.videolink)}
                // style={{ cursor: "pointer", height: "50px", width: "50px" }}
                style={{
                  cursor: "pointer",

                  margin: "0 5px",
                }}
              />
            )}
          </div>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="All_text">
          <h1>
            {getProduct
              ? getProduct.product_name
              : "PERSONALIZE PASSPORT COVER"}
          </h1>
          <p className="Description">{getProduct?.product_description || ""}</p>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              gap: "13px",
            }}
          >
            <b>Public review</b>
            <StarRatingShow
              rating={getProduct ? getProduct.average_rating : 0}
            />
          </div>
          <div className="personalize_Text">
            <h2>
              {isCouple
                ? `RS. ${newPrice?.total_Price || 0}`
                : `RS. ${getProduct?.product_discount_price || 0}`}
            </h2>
            <h4>
              <strike>
                {isCouple
                  ? `RS. ${newPrice?.New_Price || 0}`
                  : `RS. ${getProduct?.product_price || 0}`}
              </strike>
            </h4>
          </div>
          <div className="Personalize_Text">
            <h4 className="personalize_SubText">
              SAVE
              {isCouple
                ? ` RS. ${newPrice?.save_Price || 0}`
                : ` RS. ${getProduct?.product_discount || 0}`}
            </h4>
          </div>

          <div>
            {Object.keys(productObj).map((key) => (
              <div style={{width:"100%", display:"flex", gap:"10px", margin:"20px 0px"}} key={key}>
                <div className="lable-1">
              
             
                <strong>{key}: </strong>
                </div>
                <div className="input-1">
                {renderInput(key, productObj[key])}
                </div>
              </div>
            ))}
          </div>
          <button
            className="personalize_Cover_Button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "ADD TO CART"}
          </button>
        </div>
      </div>
      <div className="responsive-review">
        <StarRating productId={productId} getProduct={getProduct} />
      </div>
    </>
  );
};

export default BagAddToCart;
