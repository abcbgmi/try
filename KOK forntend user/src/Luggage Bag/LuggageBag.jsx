import React from "react";
import Bag from "./Bag/Bag";
import Product from "./Product/AllBag";
import Personalised from "./Personalised/Personalised";

const LuggageBag = () => {
  return (
    <>
      <Bag />
      <Product />
      <Personalised />
    </>
  );
}

export default LuggageBag;
