import React from "react";

const StarRatingShow = ({ rating }) => {
  const renderStar = (index) => {
    if (index + 1 <= rating) {
      return "yellow";
    } else if (index < rating && rating < index + 1) {
      return "half";
    } else {
      return "gray";
    }
  };

  return (
    <>
      <div>
        {[...Array(5)].map((_, index) => {
          const starType = renderStar(index);
          const starStyle =
            starType === "yellow"
              ? { color: "yellow" }
              : starType === "half"
              ? {
                  background: "linear-gradient(90deg, yellow 50%, gray 50%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }
              : { color: "gray" };
          return (
            <span
              key={index}
              style={{
                fontSize: "20px",
                cursor: "pointer",
                ...starStyle,
              }}
            >
              &#9733;
            </span>
          );
        })}
      </div>
    </>
  );
};

export default StarRatingShow;
