import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StarRating from "../../StarRating/StarRating";
import StarRatingShow from "../../StarRating/StarRatingShow";
import Product3 from "../imgas/Product3.png";
import instagram from "../imgas/instagram.png";
import twitter from "../imgas/twitter.png";
import FaceBook from "../imgas/Face book.png";
import videoTha from "../imgas/video-play-512.png";
import "./Card.css";

function Card() {
  const location = useLocation();
  const { productId } = location.state || {};
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [currentMedia, setCurrentMedia] = useState({
    type: "image",
    src: Product3,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charms, setCharms] = useState([]);
  const [selectedCharm, setSelectedCharm] = useState("");
  const [selectedCharm1, setSelectedCharm1] = useState("");
  const [isCouple, setIsCouple] = useState(false);
  const [newPrice, setNewPrice] = useState(null);
  const [send, setSend] = useState();
  const [formData, setFormData] = useState({
    orderTrn_id: 0,
    product_one_name: "",
    product_two_name: "",
    product_one_charm: "",
    product_two_charm: 1,
    product_one_color: "",
    product_two_color: "",
  });

  const handleCoupleClick = async () => {
    setIsCouple(true);
    await updatePrice();
  };

  const handleSingleClick = () => {
    setIsCouple(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCharmChange = (e, charmIndex) => {
    const { value } = e.target;
    const selectedCharm = charms.find((charm) => charm.charm_name === value);
    const charm_id = selectedCharm ? selectedCharm.charm_id : null;

    setFormData({
      ...formData,
      [charmIndex]: charm_id,
    });

    if (charmIndex === "product_one_charm") {
      setSelectedCharm(value);
    } else if (charmIndex === "product_two_charm") {
      setSelectedCharm1(value);
    }
  };

  const handleMediaClick = (type, src) => {
    setCurrentMedia({ type, src });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    const user_id = parseInt(localStorage.getItem("user_id"));
    const product_id = productId;
    const SubData = { ...formData };
    const order_id = 0;
    const order_total = price;

    const parsedData = {
      order_id,
      user_id,
      product_id,
      order_total,
      SubData,
    };

    const JsonData = JSON.stringify(parsedData);
    const requestBody = JSON.stringify({ JsonData });

    try {
      // const response = await fetch("http://localhost:4000/User/addToCart", {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/User/addToCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": localStorage.getItem("auth_token"),
        },
        body: requestBody,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 1) {
        toast.success("Added to cart");
        if (isCouple) {
          await updatePrice();
        }
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error adding to cart");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchProducts = async () => {
    if (!productId) {
      setError("Product ID not provided");
      return;
    }
    try {
      // const response = await fetch("http://localhost:4000/User/productGet", {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/User/productGet`, {
        method: "POST",
        headers: {
          "Auth-Token": localStorage.getItem("auth_token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (result.data && typeof result.data === "object") {
        setProduct(result.data);
        if (result.data.OtherImages && result.data.OtherImages.length > 0) {
          setCurrentMedia({
            type: "image",
            src: result.data.OtherImages[0].imagelink,
          });
        }
      } else {
        setError("Unexpected response format");
      }
      setSend(result.data.product_discount_price);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [productId]);

  const fetchCharms = async () => {
    try {
      // const response = await fetch("http://localhost:4000/User/charmGet", {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/User/charmGet`, {
        method: "POST",
        headers: {
          "Auth-Token": localStorage.getItem("auth_token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ charm_id: 0 }),
      });
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setCharms(data.data);
      } else {
        console.error("Unexpected response format:", data);
        setCharms([]);
      }
    } catch (error) {
      console.error("Error fetching charms:", error);
      setCharms([]); // Set to empty array on error
    }
  };

  useEffect(() => {
    fetchCharms();
  }, []);

  const updatePrice = async () => {
    try {
      const response = await fetch(
        // "http://localhost:4000/User/updateSingeCouple",
        `${process.env.REACT_APP_API_BASE_URL}/User/updateSingeCouple`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
          },
          body: JSON.stringify({
            product_type: "COUPLE",
            product_id: productId,
            order_id: 0,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update price");
      }

      const data = await response.json();
      setNewPrice(data);
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  const priceString = isCouple
    ? (newPrice && `RS. ${newPrice.total_Price}`) || "Rs. 0"
    : (product && `RS. ${product.product_discount_price}`) || "Rs. 0";

  const price = priceString.match(/\d+/)[0]; // Extract the numeric part

  return (
    <div className="AddToCard">
      <div className="images_seacation">
        <div className="Images_div">
          {currentMedia.type === "video" ? (
            <video
              autoPlay
              controls
              width="80%"
              height="215px"
              className="Video_show"
            >
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
              src={videoTha} // Replace with your video thumbnail image
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
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            gap: "13px",
          }}
        >
          <b>Public review</b>
          <StarRatingShow rating={product ? product.average_rating : 0} />
        </div>
        <div className="personalize_Text">
          <h2>{`Rs.${price}`}</h2>
          <div className="Personalize_Text">
            {product && product.product_price ? (
              <>
                <h4>
                  <strike>
                    {isCouple
                      ? (newPrice && `RS. ${newPrice.New_Price}`) || "Rs. 0"
                      : (product && `RS. ${product.product_price}`) || "Rs. 0"}
                  </strike>
                </h4>
                <h4 className="personalize_SubText">
                  SAVE
                  {isCouple
                    ? (newPrice && ` RS. ${newPrice.save_Price}`) || "Rs. 0"
                    : (product && ` RS. ${product.product_discount}`) ||
                    "Rs. 0"}
                </h4>
              </>
            ) : (
              <>
                <h3>
                  <strike>Rs. 0</strike>
                </h3>
                <h3 className="personalize_SubText">SAVE RS. 0</h3>
              </>
            )}
          </div>
        </div>
        <div className="Single_double">
          <button
            style={{ cursor: "pointer" }}
            className="button-4"
            onClick={handleSingleClick}
          >
            Single
          </button>
          <button
            style={{ cursor: "pointer" }}
            className="button-4"
            onClick={handleCoupleClick}
          >
            Couple
          </button>
        </div>
        <div className="personalize_Cover">
          <p className="personalize_Cover_Box">Cover - 1</p>
          {isCouple && <p className="personalize_Cover_Box">Cover - 2</p>}
        </div>
        <div className="personalize_Cover_Row">
          <p> Product Name :</p>
          <input
            type="text"
            name="product_one_name"
            className="personalize_Cover_Row1_name"
            placeholder="Enter Name"
            onChange={handleInputChange}
          />
          {isCouple && (
            <input
              type="text"
              name="product_two_name"
              id="product_two_name"
              className="personalize_Cover_Row1_name"
              placeholder="Enter Name"
              onChange={handleInputChange}
            />
          )}
        </div>
        <div className="personalize_Cover_Row">
          <p> Product Color :</p>
          <select
            name="product_one_color"
            className="personalize_Cover_Row1_Color"
            onChange={handleInputChange}
          >
            <option value="Choose Diary - Color --">
              Choose Diary - Color --
            </option>
            <option value="Brown Button">Brown Button</option>
            <option value="Grey Button">Grey Button</option>
            <option value="Black Button">Black Button</option>
            <option value="Blue  Button">Blue Button</option>
            <option value="Beige  Button">Beige Button</option>
            <option value="Salmon Pink  Button">Salmon Pink Button</option>
            <option value="Forest Green  Button">Forest Green Button</option>
            <option value="Beige Thread Button">Beige Thread Button</option>
            <option value="Wine Thread">Wine Thread</option>
            <option value="Brown With Beige Thread">
              Brown With Beige Thread
            </option>
            <option value="Grey with Blue Thread">Grey with Blue Thread</option>
            <option value="Grey with Pink Thread">Grey with Pink Thread</option>
            <option value="Black With Brown">Black With Brown</option>
            <option value="Chocolate brown with Beige">
              Chocolate brown with Beige
            </option>
            <option value="Salmon Pink With Pink Thread">
              Salmon Pink With Pink Thread
            </option>
          </select>
          {isCouple && (
            <select
              name="product_two_color"
              id="product_two_color"
              className="personalize_Cover_Row1_Color"
              onChange={handleInputChange}
            >
              <option value="Choose Diary - Color --">
                Choose Diary - Color --
              </option>
              <option value="Brown Button">Brown Button</option>
              <option value="Grey Button">Grey Button</option>
              <option value="Black Button">Black Button</option>
              <option value="Blue  Button">Blue Button</option>
              <option value="Beige  Button">Beige Button</option>
              <option value="Salmon Pink  Button">Salmon Pink Button</option>
              <option value="Forest Green  Button">Forest Green Button</option>
              <option value="Beige Thread Button">Beige Thread Button</option>
              <option value="Wine Thread">Wine Thread</option>
              <option value="Brown With Beige Thread">
                Brown With Beige Thread
              </option>
              <option value="Grey with Blue Thread">
                Grey with Blue Thread
              </option>
              <option value="Grey with Pink Thread">
                Grey with Pink Thread
              </option>
              <option value="Black With Brown Thread">
                Black With Brown Thread
              </option>
              <option value="Chocolate brown with Beige">
                Chocolate brown with Beige
              </option>
              <option value="Salmon Pink With Pink Thread">
                Salmon Pink With Pink Thread
              </option>
            </select>
          )}
        </div>
        <div className="personalize_Cover_Row">
          <p> Product Charm :</p>
          <select
            name="product_one_charm"
            className="personalize_Cover_Row1_Charm"
            onChange={(e) => handleCharmChange(e, "product_one_charm")}
            value={selectedCharm}
          >
            <option value="Choose Diary - Charm --">
              Choose Diary - Charm --
            </option>

            {charms.map((charm) => (
              <option key={charm.charm_id} value={charm.charm_name}>
                {charm.charm_name}
              </option>
            ))}
          </select>
          {isCouple && (
            <select
              name="product_two_charm"
              id="product_two_charm"
              className="personalize_Cover_Row1_Charm"
              onChange={(e) => handleCharmChange(e, "product_two_charm")}
              value={selectedCharm1}
            >
              <option value="Choose Diary - Charm">
                Choose Diary - Charm --
              </option>
              {charms.map((charm) => (
                <option key={charm.charm_id} value={charm.charm_name}>
                  {charm.charm_name}
                </option>
              ))}
            </select>
          )}
        </div>
        <button
          className="personalize_Cover_Button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "ADD TO CART"}
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            gap: "13px",
          }}
        >
          <label htmlFor="">Your Rating</label>
          <StarRating productId={productId} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Card;
