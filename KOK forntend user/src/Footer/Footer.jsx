
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./images/Logo.png";
import instagram from "./images/Insta.png";
import Twitter from "./images/Twitter.png";
import Facebook from "./images/Facebook.png";
import "./Footer.css";

const Footer = () => {
  const [hover, setHover] = useState(false);

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
  };

  const hoverStyle = {
    color: hover ? "#bbb" : "#fff",
    textDecoration: "none",
  };

  return (
    <>
      <div className="Footer">
        <div className="Footer_hedar">
          <div className="Footer_Div1">
            <Link to="/">
              <img src={Logo} alt="Logo" className="Logo" />
            </Link>
            <div>
              <p>A-44-45, Sumeru City Mall,</p>
              <p>Sudama Chowk, Mota Varacha,</p>
              <p>Surat, Gujrat 394101</p>
              <p>Phone : +91 96648 03121</p>
              <p>Email : info@ivyaaggarwal.net</p>
              <div className="Social_media ">
                <img src={instagram} alt="instagram" className="instagram" />
                <img src={Twitter} alt="Twitter" className="Twitter" />
                <img src={Facebook} alt="Facebook" className="Facebook" />
              </div>
            </div>
          </div>
          
            <div className="Footer_text">
              <h2>CUSTOMER SERVICE</h2>
              <hr className="Footer_hr" />
              <div>
                <div className="CUSTOMER_text">
                  <Link
                    style={{ color: "#fff", textDecoration: "none" }}
                    to="/termsConditions"
                  >
                    Terms & Conditions
                  </Link>
                  <p className="CUSTOMER_text_3">
                    <Link
                      style={{ color: "#fff", textDecoration: "none" }}
                      to="/privacyTerms"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                  <p className="CUSTOMER_text_3">
                    <Link
                      style={{ color: "#fff", textDecoration: "none" }}
                      to="/refundsExchanges"
                    >
                      Cancellation & Refund Policy
                    </Link>
                  </p>
                </div>
              </div>
            </div>
    
          <div className="Footer_text3">
            <div className="Footer_text">
              <h2>BEAUE LIFESTYLE</h2>
              <hr className="Footer_hr" />
              <p style={{ color: "#fff", marginBottom: "0px" }}>
                <NavLink style={linkStyle} to="/">
                  Home
                </NavLink>
              </p>
              {/* <p style={{ color: "#fff", marginBottom: "0px" }}>
                <Link style={linkStyle} to="/passportCover">
                  Passport Cover
                </Link>
              </p> */}
              {/* <p style={{ color: "#fff", marginBottom: "0px" }}>
                <Link
                  to="/luggageBag"
                  style={hoverStyle}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  Luggage Bag
                </Link>
              </p> */}
              <p>
                <Link style={linkStyle} to="/contactUs">
                  Contact Us
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div>
          <hr className="Footer_Last_hr" />
          <div className="Footer_Last_text">
            <p>
              All rights Developed by Beaue Lifestyle | Designed & Developed by:
              <a
                style={{ color: "#fff", textDecoration: "none" }}
                href="https://www.weblockinfosoft.com/"
              >
                WEBLOCK INFOSOFT
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
