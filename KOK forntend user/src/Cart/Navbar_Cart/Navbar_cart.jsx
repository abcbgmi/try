import React, { useState } from "react";
import "./Navbar_cart.css";

const NavbarCart = () => {
  const [activeSection, setActiveSection] = useState("description");

  const renderContent = () => {
    switch (activeSection) {
      case "SHIPPING & DELIVERY":
        return (
          <div className="sipingText">
            <ul>
              <li>
                We provide free shipping within India on orders above Rs.499
              </li>
              <li>
                This product is not eligible for express shipping and same day
                delivery
              </li>
              <li>
                Standard shipping timelines: Delivery within 6-8 working days
              </li>
            </ul>
          </div>
        );
      case "PERSONALIZATION":
        return (
          <div>
            <ul>
              <li>Only alphabets and numbers can be inscribed</li>
              <li>Max character limit - 12 </li>
            </ul>
          </div>
        );
      case "DESCRIPTION & FEATURES":
        return (
          <div>
            <p>
              A great travel companion and a cover that you will always want to
              hold in your hands!
            </p>
            <p>
              All the personalization is printed using exclusive technology,
              developed after extensive research to maintain the versatility and
              elegance of each product.
            </p>
            <p>
              Made with premium vegan leather, it’s perfect, durable, quirky,
              and is sure to stand out from the crowd.
            </p>
            <ul>
              <li>Includes inside pockets for only ONE passport.</li>
              <li>These prints are waterproof, does not fade or chip. </li>
              <li>Vegan/Synthetic Leather</li>
              <li>Dimensions : 5.5" x 3.8"</li>
            </ul>
          </div>
        );
      case "included":
        return (
          <div>
            <ul>
              <li>Synthetic leather/ Vegan leather</li>
              <li>Contains 2 passport holders. </li>
              <li>Each passport cover can hold only one passport.</li>
              <li>Price includes name tag & 1 charm.</li>
              <li>Dimensions: 5.5”x 3.8”</li>
              <li>Packed in a gift box.</li>
            </ul>
            <p>
              In order to view all the colours, please visit the "Passport
              cover" section.
            </p>
          </div>
        );
      // Add cases for other sections as needed
      default:
        return null;
    }
  };

  return (
    <>
      <ul className="Navbar_cart">
        <li
          className={
            activeSection === "DESCRIPTION & FEATURES" ? "active" : "inactive"
          }
          onClick={() => setActiveSection("DESCRIPTION & FEATURES")}
        >
          Description & Features
        </li>
        <li
          className={activeSection === "included" ? "active" : "inactive"}
          onClick={() => setActiveSection("included")}
        >
          What’s Included
        </li>
        <li
          className={
            activeSection === "PERSONALIZATION" ? "active" : "inactive"
          }
          onClick={() => setActiveSection("PERSONALIZATION")}
        >
          Personalization
        </li>
        <li
          className={
            activeSection === "SHIPPING & DELIVERY" ? "active" : "inactive"
          }
          onClick={() => setActiveSection("SHIPPING & DELIVERY")}
        >
          Shipping & Delivery
        </li>
      </ul>
      <br />
      <hr />
      {renderContent()}
    </>
  );
}

export default NavbarCart;
