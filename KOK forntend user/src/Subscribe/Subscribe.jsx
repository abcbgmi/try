
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Subscribe.css";

const Subscribe = () => {

    const [data, setData] = useState("");

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/User/subscriptionimageFill`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Auth-Token": localStorage.getItem("auth_token"),
                    },
                }
            );
            setData(response.data.data); // Accessing the nested 'data' property
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [data2, setData2] = useState("");

    const fetchDataSubscribe = async () => {
        try {
            const userEmail = { user_email: data2 };
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/User/subscriptionEmail`,
                userEmail,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Auth-Token": localStorage.getItem("auth_token"),
                    },
                }
            );
            // setOrderStatus(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);

        }
    };

    const handleSubscribe = () => {
        fetchDataSubscribe()
        setData2("")
    }

    return (
        <div>

                <div className="subscribe-bg">
                    <div className="subscribe-main-part">
                        <div className="subscribe-part1">
                            <img
                                src={data?.imagelink}
                                alt={data?.image_description}
                                className="subscribe-img"
                            />
                        </div>
                        <div className="subscribe-part2">
                            <h1>{data?.image_tital}</h1>
                            <h2>{data?.image_description}</h2>

                            <div className="subscribe-input">
                                <input
                                    onChange={(e) => setData2(e.target.value)}
                                    type="email"
                                    name="email"
                                    value={data2}
                                    placeholder="Email Address"
                                    id="email"
                                />
                                <button className="SUBSCRIBE_btn" onClick={handleSubscribe}>
                                    SUBSCRIBE
                                </button>
                            </div>
                            <p className="sub-text">{data?.image_sub_description}</p>
                        </div>
                    </div>
                </div>
           
        </div>
    );
};

export default Subscribe;
