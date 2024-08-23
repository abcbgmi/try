const db = require("../configs/db.js");
const user = db.user;
const product = db.product;
const productImage = db.productImages;
const charm = db.charm;
const order = db.order;
const orderTrn = db.orderTrn;
const giftCard = db.giftCard;
const payment = db.payment;
const commonValidation = require("../validation/common_validation.js");
const uploadImages = require("../utils/file_upload_function.js");
const CONFIG = require("../configs/config.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const val = require("../validation/orderMast_validation.js");
const sequelize = db.sequelize;
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");

////handle orders payment 
//// add in paymnet

const placeOrder = async (req, res) => {
  const userdata = req.body;             
  console.log(userdata)
// return 

  try {
    const createdPayments = await payment.create({
      user_id : userdata.user_id,
      order_ids : userdata.order_ids,
      payment_type : userdata.payment_type,
      payment_in : userdata.payment_in,
      payment_date : Date.now(),
      payment_account : "ORDER",
      payment_out : 0,
      payment_total : 15000,
      payment_status : "PENDING",
      created_date: Date.now(),
      updated_date: Date.now(),
    });

    // console.log(createdPayments);
    // return
    if (createdPayments) {
      return res.status(200).json({ status: 1, msg: "Order added successfully" });
    } else {
      return res.status(500).json({ status: 0, msg: "Failed to add payments" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 0, msg: "Internal Server Error!" });
  }
};















module.exports = {
  placeOrder,
};
