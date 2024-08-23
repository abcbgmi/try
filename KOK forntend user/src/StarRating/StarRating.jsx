// import React, { useState, useEffect } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const StarRating = ({ productId }) => {
//   const [rating, setRating] = useState(0); // State for rating
//   const [reviewId, setReviewId] = useState(0); // State for review ID
//   // const [userId, setUserId] = useState(""); // State for user ID
//   const [inputData, setInputData] = useState(""); // State for review input data
//   // Function to handle star click and add review
//   const handleAddReview = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_BASE_URL}/User/reviewInsUp`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Auth-Token": localStorage.getItem("auth_token"),
//           },
//           body: JSON.stringify({
//             rating: rating,
//             review_id: reviewId,
//             product_id: productId,
//             user_id: localStorage.getItem("user_id"), // Ensure user_id is parsed as an integer
//             review_text: inputData,
//           }),
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Failed to send review to server");
//       }
//     } catch (error) {
//       console.error("Error sending review to server:", error);
//     }
//   };
//   // Function to handle star click
//   const handleStarClick = (index) => {
//     const newRating = index + 1;
//     setRating(newRating); // Update rating state
//   };
//   // Effect hook to log current rating
//   useEffect(() => {
//     console.log(`Current rating: ${rating}`);
//   }, [rating]);
//   // Effect hook to fetch review ID and set user ID
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch review ID
//         const reviewResponse = await fetch(
//           `${process.env.REACT_APP_API_BASE_URL}/User/getReviewId`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               "Auth-Token": localStorage.getItem("auth_token"),
//             },
//           }
//         );
//         if (!reviewResponse.ok) {
//           throw new Error("Failed to fetch review ID from server");
//         }
//         const reviewData = await reviewResponse.json();
//         setReviewId(reviewData.review_id);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, []);
//   return (
//     <>
//       {/* Star rating display */}
//       <h4 className="rating-text">Your Rating</h4>
//       <div>
//         {[...Array(5)].map((_, index) => (
//           <span
//             key={index}
//             onClick={() => handleStarClick(index)}
//             style={{
//               fontSize: "36px",
//               cursor: "pointer",
//               color: index < rating ? "yellow" : "gray",
//             }}
//           >
//             &#9733;
//           </span>
//         ))}
//       </div>
//       {/* Review input and add button */}
//       <div>
//         <textarea
//           className="review-input"
//           type="text"
//           style={{ padding: "8px" }}
//           value={inputData}
//           onChange={(e) => setInputData(e.target.value)}
//           placeholder="Enter your review"
//         />
//         <button
//           onClick={handleAddReview}
//           className="add-review-button"
//           style={{
//             backgroundColor: "#0D6EFD",
//             border: "none",
//             padding: "10px 50px",
//             color: "white",
//             outline: "none",
//           }}
//         >
//           Add Review
//         </button>
//       </div>
//       {/* Toast notification container */}
//       <ToastContainer />
//     </>
//   );
// };
// export default StarRating;


import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StarRating = ({ productId, getProduct }) => {
  const [rating, setRating] = useState(0); // State for rating
  const [reviewId, setReviewId] = useState(0); // State for review ID
  const [inputData, setInputData] = useState(""); // State for review input data
  const [displayReview, setDisplayReview] = useState(false); // State for displaying the review
  const [userData, setUserData] = useState({}); // State for user data
  const [review, setReview] = useState("");

  // Function to handle star click and add review
  const FetchReview = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/User/reviewInsUp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
          body: JSON.stringify({
            rating: rating,
            review_id: reviewId,
            product_id: productId,
            user_id: parseInt(localStorage.getItem("user_id")), // Ensure user_id is parsed as an integer
            review_text: inputData,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send review to server");
      }
      toast.success("Review added successfully!");
      setReview(inputData);
      setDisplayReview(true); // Set the state to display the review
    } catch (error) {
      console.error("Error sending review to server:", error);
      // toast.error("Failed to add review");
    }
  };
  const handleAddReview = () => {
    FetchReview();
  };
  // Function to handle star click
  const handleStarClick = (index) => {
    const newRating = index + 1;
    setRating(newRating); // Update rating state
  };

  // Effect hook to fetch review ID and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/User/getReviewId`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Auth-Token": localStorage.getItem("auth_token"),
            },
          }
        );
        if (!reviewResponse.ok) {
          throw new Error("Failed to fetch review ID from server");
        }
        const reviewData = await reviewResponse.json();
        setReviewId(reviewData.review_id);

        const userResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/User/getUserData`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Auth-Token": localStorage.getItem("auth_token"),
            },
          }
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data from server");
        }
        const userData = await userResponse.json();
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Star rating display */}
      <h4 className="rating-text">Your Rating</h4>
      <div>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            onClick={() => handleStarClick(index)}
            style={{
              fontSize: "36px",
              cursor: "pointer",
              color: index < rating ? "yellow" : "gray",
            }}
          >
            &#9733;
          </span>
        ))}
      </div>
      {/* Review input and add button */}
      <div>
        <textarea
          className="review-input"
          type="text"
          style={{ padding: "8px" }}
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder="Enter your review"
        />
        <button
          onClick={handleAddReview}
          className="add-review-button"
          style={{
            backgroundColor: "#0D6EFD",
            border: "none",
            padding: "10px 50px",
            color: "white",
            outline: "none",
          }}
        >
          Add Review
        </button>
      </div>

      {/* Existing reviews */}
      <div className="existing-reviews">
        <h4>Existing Reviews</h4>
        {displayReview &&
          getProduct?.taxt_comment.map((comment, index) => (
            <div key={index} className="review-item">
              <div className="img-box">
                <div className="user-detail">
                  <img
                    src={comment.user_data.imagelink}
                    className="profile-img"
                    alt="User Profile"
                  />
                  <p>
                    {comment.user_data.user_first_name}{" "}
                    {comment.user_data.user_last_name}
                  </p>
                </div>
                <div>
                  <p>Review: {review}</p>
                </div>
              </div>
            </div>
          ))}
      </div>

      <ToastContainer />
    </>
  );
};

export default StarRating;
