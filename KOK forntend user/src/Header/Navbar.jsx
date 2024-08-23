// import React, { useEffect, useState, useCallback } from "react";
// import { Link, useNavigate, NavLink } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import BeaueLife_logo from "./image/Logo.png";
// import shopping from "./image/cart-shopping-fast-svgrepo-com.svg";
// import Menubar from "./image/menu-svgrepo-com.svg";
// import Marquee from "../Marquee/Marquee";
// import "./Navbar.css";
// import axios from "axios";

// const NavBar = () => {

//   const navigate = useNavigate();

//   const [itemCount, setItemCount] = useState(0);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isNavMenuVisible, setIsNavMenuVisible] = useState(false);
//   const [image, setImage] = useState(null);
//   const [isUserSectionVisible, setIsUserSectionVisible] = useState(false);
//   const [cartData, setCartData] = useState(0);
//   const [data, setData] = useState([]);

//   console.log('cartData>>>+++', cartData)

//   const handleShoppingMenuClick = useCallback(() => {
//     navigate("/addtocart");
//   }, [navigate]);

//   const toggleNavMenu = useCallback(() => {
//     setIsNavMenuVisible((prev) => !prev);
//   }, []);

//   const toggleUserSection = () => {
//     setIsUserSectionVisible(!isUserSectionVisible);
//   };

//   const handleLogout = useCallback(async () => {
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_BASE_URL}/User/logout`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Auth-Token": localStorage.getItem("auth_token"),
//           },
//         }
//       );
//       if (response.ok) {
//         localStorage.clear();
//         // toast.success("Logged out successfully!");
//         setTimeout(() => {
//           navigate("/login");
//         }, 500);
//       } else {
//         // toast.error("Failed to logout");
//       }
//     } catch (error) {
//       console.error("Failed to logout:", error.message);
//       // toast.error("An error occurred while logging out");
//     }
//   });

//   useEffect(() => {
//     const user_id = localStorage.getItem("user_id");
//     const auth_token = localStorage.getItem("auth_token");
//     setIsAuthenticated(!!(user_id && auth_token));
//   }, [navigate]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       const fetchUserData = async () => {
//         try {
//           const response = await fetch(
//             `${process.env.REACT_APP_API_BASE_URL}/User/fill`,
//             {
//               method: "POST",
//               headers: {
//                 "Auth-Token": localStorage.getItem("auth_token"),

//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 user_id: localStorage.getItem("user_id"),
//               }),
//             }
//           );
//           if (response.ok) {
//             const data = await response.json();
//             setImage(data.data?.imagelink || null);
//           } else {
//             // toast.error("Failed to fetch user data");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);

//           // toast.error("An error occurred while fetching user data");
//         }
//       };

//       fetchUserData();
//     }
//   }, [isAuthenticated]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       const fetchData = async () => {
//         try {
//           const response = await fetch(
//             `${process.env.REACT_APP_API_BASE_URL}/User/CartGet`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 "Auth-Token": localStorage.getItem("auth_token"),
//               },
//               body: JSON.stringify({ order_id: 0 }),
//             }
//           );
//           if (response.ok) {
//             const result = await response.json();
//             setItemCount(result.ProductInCart || 0);
//           } else {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
//         } catch (error) {
//           console.error("Error fetching cart data:", error);
//           // toast.error("An error occurred while fetching cart data");
//         }
//       };

//       fetchData();
//     }
//   }, [isAuthenticated]);

//   useEffect(() => {
//     const userNavBar = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_BASE_URL}/User/categoryFill`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               "Auth-Token": localStorage.getItem("auth_token"),
//             },
//           }
//         );
//         setData(response.data.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     if (isAuthenticated) {
//       userNavBar();
//     }
//   }, [isAuthenticated]);

//   const handleCategoryClick = (category_id) => {
//     navigate(`/category/${category_id}`);

//     toggleNavMenu();
//   };

