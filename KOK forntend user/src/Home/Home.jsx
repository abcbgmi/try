import React from "react";
import Banner from "./Banner/Banner";
import Category from "./Category/Category";
import Seller from "./Seller/Seller";
import TopPicks from "./Top Picks/TopPicks";
import Review from "./Review/Review";
import GiftCardButton from "./GiftCard/GiftCardButton";
import BannerImages from "./BannerImages/BannerImages";
import Subscribe from "../Subscribe/Subscribe";

const Home = () => {
  return (
    <>
      <Banner />
      <BannerImages />
      <Category />
      <Seller />
      <Subscribe />
      <TopPicks />
      <Review />
      <GiftCardButton />
    </>
  );
};

export default Home;
