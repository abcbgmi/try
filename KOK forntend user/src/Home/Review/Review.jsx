// import React, { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import User from "./images/User.png";
// import "./Review.css";

// const Review = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % data.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [data.length]);

//   const fetchReviewData = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/User/testimonialsFill`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "Auth-Token": localStorage.getItem("auth_token"),
//           },
//         }
//       );
//       setData(response.data.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching category:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReviewData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (data.length === 0) {
//     return <div style={{ display: "flex", justifyContent: "center" }}>No data available.</div>;
//   }

//   const currentReview = data[currentSlide];

//   return (
//     <>
//       {/* <ToastContainer /> */}
//       <div>
//         <h1 className="CustomerReviews">Customer Reviews</h1>
//       </div>
//       <div className="Review_box">
//         <div className="Review_card">
//           <div className="Review_card1">
//             <img
//               src={currentReview.user_data.imagelink || User}
//               alt="User"
//               className="User"
//             />
//             <p className="User_text1">{currentReview.review_text}</p>
//             <p className="User_text2">
//               {currentReview.user_data.user_first_name}{" "}
//               {currentReview.user_data.user_last_name}
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Review;
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import User from "./images/User.png";
import "./Review.css";
const Review = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [data.length]);
  const fetchReviewData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/User/testimonialsFill`,
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching category:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReviewData();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (data.length === 0) {
    return <div style={{ display: "flex", justifyContent: "center" }}>No data available.</div>;
  }
  const currentReview = data[currentSlide];
  return (
    <>
      {/* <ToastContainer /> */}
      <div>
        <h1 className="CustomerReviews">Customer Reviews</h1>
      </div>
      <div className="Review_box">
        <div className="Review_card">
          <div className="Review_card1">
            <img
              src={currentReview?.user_data?.imagelink || User}
              alt="User"
              className="User"
            />
            <p className="User_text1">{currentReview?.review_text}</p>
            <p className="User_text2">
              {currentReview?.user_data?.user_first_name}{" "}
              {currentReview?.user_data?.user_last_name}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Review;