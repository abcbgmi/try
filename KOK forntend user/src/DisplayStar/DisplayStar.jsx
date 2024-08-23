import React, { useState, useEffect } from "react";

const DisplayStar = () => {
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStars = async () => {
    try {
      // const response = await fetch("http://localhost:4000/User/reviewInsUp");
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/User/reviewInsUp`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setStars(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStars();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Stars</h1>
      <ul>
        {stars.map((star) => (
          <li key={star.id}>
            <h2>{star.name}</h2>
            <p>{star.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayStar;
