import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Product3 from "./imgas/Product3.png";
import instagram from "./imgas/instagram.png";
import twitter from "./imgas/twitter.png";
import FaceBook from "./imgas/Face book.png";
import videoTha from "./imgas/video-play-512.png";

const UpdataProduct = () => {

  const location = useLocation();
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState(null);
  const [subdata, setSubdata] = useState(null);
  const [mainImage, setMainImage] = useState(Product3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { order_id } = location.state || {};
  const [charms, setCharms] = useState([]);
  const [selectedCharm, setSelectedCharm] = useState("");
  const [selectedCharm1, setSelectedCharm1] = useState("");
  const [currentMedia, setCurrentMedia] = useState({
    type: product?.videolink ? "video" : "image",
    src:
      product?.videolink ||
      (product?.OtherImages && product.OtherImages[0]?.imagelink),
  });

  const handleMediaClick = (type, src) => {
    setCurrentMedia({ type, src });
  };
  const [formData, setFormData] = useState({
    orderTrn_id: order_id,
    product_one_name: "",
    product_two_name: "",
    product_one_charm: "",
    product_two_charm: 0,
    product_one_color: "",
    product_two_color: "",
  });

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

    if (charmIndex === "product_one_charm") {
      setSelectedCharm(value);
    } else if (charmIndex === "product_two_charm") {
      setSelectedCharm1(value);
    }

    setFormData({
      ...formData,
      [charmIndex]: charm_id,
    });
  };

  const handleImageClick = (imageSrc) => {
    setMainImage(imageSrc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    const user_id = parseInt(localStorage.getItem("user_id"));
    const product_id = product?.product_id;
    const SubData = { ...formData };
    const parsedData = {
      order_id,
      user_id,
      product_id,
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
        localStorage.setItem("order_id", order_id);
        toast.success("Update success");
      } else {
        toast.error("Failed success");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed success");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!order_id) {
        setError("Order ID not provided");
        return;
      }
      try {
        // const response = await fetch("http://localhost:4000/User/CartGet", {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/User/CartGet`, {
          method: "POST",
          headers: {
            "Auth-Token": localStorage.getItem("auth_token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order_id }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (
          result.data.productData.OtherImages &&
          typeof result.data.productData.OtherImages === "object"
        ) {
          setProductImages(result.data.productData.OtherImages);
          setProduct(result.data.productData);
          setSubdata(result.data.subData);
          if (
            result.data.productData.OtherImages &&
            result.data.productData.OtherImages.length > 0
          ) {
            setMainImage(result.data.productData.OtherImages[0].imagelink);
          }
          // Update form data with the fetched values
          setFormData({
            orderTrn_id: order_id,
            product_one_name: result.data.subData.product_one_name || "",
            product_two_name: result.data.subData.product_two_name || "",
            product_one_charm: result.data.subData.product_one_charm || "",
            product_two_charm: result.data.subData.product_two_charm || "",
            product_one_color: result.data.subData.product_one_color || "",
            product_two_color: result.data.subData.product_two_color || "",
          });
          setSelectedCharm(result.data.subData.product_one_charm || "");
          setSelectedCharm1(result.data.subData.product_two_charm || "");
        } else {
          setError("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch products");
      }
    };

    fetchProducts();
  }, [order_id]);

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
      setCharms([]);
    }
  };

  useEffect(() => {
    fetchCharms();
  }, []);

  return (
    <>
      <div className="AddToCard">
        <div className="images_seacation">
          <div className="Images_div">
            {currentMedia.type === "video" ? (
              <video autoPlay width="80%" height="215px" className="Video_show">
                <source src={currentMedia.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={currentMedia.src}
                alt="Main Product"
                id="Images"
                className="Product3"
                type
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
          <h1>
            {product ? product.product_name : "PERSONALIZE PASSPORT COVER"}
          </h1>
          <p>{product ? product.product_description : ""}</p>
          <div className="personalize_Text">
            <h3>
              {product ? `Rs. ${product.product_discount_price}` : "Rs. 0 "}
            </h3>
            <div className="Personalize_Text">
              {product && product.product_price ? (
                <>
                  <h3>
                    <strike>Rs.{product.product_price}</strike>
                  </h3>
                  <h3 className="personalize_SubText">
                    SAVE RS.
                    {product.product_discount}
                  </h3>
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
          <div className="personalize_Cover">
            <p className="personalize_Cover_Box">Cover - 1</p>
            <p className="personalize_Cover_Box">Cover - 2</p>
          </div>
          <div className="personalize_Cover_Row">
            <p>Change Name</p>
            <input
              type="text"
              name="product_one_name"
              className="personalize_Cover_Row1_name"
              placeholder="Enter Name"
              value={formData.product_one_name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="product_two_name"
              className="personalize_Cover_Row1_name"
              placeholder="Enter Name"
              value={formData.product_two_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="personalize_Cover_Row">
            <p>Change Color</p>
            <select
              name="product_one_color"
              className="personalize_Cover_Row1_Color"
              value={formData.product_one_color}
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
              <option value="Black With Brown">Black With Brown</option>
              <option value="Chocolate brown with Beige">
                Chocolate brown with Beige
              </option>
              <option value="Salmon Pink With Pink Thread">
                Salmon Pink With Pink Thread
              </option>
            </select>
            <select
              name="product_two_color"
              className="personalize_Cover_Row1_Color"
              value={formData.product_two_color}
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
          </div>
          <div className="personalize_Cover_Row">
            <p>Change Charm</p>
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
            <select
              name="product_two_charm"
              className="personalize_Cover_Row1_Charm"
              onChange={(e) => handleCharmChange(e, "product_two_charm")}
              value={selectedCharm1}
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
          </div>
          <button
            className="personalize_Cover_Button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Update"}
          </button>
          <div className="Share">
            Share
            <img src={twitter} alt="twitter" className="twitter" />
            <img src={FaceBook} alt="facebook" className="facebook" />
            <img src={instagram} alt="instagram" className="instagram" />
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default UpdataProduct;