//   const fetchDataCart = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_BASE_URL}/User/getCartCount`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "Auth-Token": localStorage.getItem("auth_token"),
//           },
//         }
//       );
//       setCartData(response.data.data.Product_count_cart);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchDataCart();
//   }, [cartData]);

//   return (
//     <>
//       <Marquee>
//         {[...Array(10)].map((_, index) => (
//           <span key={index} style={{ margin: "0 2rem", color: "#fff" }}>
//             FREE Shipping On Orders Above Rs 499
//           </span>
//         ))}
//       </Marquee>
//       <nav className="navbar">
//         <Link to="/">
//           <div>
//             <img
//               src={BeaueLife_logo}
//               alt="BeaueLife_logo"
//               className="BeaueLife_logo"
//               style={{
//                 marginTop: "20px",
//               }}
//             />
//           </div>
//         </Link>
//         <ul className={`nav-menu ${isNavMenuVisible ? "active" : ""}`}>
//           <li>
//             <NavLink
//               exact
//               to="/"
//               onClick={toggleNavMenu}
//               activeClassName="active"
//             >
//               Home
//             </NavLink>
//           </li>
//           {data
//             .filter((item) => item.is_active)
//             .map((item) => (
//               <li key={item.category_id}>
//                 <NavLink
//                   to={`/category/${item.category_id}`}
//                   onClick={() => handleCategoryClick(item.category_id)}
//                 >
//                   {item.category_name}
//                 </NavLink>
//               </li>
//             ))}
//           <li>
//             <NavLink
//               to="/contactUs"
//               onClick={toggleNavMenu}
//               activeClassName="active"
//             >
//               Contact Us
//             </NavLink>
//           </li>
//           <div className="shopping_menu" onClick={handleShoppingMenuClick}>
//             {/* <p>{itemCount} items</p> */}
//             <div class="cart-button">
//               <img src={shopping} alt="shopping" className="shopping_bag" />
//               <span class="badge">{cartData}</span>
//             </div>
//           </div>
//         </ul>
//         {isAuthenticated ? (
//           <div className="user-section-container" style={{ cursor: "pointer" }}>
//             <div className="User_logo">
//               <img
//                 src={image}
//                 alt="User Profile"
//                 className="user-logo1"
//                 onClick={toggleUserSection}
//               />
//               {isUserSectionVisible && (
//                 <div className="user-section">
//                   <Link
//                     style={{ color: "#000", textDecoration: "none" }}
//                     to="/Profile"
//                     onClick={toggleUserSection}
//                   >
//                     Account Details
//                   </Link>
//                   <Link
//                     style={{ color: "#000", textDecoration: "none" }}
//                     to="/changePassword"
//                     onClick={toggleUserSection}
//                   >
//                     Change Password
//                   </Link>
//                   <Link
//                     style={{ color: "#000", textDecoration: "none" }}
//                     onClick={() => {
//                       toggleUserSection();

//                       handleLogout();
//                     }}
//                   >
//                     LogOut
//                   </Link>
//                 </div>
//               )}
//             </div>
//             {isUserSectionVisible && (
//               <div
//                 className={`user-section ${isUserSectionVisible ? "active" : ""
//                   }`}
//               >
//                 <Link
//                   style={{ color: "#000", textDecoration: "none" }}
//                   to="/Profile"
//                   onClick={toggleUserSection}
//                 >
//                   Account Details
//                 </Link>
//                 <Link
//                   style={{ color: "#000", textDecoration: "none" }}
//                   to="/myOrderes"
//                   onClick={toggleUserSection}
//                 >
//                   My Orderes
//                 </Link>
//                 <Link
//                   style={{ color: "#000", textDecoration: "none" }}
//                   to="/changePassword"
//                   onClick={toggleUserSection}
//                 >
//                   Change Password
//                 </Link>
//                 <Link
//                   style={{ color: "#000", textDecoration: "none" }}
//                   onClick={() => {
//                     toggleUserSection();
//                     handleLogout();
//                   }}
//                 >
//                   LogOut
//                 </Link>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="Navebar_button">
//             <button className="button-4" onClick={() => navigate("/login")}>
//               Login
//             </button>
//             <button
//               className="button-4"
//               onClick={() => navigate("/registration")}
//             >
//               Register
//             </button>
//           </div>
//         )}
//         <img
//           src={Menubar}
//           className="navMenuicon"
//           alt="Menubar"
//           height={20}
//           onClick={toggleNavMenu}
//         />
//       </nav>
//       <ToastContainer />
//     </>
//   );
// };

