// import "./App.css";
// import { Route, Routes, useLocation } from "react-router-dom";
// import Navbar from "./Header/Navbar";
// import Footer from "./Footer/Footer";
// import Home from "./Home/Home";
// import ContactUs from "./Contact Us/ContactUs";
// import Cart from "./Cart/Cart";
// import Account from "./Account/Account";
// import Login from "./Login/LoginForm";
// import ForgotPassword from "./Forget_Password/ForgotPassword";
// import Registration from "./Registration/RegistrationForm";
// import Rpassword from "./Reset_Password/Rpassword";
// import Profile from "./ProfileFrom/Profile";
// import ChangePassword from "./changePassword/changePassword";
// import AddToCart from "./AddToItems/AddtoItems";
// import AddCouponCode from "./AddCouponCode/AddCouponCode";
// import UpdataProduct from "./UpdataProduct/UpdataProduct";
// import ScrollToTop from "./ScrollToTop/ScrollToTop";
// import TermsConditions from "./Customer service/TermsConditions";
// import PrivacyTerms from "./Customer service/PrivacyTerms";
// import RefundsExchanges from "./Customer service/RefundsExchanges";
// import BagAddToCart from "./BagAddtoCart/BagAddToCart";
// import Payment from "./Payment/Payment";
// import CheckoutOrders from "./checkoutOrders";
// import GiftCard2 from "./Home/GiftCards/GiftCards2";
// import CategoryPage from "./CategoryPage/CategoryPage";
// import OrderSuccess from "./checkoutOrders/orderSuccess";
// import MyOrderes from "./MyOrderes/MyOrderes";

// const App = () => {
//   const location = useLocation();
//   const noNavFooterPaths = [
//     "/login",
//     "/registration",
//     "/forgotPassword",
//     "/Rpassword",
//   ];

//   return (
//     <>
//       {!noNavFooterPaths.includes(location.pathname) && <Navbar />}
//       <ScrollToTop />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgotPassword" element={<ForgotPassword />} />
//         <Route path="/registration" element={<Registration />} />
//         <Route path="/changePassword" element={<ChangePassword />} />
//         <Route path="/rpassword" element={<Rpassword />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/contactUs" element={<ContactUs />} />
//         <Route path="/addtocart" element={<AddToCart />} />
//         <Route path="/addCouponCode" element={<AddCouponCode />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/updateProduct" element={<UpdataProduct />} />
//         <Route path="/account" element={<Account />} />
//         <Route path="/termsConditions" element={<TermsConditions />} />
//         <Route path="/privacyTerms" element={<PrivacyTerms />} />
//         <Route path="/refundsExchanges" element={<RefundsExchanges />} />
//         <Route path="/bagAddToCart" element={<BagAddToCart />} />
//         <Route path="/payment" element={<Payment />} />
//         <Route path="/checkoutOrders" element={<CheckoutOrders />} />
//         <Route path="/giftcard2" element={<GiftCard2 />} />
//         <Route path="/category/:categoryId" element={<CategoryPage />} />
//         <Route path="/orderSuccess" element={<OrderSuccess />} />
//         <Route path="/myOrderes" element={<MyOrderes />} />
//       </Routes>
//       {!noNavFooterPaths.includes(location.pathname) && <Footer />}
//     </>
//   );
// };

// export default App;





import React from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Header/Navbar';
import Footer from './Footer/Footer';
import Home from './Home/Home';
import ContactUs from './Contact Us/ContactUs';
import Cart from './Cart/Cart';
import Account from './Account/Account';
import Login from './Login/LoginForm';
import ForgotPassword from './Forget_Password/ForgotPassword';
import Registration from './Registration/RegistrationForm';
import Rpassword from './Reset_Password/Rpassword';
import Profile from './ProfileFrom/Profile';
import ChangePassword from './changePassword/changePassword';
import AddToCart from './AddToItems/AddtoItems';
import AddCouponCode from './AddCouponCode/AddCouponCode';
import UpdataProduct from './UpdataProduct/UpdataProduct';
import ScrollToTop from './ScrollToTop/ScrollToTop';
import TermsConditions from './Customer service/TermsConditions';
import PrivacyTerms from './Customer service/PrivacyTerms';
import RefundsExchanges from './Customer service/RefundsExchanges';
import BagAddToCart from './BagAddtoCart/BagAddToCart';
import Payment from './Payment/Payment';
import CheckoutOrders from './checkoutOrders';
import GiftCard2 from './Home/GiftCards/GiftCards2';
import CategoryPage from './CategoryPage/CategoryPage';
import OrderSuccess from './checkoutOrders/orderSuccess';
import MyOrderes from './MyOrderes/MyOrderes';

const App = () => {
  const location = useLocation();
  const noNavFooterPaths = [
    '/login',
    '/registration',
    '/forgotPassword',
    '/rpassword',
  ];

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    // Replace with your actual authentication logic
    const authToken = localStorage.getItem('authToken');
    return authToken === 'your_expected_token'; // Replace 'your_expected_token' with your actual token check
  };

  // ProtectedRoute component to handle authentication
  const ProtectedRouteWithAuth = ({ element, ...rest }) => {
    return isAuthenticated() ? (
      <>
      <Route {...rest} element={element} />
      <Navigate to="/addtocart"  />
      
</>
    ) : (
      <>
      // <Navigate to="/login" replace />
      </>
    );
  };

  return (
    <>
      {!noNavFooterPaths.includes(location.pathname) && <Navbar />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/rpassword" element={<Rpassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/addtocart"  element={<AddToCart />} />
        <Route path="/addCouponCode" element={<ProtectedRouteWithAuth element={<AddCouponCode />} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/updateProduct" element={<UpdataProduct />} />
        <Route path="/account" element={<Account />} />
        <Route path="/termsConditions" element={<TermsConditions />} />
        <Route path="/privacyTerms" element={<PrivacyTerms />} />
        <Route path="/refundsExchanges" element={<RefundsExchanges />} />
        <Route path="/bagAddToCart" element={<BagAddToCart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/checkoutOrders" element={<CheckoutOrders />} />
        <Route path="/giftcard2" element={<GiftCard2 />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/orderSuccess" element={<OrderSuccess />} />
        <Route path="/myOrderes" element={<MyOrderes />} />
        {/* Handle unknown routes */}
       
      </Routes>
      {!noNavFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
};

export default App;