// export default NavBar;

import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BeaueLife_logo from "./image/Logo.png";
import userlogo from "../userimage/userlogo.jpg";
import shopping from "./image/cart-shopping-fast-svgrepo-com.svg";
import Menubar from "./image/menu-svgrepo-com.svg";
import Marquee from "../Marquee/Marquee";
import "./Navbar.css";
import axios from "axios";
import useWindowSize from "./useWindowSize";
const NavBar = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    toast.error("login reqired")
  };
  const size = useWindowSize();
  const isMobileView = size.width <= 900;
  const navigate = useNavigate();
  const [itemCount, setItemCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNavMenuVisible, setIsNavMenuVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [isUserSectionVisible, setIsUserSectionVisible] = useState(false);
  const [cartData, setCartData] = useState("");
  const [data, setData] = useState([]);
  const handleShoppingMenuClick = useCallback(() => {
    navigate("/addtocart");
  }, [navigate]);
  const toggleNavMenu = useCallback(() => {
    setIsNavMenuVisible((prev) => !prev);
    setIsUserSectionVisible(false);
  }, []);
  const toggleUserSection = () => {
    setIsUserSectionVisible(!isUserSectionVisible);
    setIsNavMenuVisible(false);
  };




  const loginpageopen=()=>{
    navigate("/login")
  }
  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/User/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
        }
      );
      if (response.ok) {
        localStorage.clear();
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Failed to logout:", error.message);
    }
  }, [navigate]);
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const auth_token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!(user_id && auth_token));
  }, []);
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/User/fill`,
            {
              method: "POST",
              headers: {
                "Auth-Token": localStorage.getItem("auth_token"),
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: localStorage.getItem("user_id"),
              }),
            }
          );
          if (response.ok) {
            const data = await response.json();
            setImage(data.data?.imagelink || null);
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [isAuthenticated]);
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/User/CartGet`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Auth-Token": localStorage.getItem("auth_token"),
              },
              body: JSON.stringify({ order_id: 0 }),
            }
          );
          if (response.ok) {
            const result = await response.json();
            setItemCount(result.ProductInCart || 0);
          } else {
            console.error("HTTP error! status:", response.status);
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      };
      fetchData();
    }
  }, [isAuthenticated]);
  useEffect(() => {
    const userNavBar = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/User/categoryFill`,
          {
            headers: {
              "Content-Type": "application/json",
              "Auth-Token": localStorage.getItem("auth_token"),
            },
          }
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (isAuthenticated) {
      userNavBar();
    } else {
      // Fetch all categories if not authenticated
      const fetchAllCategories = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/User/categoryFill`
          );
          setData(response.data.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchAllCategories();
    }
  }, [isAuthenticated]);
  const handleCategoryClick = (category_id) => {
    navigate(`/category/${category_id}`);
    toggleNavMenu();
  };
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
  return (
    <>
      <Marquee>
        {[...Array(10)].map((_, index) => (
          <span key={index} style={{ margin: "0 2rem", color: "#fff" }}>
            FREE Shipping On Orders Above Rs 499
          </span>
        ))}
      </Marquee>
      <nav className="navbar">
        <Link to="/">
          <div>
            <img
              src={BeaueLife_logo}
              alt="BeaueLife_logo"
              className="BeaueLife_logo"
              style={{
                marginTop: "20px",
              }}
            />
          </div>
        </Link>
        <div className={`nav-menu ${isNavMenuVisible ? "active" : ""}`}>
          <ul>
            <li>
              <NavLink
                exact
                to="/"
                onClick={toggleNavMenu}
                activeClassName="active"
              >
                Home
              </NavLink>
            </li>
            {data.map((item) => (
              <li key={item.category_id}>
                <NavLink
                  to={`/category/${item.category_id}`}
                  onClick={() => handleCategoryClick(item.category_id)}
                >
                  {item.category_name}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/contactUs"
                onClick={toggleNavMenu}
                activeClassName="active"
              >
                Contact Us
              </NavLink>
            </li>
          </ul>
          {isMobileView && isAuthenticated && (
            <div
              className="cart-button-group"
              onClick={handleShoppingMenuClick}
            >
              <div className="cart-button">
                <img src={shopping} alt="shopping" className="shopping_bag" />
                <span className="badge">{cartData}</span>
              </div>
            </div>
          )}
        </div>
        {isAuthenticated ? (
          <>
            {!isMobileView && (
              <div className="cart-button" onClick={handleShoppingMenuClick}>
                <img src={shopping} alt="shopping" className="shopping_bag" />
                <span className="badge">{cartData}</span>
              </div>
            )}
            <div
              className="user-section-container"
              style={{ cursor: "pointer" }}
            >
              <div className="User_logo">
                <img
                  src={image}
                  alt="User Profile"
                  className="user-logo1"
                  onClick={toggleUserSection}
                />
                {isUserSectionVisible && (
                  <div className="user-section">
                    <Link
                      style={{ color: "#000", textDecoration: "none" }}
                      to="/Profile"
                      onClick={toggleUserSection}
                    >
                      Account Details
                    </Link>
                    <Link
                      style={{ color: "#000", textDecoration: "none" }}
                      to="/changePassword"
                      onClick={toggleUserSection}
                    >
                      Change Password
                    </Link>
                    <Link
                      style={{ color: "#000", textDecoration: "none" }}
                      onClick={() => {
                        toggleUserSection();
                        handleLogout();
                      }}
                    >
                      LogOut
                    </Link>
                  </div>
                )}
              </div>
              {isUserSectionVisible && (
                <div
                  className={`user-section ${
                    isUserSectionVisible ? "active" : ""
                  }`}
                >
                  <Link
                    style={{ color: "#000", textDecoration: "none" }}
                    to="/Profile"
                    onClick={toggleUserSection}
                  >
                    Account Details
                  </Link>
                  <Link
                    style={{ color: "#000", textDecoration: "none" }}
                    to="/myOrderes"
                    onClick={toggleUserSection}
                  >
                    My Orderes
                  </Link>
                  <Link
                    style={{ color: "#000", textDecoration: "none" }}
                    to="/changePassword"
                    onClick={toggleUserSection}
                  >
                    Change Password
                  </Link>
                  <Link
                    style={{ color: "#000", textDecoration: "none" }}
                    onClick={() => {
                      toggleUserSection();
                      handleLogout();
                    }}
                  >
                    LogOut
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {isUserSectionVisible && (
              <>
                <div className="navbar-btn">
                  <h5 className="" onClick={() => navigate("/login")}>
                    Login
                  </h5>

                  <hr className="h-line" />

                  <h5 className="" onClick={() => navigate("/registration")}>
                    Register
                  </h5>
                </div>
              </>
            )}

            <img
              src={userlogo}
              // onMouseEnter={isUserSectionVisible}
              // onMouseLeave={hideUserSection}

              className="user-logo"
              onClick={toggleUserSection}
            />
<div className="cart-button" onClick={togglePopup}>
                <img src={shopping} alt="shopping" className="shopping_bag" />
               
              </div>
            
          </>
        )}
        <img
          src={Menubar}
          className="navMenuicon"
          alt="Menubar"
          height={20}
          onClick={toggleNavMenu}
        />
      </nav>
      {/* {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>You have to login First...!</h2>
          
            <button className="close-btn" onClick={togglePopup}>continue</button>
            <button className="login-btn" onClick={loginpageopen}>Login</button>

          </div>
        </div>
      )} */}
      <ToastContainer />
    </>
  );
};
export default NavBar;
