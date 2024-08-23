const db = require("../configs/db.js");
const user = db.user;
const product = db.product;
const productImage = db.productImages;
const charm = db.charm;
const order = db.order;
const orderTrn = db.orderTrn;
const couponCard = db.couponCard;
const mycart = db.mycart;
const user_adress = db.user_adress;
const orderstatus = db.orderStatus;
const Razorpay = require('razorpay');
const commonValidation = require("../validation/common_validation.js");
const uploadImages = require("../utils/file_upload_function.js");
const CONFIG = require("../configs/config.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const val = require("../validation/orderMast_validation.js");
const sequelize = db.sequelize;
const { QueryTypes} = require("sequelize");
const { Op } = require("sequelize");

//// handle orders

//// add in cart
const addToCart = async (req, res) => {
  const userData = req.body;
  // // console.log(JSON.parse(userData));
  // console.log(userData);

  // return
  try {
    // const { value, error } = val.addToCart.validate(
    //   JSON.parse(userData.JsonData)
    // );
    // const valid = error == null;
    // if (!valid) {v
    //   const { details } = error;
    //   const message = details
    //     .map((i) => i.message)
    //     .join(",")
    //     .replace(/"/g, "");
    //   console.log("error", message);
    //   return res.status(422).json({ status: 0, msg: message });
    // }

    const mycart_id = userData.mycart_id;
    // console.log(userData);
    if (mycart_id != 0) {
      // const updatedOrder = await mycart.update(
      //   {
      //     order_total: value.order_total,
      //     updated_date: Date.now(),
      //   },
      //   {
      //     where: { order_id: order_id },
      //   }
      // );
      const updatedProduct = await mycart.update(
        {
          product_id: userData.product_id,
          // user_id: value.SubData.product_one_name,
          product_modify_object: userData.product_modify_object,
          // in_cart: value.SubData.product_one_charm,
          updated_date: Date.now(),
        },
        {
          where: { mycart_id: userData.mycart_id, user_id: userData.user_id },
        }
      );

      if (updatedProduct === 0) {
        return res.status(404).json({ message: "Product Not Found!" });
      } else {
        return res
          .status(200)
          .send({ status: 1, msg: "Product Updated Successfully." });
      }
    } else {
      const newOrder = await mycart.create({
        product_id: userData.product_id,
        user_id: userData.user_id,
        user_token: userData.user_detail.user_token,
        product_modify_object: userData.product_modify_object,
        in_cart: 1,
        created_date: Date.now(),
        updated_date: Date.now(),
      });
      if (newOrder) {
        return res
          .status(200)
          .json({ status: 1, message: "Product has been Added to Your Cart." });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 0, msg: "Internal Server Error!" });
  }
};

//// get all cart
const CartGet = async (req, res) => {
  const userData = req.body;
  const mycart_id = userData.mycart_id;
  // let SubTotalAmt = 0;
  // let TotalAmt = 0;
  // let TotalGst = 0;
  // let TotalTax = 0;
  // let Shipping = 0;
  // let Discount = 0;

  // function roundToTwo(num) {
  //   return Math.round(num * 100) / 100;
  // }

  try {
    if (mycart_id != 0) {
      const CartData = await sequelize.query(
        `SELECT mc.mycart_id,   
                mc.product_id,
                mc.user_id,
                mc.user_token,
                mc.in_cart
          FROM mycarts AS mc
          WHERE mc.mycart_id = :mycart_id AND mc.in_cart = :in_cart`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            mycart_id: mycart_id,
            in_cart: 1,
          },
        }
      );

      const Cartdata = CartData[0];
      // console.log(CartData);
      // return
      if (Cartdata) {
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "Product Not Found in Cart!" });
      }

      // //// get ordertrn data for charms
      // const OrderTrndata = await orderTrn.findOne({
      //   where: { order_id: Orderdata.order_id },
      //   attributes: {
      //     exclude: ["is_active", "is_deleted", "created_date", "updated_date"],
      //   },
      // });

      // //// get all charms using sql query
      // const getcharms = await sequelize.query(
      //   `SELECT r.product_one_charm, ch1.charm_name AS product_one_charm_name,
      //           r.product_two_charm, ch2.charm_name AS product_two_charm_name
      //    FROM ordertrns AS r
      //    LEFT JOIN charms AS ch1 ON r.product_one_charm = ch1.charm_id
      //    LEFT JOIN charms AS ch2 ON r.product_two_charm = ch2.charm_id
      //    WHERE r.orderTrn_id = :orderTrn_id`,
      //   {
      //     type: QueryTypes.SELECT,
      //     replacements: { orderTrn_id: OrderTrndata.orderTrn_id },
      //   }
      // );

      ////// add charm data in ordertrn object
      // OrderTrndata.dataValues.charmData = getcharms[0];

      //// get product data using order data
      const Productdata = await product.findOne({
        where: { product_id: Cartdata.product_id },
        attributes: {
          exclude: ["is_active", "is_deleted", "created_date", "updated_date"],
        },
      });

      /////// add amount count and totals
      //////***************** start ******************************/
      // const getCoupon = await giftCard.findOne({
      //   where: {
      //     discount_code: Orderdata.order_coupon_code,
      //   },
      // });

      // if (getCoupon) {
      //   if (getCoupon.dataValues.discount_Amt) {
      //     SubTotalAmt +=
      //       Orderdata.order_total - getCoupon.dataValues.discount_Amt;
      //     TotalAmt += Orderdata.order_total - getCoupon.dataValues.discount_Amt;
      //     Discount += getCoupon.dataValues.discount_Amt;
      //   } else {
      //     if (getCoupon.dataValues.discount_per) {
      //       SubTotalAmt +=
      //         Orderdata.order_total -
      //         (Orderdata.order_total * getCoupon.dataValues.discount_per) / 100;
      //       TotalAmt +=
      //         Orderdata.order_total -
      //         (Orderdata.order_total * getCoupon.dataValues.discount_per) / 100;
      //       Discount +=
      //         (Orderdata.order_total * getCoupon.dataValues.discount_per) / 100;
      //     }
      //   }
      // } else {
      //   SubTotalAmt += Orderdata.order_total;
      //   TotalAmt += Orderdata.order_total;
      // }

      // if (Productdata.dataValues.GST != 0) {
      //   TotalGst += (Orderdata.order_total * Productdata.dataValues.GST) / 100;
      //   if (TotalGst) {
      //     TotalAmt +=
      //       (Orderdata.order_total * Productdata.dataValues.GST) / 100;
      //   }
      // } else {
      //   TotalTax += Productdata.dataValues.Product_tax;
      //   if (TotalTax) {
      //     TotalAmt += Productdata.dataValues.Product_tax;
      //   }
      // }
      // if (Productdata.dataValues.shipping_charge) {
      //   Shipping += Productdata.dataValues.shipping_charge;
      //   if (Shipping) {
      //     TotalAmt += Productdata.dataValues.shipping_charge;
      //   }
      // }
      //////***************** end ******************************/

      //// get product video link for product data
      if (Productdata.dataValues.product_video) {
        let videolink = `${req.protocol}://${req.get(
          "host"
        )}/src/images/productVideo/${Productdata.dataValues.product_video}`;
        Productdata.dataValues.videolink = Productdata.dataValues.product_video
          ? videolink
          : "";
      }else{
        Productdata.dataValues.videolink = "";
      }

      //// get product all image with link
      const ProductImagedata = await productImage.findAll({
        where: { product_id: Productdata.product_id },
        attributes: ["productImage_id", "product_id", "image"],
      });

      if (ProductImagedata) {
        for (let i = 0; i < ProductImagedata.length; i++) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${ProductImagedata[i].dataValues.image}`;
          ProductImagedata[i].dataValues.imagelink = ProductImagedata[i]
            .dataValues.image
            ? imagelink
            : "";
        }
      }

      //// get user data using orderdata
      const Userdata = await user.findOne({
        where: { user_id: Cartdata.user_id, user_token: Cartdata.user_token },
        attributes: [
          "user_first_name",
          "user_last_name",
          "user_email",
          "user_mobile_no",
          "user_address",
          "user_pincode",
          "user_country",
          "user_state",
        ],
      });

      //// add ordertrn data in Cartdata object
      // Cartdata.subData = OrderTrndata;
      //// add user data in Cartdata object
      Cartdata.userData = Userdata;
      //// add product data in Cartdata object
      Cartdata.productData = Productdata;
      //// add productimage links data in productdata object
      Productdata.dataValues.OtherImages = ProductImagedata;

      // if (getCoupon) {
      //   if (getCoupon.dataValues.discount_Amt) {
      //     Orderdata.order_total =
      //       Orderdata.order_total - getCoupon.dataValues.discount_Amt;
      //   } else {
      //     if (getCoupon.dataValues.discount_per) {
      //       Orderdata.order_total =
      //         Orderdata.order_total -
      //         (Orderdata.order_total * getCoupon.dataValues.discount_per) / 100;
      //     }
      //   }
      // }
      //// get cart count
      const { count, rows } = await mycart.findAndCountAll({
        where: {
          in_cart: 1,
          user_token: userData.user_detail.user_token,
          user_id: userData.user_detail.user_id,
        },
      });

      if (Cartdata) {
        // return res
        //   .status(200)
        //   .json({ status: 1, msg: "Done.", data: Orderdata });
        return res.status(200).json({
          status: 1,
          msg: "Done.",
          ProductInCart: count,
          // SubTotalAmt: roundToTwo(SubTotalAmt),
          // TotalGst: roundToTwo(TotalGst),
          // TotalTax: roundToTwo(TotalTax),
          // Shipping: roundToTwo(Shipping),
          // Discount: roundToTwo(Discount),
          // TotalAmt: roundToTwo(TotalAmt),
          data: Cartdata,
        });
      } else {
        return res.status(404).json({ status: 0, msg: "Cart Data Not Found!" });
      }
    } else {
      //// get order data for full order
      // const Orderdata = await order.findAll({
      //   where: {
      //     order_status: {
      //       [Op.ne]: 6,
      //     },
      //     user_token: userData.user_detail.user_token,
      //     user_id: userData.user_detail.user_id,
      //   },
      //   attributes: {
      //     exclude: ["is_active", "is_deleted", "created_date", "updated_date"],
      //   },
      // });

      const mycartdata = await sequelize.query(
        `SELECT mc.mycart_id ,   
                mc.product_id,
                mc.user_id,
                mc.user_token,
                mc.product_modify_object,
                mc.in_cart
          FROM mycarts AS mc
          WHERE mc.user_token = :user_token AND mc.in_cart = :in_cart AND user_id = :user_id`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            user_token: userData.user_detail.user_token,
            in_cart: 1,
            user_id: userData.user_detail.user_id,
          },
        }
      );

      if (!mycartdata) {
        return res
        .status(404)
        .json({ status: 0, msg: "Product Not Found in Cart!" });
      }

      //// get order count
      const { count, rows } = await mycart.findAndCountAll({
        where: {
          in_cart: 1,
          user_token: userData.user_detail.user_token,
          user_id: userData.user_detail.user_id,
        },
      });

      //// get product data using order data
      for (let i = 0; i < mycartdata.length; i++) {
        const Productdata = await product.findOne({
          where: { product_id: mycartdata[i].product_id },
          attributes: {
            exclude: [
              "is_active",
              "is_deleted",
              "created_date",
              "updated_date",
            ],
          },
        });
        // const getCoupon = await giftCard.findOne({
        //   where: {
        //     discount_code: Orderdata[i].order_coupon_code,
        //   },
        // });

        // if (getCoupon) {
        //   if (getCoupon.dataValues.discount_Amt) {
        //     SubTotalAmt +=
        //       Orderdata[i].order_total - getCoupon.dataValues.discount_Amt;
        //     TotalAmt +=
        //       Orderdata[i].order_total - getCoupon.dataValues.discount_Amt;
        //     Discount += getCoupon.dataValues.discount_Amt;
        //   } else {
        //     if (getCoupon.dataValues.discount_per) {
        //       SubTotalAmt +=
        //         Orderdata[i].order_total -
        //         (Orderdata[i].order_total * getCoupon.dataValues.discount_per) /
        //           100;

        //       TotalAmt +=
        //         Orderdata[i].order_total -
        //         (Orderdata[i].order_total * getCoupon.dataValues.discount_per) /
        //           100;
        //       Discount +=
        //         (Orderdata[i].order_total * getCoupon.dataValues.discount_per) /
        //         100;
        //     }
        //   }
        // } else {
        //   SubTotalAmt += Orderdata[i].order_total;
        //   TotalAmt += Orderdata[i].order_total;
        // }

        // if (Productdata.dataValues.GST != 0) {
        //   TotalGst +=
        //     (Orderdata[i].order_total * Productdata.dataValues.GST) / 100;
        //   if (TotalGst) {
        //     TotalAmt +=
        //       (Orderdata[i].order_total * Productdata.dataValues.GST) / 100;
        //   }
        // } else {
        //   TotalTax += Productdata.dataValues.Product_tax;
        //   if (TotalTax) {
        //     TotalAmt += Productdata.dataValues.Product_tax;
        //   }
        // }
        // if (Productdata.dataValues.shipping_charge) {
        //   Shipping += Productdata.dataValues.shipping_charge;
        //   if (Shipping) {
        //     TotalAmt += Productdata.dataValues.shipping_charge;
        //   }
        // }
      
        if(Productdata.dataValues.product_video){
          let videolink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productVideo/${Productdata.dataValues.product_video}`;
          Productdata.dataValues.videolink = Productdata.dataValues.product_video
            ? videolink
            : "";
          }else{
            Productdata.dataValues.videolink = "";
          }
          const data1 = await productImage.findOne({
            where: { product_id: Productdata.dataValues.product_id },
            attributes: ["image"],
          });
          if (data1) {
            let imagelink = `${req.protocol}://${req.get(
              "host"
            )}/src/images/productImage/${data1.dataValues.image}`;
            Productdata.dataValues.imagelink = data1.dataValues.image
              ? imagelink
              : "";
          }else{
            Productdata.dataValues.imagelink = "";
          }
          // ProductData.push(Productdata);
          mycartdata[i].ProductData = Productdata;

        //   if (getCoupon) {
        //     if (getCoupon.dataValues.discount_Amt) {
        //       Orderdata[i] = Orderdata[i] - getCoupon.dataValues.discount_Amt;
        //     } else {
        //       if (getCoupon.dataValues.discount_per) {
        //         Orderdata[i] =
        //           Orderdata[i] -
        //           (Orderdata[i] * getCoupon.dataValues.discount_per) / 100;
        //       }
        //     }
        //   }
      }

      if (mycartdata.length != 0) {
        return res.status(200).json({
          status: 1,
          msg: "Done.",
          ProductInCart: count,
          // SubTotalAmt: roundToTwo(SubTotalAmt),
          // TotalGst: roundToTwo(TotalGst),
          // TotalTax: roundToTwo(TotalTax),
          // Shipping: roundToTwo(Shipping),
          // Discount: roundToTwo(Discount),
          // TotalAmt: roundToTwo(TotalAmt),
          data: mycartdata,
        });
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "Product Not Found in Cart!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};


   
const getCartCount = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 0 ||
      userData.user_detail.is_admin === false
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const orderCountQuery = `
                          SELECT COUNT(*) AS Product_count_cart
                          FROM mycarts
                          WHERE user_id = :user_id AND user_token = :user_token AND in_cart = 1;
                          `;

    const [orderCounts] = await sequelize.query(orderCountQuery, {
      replacements: {
        user_id: userData.user_detail.user_id,
        user_token: userData.user_detail.user_token,
      },
    });

  if (orderCounts) {          
    return res.status(200).json({ status: 1, msg: "Done." , data : orderCounts[0]  });
  }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

//// get user all address
const addAddress = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.user_id &&
      userData.user_detail.is_admin === false
    ) {
    } else {
      return res.status(200).json({ status: 0, msg: "User Not Found!" });
    }

    const addUserAddress = await user_adress.create({
      user_id: userData.user_detail.user_id,
      user_token: userData.user_detail.user_token,
      user_first_name: userData.user_first_name,
      user_last_name: userData.user_last_name,
      user_mobile_no: userData.user_mobile_no,
      user_address: userData.user_address,
      user_pincode: userData.user_pincode,
      user_country: userData.user_country,
      user_state: userData.user_state,
      created_date: Date.now(),
      updated_date: Date.now(),
    });


    if (addUserAddress) {
      return res.status(200).send({
        status: 1,
        msg: "New Address add Successfull.",
        data: addUserAddress,
      });
    } else {
      return res.status(200).json({ status: 0, msg: "New Address add Fail!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const userAddressFill = async (req, res) => {
  const userData = req.body.user_detail;

  try {
    if (userData.user_id && userData.is_admin === false) {
    } else {
      return res.status(200).json({ status: 0, msg: "User Not Found!" });
    }
    const userdata = await user.findOne({
      where: {
        user_id: userData.user_id,
      },
      attributes: [
        "user_id",
        "user_first_name",
        "user_last_name",
        "user_mobile_no",
        "user_address",
        "user_state",
        "user_pincode",
        "user_country",
      ],
    });
    if (userdata) {
      // let imagelink = `${req.protocol}://${req.get(
      //   "host"
      // )}/src/images/profileimage/${userdata.dataValues.user_profile_photo}`;
      // userdata.dataValues.imagelink = userdata.dataValues.user_profile_photo
      //   ? imagelink
      //   : "";

      // if (userdata.dataValues.length != "") {
      //   return res
      //     .status(200)
      //     .json({ status: 1, msg: "Done.", data: userdata });
      // } else {
      //   return res.status(200).json({ status: 0, msg: "Data Not Found!" });
      // }
      const AddressData = await user_adress.findAll({
        where: {
          user_id: userData.user_id,
        },
        attributes: [
          "user_adress_id",
          "user_id",
          "user_first_name",
          "user_last_name",
          "user_mobile_no",
          "user_address",
          "user_state",
          "user_pincode",
          "user_country",
        ],
      });

      if (userdata || AddressData) {
        return res.status(200).json({
          status: 1,
          msg: "Done.",
          myAddress: userdata,
          AnotherAddress: AddressData,
        });
      } else {
        return res.status(200).json({ status: 0, msg: "Data Not Found!" });
      }
    } else {
      return res.status(200).json({ status: 0, msg: "User Not Found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ status: 0, msg: err.toString() });
  }
};

const userAddressRemove = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.user_id &&
      userData.user_detail.is_admin === false
    ) { 
    } else {
      return res.status(200).json({ status: 0, msg: "User Not Found!" });
    }
    const addressToDelete = await user_adress.findByPk(userData.user_adress_id);

    if (!addressToDelete) {
      return res.status(200).json({ status: 0, msg: "Address Not Found!" });
    }
    await addressToDelete.destroy();

    return res
      .status(200)
      .json({ status: 1, msg: "Address Deleted Successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ status: 0, msg: err.toString() });
  }
};

////// update in progress
const addToOrder = async (req, res) => {
  const userData = req.body;
  let t;
  // console.log(userData);
  // return
  try {
    // const data = JSON.parse(userData.JsonData)
    // console.log(data);
    // console.log(userData.JsonData);
    // return

    // console.log(data);
    const { value, error } = val.addToOrder.validate(userData);
    const valid = error == null;
    if (!valid) {
      const { details } = error;
      const message = details
        .map((i) => i.message)
        .join(",")
        .replace(/"/g, "");
      console.log("error", message);
      return res.status(422).json({ status: 0, msg: message });
    }

    const order_id = value.order_id;
    const orderTrn_id = value.SubData.orderTrn_id;
    // console.log(value);
    // return
    if (order_id != 0) {
      try {
        t = await sequelize.transaction();

        const newOrder = await order.update(
          {
            user_id: value.user_id,
            user_token: userData.user_detail.user_token,
            user_first_name: value.user_first_name,
            user_last_name: value.user_last_name,
            user_mobile_no: value.user_mobile_no,
            user_pincode: value.user_pincode,
            user_country: value.user_country,
            user_state: value.user_state,
            order_status: 1,
            order_total: value.order_total,
            user_address: value.user_address,
            payment_type: value.payment_type,
            proceed_to_payment: value.proceed_to_payment,
            updated_date: Date.now(),
          },
          { where: { order_id: order_id }, transaction: t }
        );

        if (order_id) {
          const ordertrnToDelete = await orderTrn.findAll({
            where: { order_id },
          });

          // Check if there are any records to delete
          if (ordertrnToDelete.length > 0) {
            for (const orderTrnRecord of ordertrnToDelete) {
              await orderTrnRecord.destroy();
            }
          }
        }

        const newOrderTrn = await orderTrn.create(
          {
            order_id: order_id,
            product_id: value.SubData.product_id,
            mycart_id: value.SubData.mycart_id,
            product_modify_object: value.SubData.product_modify_object,
            product_quantity: value.SubData.product_quantity,
            product_price: value.SubData.product_price,
            Product_GST: value.SubData.Product_GST,
            Product_tax: value.SubData.Product_tax,
            order_coupon_code: value.SubData.order_coupon_code,
            created_date: Date.now(),
            updated_date: Date.now(),
          },
          { transaction: t }
        );

        await t.commit();

        return res.status(200).json({
          status: 1,
          message: "Product has been updated successfully.",
        });
      } catch (error) {
        if (t) await t.rollback();
        console.error("Transaction error:", error);
        return res
          .status(500)
          .json({ status: 0, message: "Something went wrong!" });
      }
    } else {
      try {
        t = await sequelize.transaction();
        //  console.log(userData);
        //  return
        const newOrder = await order.create(
          {
            user_id: value.user_id,
            user_token: userData.user_detail.user_token,
            user_first_name: value.user_first_name,
            user_last_name: value.user_last_name,
            user_mobile_no: value.user_mobile_no,
            user_pincode: value.user_pincode,
            user_country: value.user_country,
            user_state: value.user_state,
            order_status: 1,
            order_total: value.order_total,
            user_address: value.user_address,
            payment_type: value.payment_type,
            proceed_to_payment: 0,
            created_date: Date.now(),
            updated_date: Date.now(),
          },
          { transaction: t }
        );
        // console.log(value.SubData);
        // return
        for (let i = 0; i < value.SubData.length; i++) {
          const newOrderTrn = await orderTrn.create(
            {
              order_id: newOrder.order_id,
              product_id: value.SubData[i].product_id,
              mycart_id: value.SubData[i].mycart_id,
              product_modify_object: value.SubData[i].product_modify_object,
              product_quantity: value.SubData[i].product_quantity,
              product_price: value.SubData[i].product_price,
              Product_GST: value.SubData[i].Product_GST,
              Product_tax: value.SubData[i].Product_tax,
              order_coupon_code: 0,
              created_date: Date.now(),
              updated_date: Date.now(),
            },
            { transaction: t }
          );
        }
        await t.commit();

        return res.status(200).json({
          status: 1,
          message: "Product has been Added to Your Order.",
          order_id: newOrder.order_id,
        });
      } catch (error) {
        if (t) await t.rollback();
        console.error("Transaction error:", error);
        return res
          .status(500)
          .json({ status: 0, message: "Something went wrong!" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 0, msg: "Internal Server Error!" });
  }
};

//// get all order
const OrderGet = async (req, res) => {
  const userData = req.body;
  const order_id = userData.order_id;
  // let SubTotalAmt = 0;
  // let TotalAmt = 0;
  // let TotalGst = 0;
  // let TotalTax = 0;
  // let Shipping = 0;
  // let Discount = 0;

  // function roundToTwo(num) {
  //   return Math.round(num * 100) / 100;
  // }

  try {
    if (order_id != 0) {
      const OrderData = await sequelize.query(
        `SELECT ord.order_id,   
                ord.user_id,
                ord.user_token,
                ord.order_total,
                ord.user_address
          FROM orders AS ord
          WHERE ord.order_id = :order_id AND ord.payment_type = :payment_type`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            order_id: order_id,
            payment_type: "",
          },
        }
      );

      const Orderdata = OrderData[0];

      if (Orderdata) {
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "Product Not Found in Order!" });
      }

      //// get ordertrn data
      const OrderTrndata = await orderTrn.findAll({
        where: { order_id: Orderdata.order_id },
        attributes: {
          exclude: ["is_active", "is_deleted", "created_date", "updated_date"],
        },
      });

      // console.log(OrderTrndata);
      // return
      for (let i = 0; i < OrderTrndata.length; i++) {
        const Productdata = await product.findOne({
          where: { product_id: OrderTrndata[i].product_id },
          attributes: {
            exclude: [
              "product_price",
              "GST",
              "Product_tax",
              "product_discount",
              "product_discount_price",
              "product_modify_object",
              "product_view",
              "is_active",
              "is_deleted",
              "created_date",
              "updated_date",
            ],
          },
        });

        if (Productdata.product_video) {
          let videolink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productVideo/${Productdata.product_video}`;
          Productdata.dataValues.videolink = Productdata.dataValues.product_video
            ? videolink
            : "";
        }else{
          Productdata.dataValues.videolink =  "";
        }
        const data1 = await productImage.findOne({
          where: { product_id: Productdata.dataValues.product_id },
          attributes: ["image"],
        });

        if (data1) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${data1.dataValues.image}`;
          Productdata.dataValues.imagelink = data1.dataValues.image
            ? imagelink
            : "";
        } else {
          Productdata.dataValues.imagelink = "";
        }

        if (!OrderTrndata[i].dataValues.productdata) {
          OrderTrndata[i].dataValues.productdata = [];
        }
        OrderTrndata[i].dataValues.productdata.push(Productdata);
      }

      // //// get all charms using sql query
      // const getcharms = await sequelize.query(
      //   `SELECT r.product_one_charm, ch1.charm_name AS product_one_charm_name,
      //           r.product_two_charm, ch2.charm_name AS product_two_charm_name
      //    FROM ordertrns AS r
      //    LEFT JOIN charms AS ch1 ON r.product_one_charm = ch1.charm_id
      //    LEFT JOIN charms AS ch2 ON r.product_two_charm = ch2.charm_id
      //    WHERE r.orderTrn_id = :orderTrn_id`,
      //   {
      //     type: QueryTypes.SELECT,
      //     replacements: { orderTrn_id: OrderTrndata.orderTrn_id },
      //   }
      // );

      // //// add charm data in ordertrn object
      // OrderTrndata.dataValues.charmData = getcharms[0];

      //// get product data using order data
      // const Productdata = await product.findOne({
      //   where: { product_id: OrderTrndata.product_id },
      //   attributes: {
      //     exclude: [
      //       "product_price",
      //       "GST",
      //       "Product_tax",
      //       "product_discount",
      //       "product_discount_price",
      //       "product_modify_object",
      //       "product_view",
      //       "is_active",
      //       "is_deleted",
      //       "created_date",
      //       "updated_date",
      //     ],
      //   },
      // });

      // /////// add amount count and totals
      // //////***************** start ******************************/
      // const getCoupon = await giftCard.findOne({
      //   where: {
      //     discount_code: Orderdata.order_coupon_code,
      //   },
      // });

      // if (getCoupon) {
      //   if (getCoupon.dataValues.discount_Amt) {
      //     SubTotalAmt +=
      //       Orderdata.order_total - getCoupon.dataValues.discount_Amt;
      //     TotalAmt += Orderdata.order_total - getCoupon.dataValues.discount_Amt;
      //     Discount += getCoupon.dataValues.discount_Amt;
      //   } else {
      //     if (getCoupon.dataValues.discount_per) {
      //       SubTotalAmt +=
      //         Orderdata.order_total -
      //         (Orderdata.order_total * getCoupon.dataValues.discount_per) / 100;
      //       TotalAmt +=
      //         Orderdata.order_total -
      //         (Orderdata.order_total * getCoupon.dataValues.discount_per) / 100;
      //       Discount +=
      //         (Orderdata.order_total * getCoupon.dataValues.discount_per) / 100;
      //     }
      //   }
      // } else {
      //   SubTotalAmt += Orderdata.order_total;
      //   TotalAmt += Orderdata.order_total;
      // }

      // if (Productdata.dataValues.GST != 0) {
      //   TotalGst += (Orderdata.order_total * Productdata.dataValues.GST) / 100;
      //   if (TotalGst) {
      //     TotalAmt +=
      //       (Orderdata.order_total * Productdata.dataValues.GST) / 100;
      //   }
      // } else {
      //   TotalTax += Productdata.dataValues.Product_tax;
      //   if (TotalTax) {
      //     TotalAmt += Productdata.dataValues.Product_tax;
      //   }
      // }
      // if (Productdata.dataValues.shipping_charge) {
      //   Shipping += Productdata.dataValues.shipping_charge;
      //   if (Shipping) {
      //     TotalAmt += Productdata.dataValues.shipping_charge;
      //   }
      // }
      // //////***************** end ******************************/

      //// get product video link for product data
      // let videolink = `${req.protocol}://${req.get(
      //   "host"
      // )}/src/images/productVideo/${Productdata.dataValues.product_video}`;
      // Productdata.dataValues.videolink = Productdata.dataValues.product_video
      //   ? videolink
      //   : "";

      // //// get product all image with link
      // const ProductImagedata = await productImage.findAll({
      //   where: { product_id: Productdata.product_id },
      //   attributes: ["productImage_id", "product_id", "image"],
      // });

      // for (let i = 0; i < ProductImagedata.length; i++) {
      //   let imagelink = `${req.protocol}://${req.get(
      //     "host"
      //   )}/src/images/productImage/${ProductImagedata[i].dataValues.image}`;
      //   ProductImagedata[i].dataValues.imagelink = ProductImagedata[i]
      //     .dataValues.image
      //     ? imagelink
      //     : "";
      // }

      //// get user data using orderdata
      const Userdata = await user.findOne({
        where: { user_id: Orderdata.user_id, user_token: Orderdata.user_token },
        attributes: [
          "user_first_name",
          "user_last_name",
          "user_email",
          "user_mobile_no",
          "user_address",
          "user_pincode",
          "user_country",
          "user_state",
        ],
      });

      //// add ordertrn data in orderdata object
      Orderdata.subData = OrderTrndata;
      //// add user data in orderdata object
      Orderdata.userData = Userdata;
      //// add product data in orderdata object
      // Orderdata.productData = Productdata;
      //// add productimage links data in productdata object
      // Productdata.dataValues.OtherImages = ProductImagedata;

      // if (getCoupon) {
      //   if (getCoupon.dataValues.discount_Amt) {
      //     Orderdata.order_total =
      //       Orderdata.order_total - getCoupon.dataValues.discount_Amt;
      //   } else {
      //     if (getCoupon.dataValues.discount_per) {
      //       Orderdata.order_total =
      //         Orderdata.order_total -
      //         (Orderdata.order_total * getCoupon.dataValues.discount_per) / 100;
      //     }
      //   }
      // }
      //// get order count
      // const { count, rows } = await order.findAndCountAll({
      //   where: {
      //     order_status: { [Op.in]: [1, 2, 3, 4, 5] },
      //     user_token: userData.user_detail.user_token,
      //     user_id: userData.user_detail.user_id,
      //   },
      // });

      if (Orderdata) {
        // return res
        //   .status(200)
        //   .json({ status: 1, msg: "Done.", data: Orderdata });
        return res.status(200).json({
          status: 1,
          msg: "Done.",
          // ProductInCart: count,
          // SubTotalAmt: roundToTwo(SubTotalAmt),
          // TotalGst: roundToTwo(TotalGst),
          // TotalTax: roundToTwo(TotalTax),
          // Shipping: roundToTwo(Shipping),
          // Discount: roundToTwo(Discount),
          // TotalAmt: roundToTwo(TotalAmt),
          data: Orderdata,
        });
      } else {
        return res.status(404).json({ status: 0, msg: "Cart Data Not Found!" });
      }
    } else {
      //// get order data for full order
      // const Orderdata = await order.findAll({
      //   where: {
      //     order_status: {
      //       [Op.ne]: 6,
      //     },
      //     user_token: userData.user_detail.user_token,
      //     user_id: userData.user_detail.user_id,
      //   },
      //   attributes: {
      //     exclude: ["is_active", "is_deleted", "created_date", "updated_date"],
      //   },
      // });

      const Orderdata = await sequelize.query(
        `SELECT ord.order_id,
                ord.user_id,
                ord.user_token,
                ord.order_total,
                ord.user_address,
                orst.product_id,
                orst.order_coupon_code,
                orst.product_quantity,
                orst.product_price
          FROM orders AS ord
          LEFT JOIN ordertrns AS orst ON orst.order_id = ord.order_id 
          WHERE ord.user_token = :user_token AND ord.payment_type = :payment_type AND user_id = :user_id`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            user_token: userData.user_detail.user_token,
            user_id: userData.user_detail.user_id,
            payment_type: "",
          },
        }
      );

      // //// get order count
      // const { count, rows } = await order.findAndCountAll({
      //   where: {
      //     order_status: { [Op.in]: [1] },
      //     user_token: userData.user_detail.user_token,
      //     user_id: userData.user_detail.user_id,
      //   },
      // });

      //// get product data using order data
      for (let i = 0; i < Orderdata.length; i++) {
        const Productdata = await product.findOne({
          where: { product_id: Orderdata[i].product_id },
          attributes: {
            exclude: [
              "product_price",
              "GST",
              "Product_tax",
              "product_discount",
              "product_discount_price",
              "shipping_charge",
              "product_modify_object",
              "product_view",
              "is_active",
              "is_deleted",
              "created_date",
              "updated_date",
            ],
          },
        });
        // const getCoupon = await giftCard.findOne({
        //   where: {
        //     discount_code: Orderdata[i].order_coupon_code,
        //   },
        // });

        // if (getCoupon) {
        //   if (getCoupon.dataValues.discount_Amt) {
        //     SubTotalAmt +=
        //       Orderdata[i].order_total - getCoupon.dataValues.discount_Amt;
        //     TotalAmt +=
        //       Orderdata[i].order_total - getCoupon.dataValues.discount_Amt;
        //     Discount += getCoupon.dataValues.discount_Amt;
        //   } else {
        //     if (getCoupon.dataValues.discount_per) {
        //       SubTotalAmt +=
        //         Orderdata[i].order_total -
        //         (Orderdata[i].order_total * getCoupon.dataValues.discount_per) /
        //           100;

        //       TotalAmt +=
        //         Orderdata[i].order_total -
        //         (Orderdata[i].order_total * getCoupon.dataValues.discount_per) /
        //           100;
        //       Discount +=
        //         (Orderdata[i].order_total * getCoupon.dataValues.discount_per) /
        //         100;
        //     }
        //   }
        // } else {
        //   SubTotalAmt += Orderdata[i].order_total;
        //   TotalAmt += Orderdata[i].order_total;
        // }

        // if (Productdata.dataValues.GST != 0) {
        //   TotalGst +=
        //     (Orderdata[i].order_total * Productdata.dataValues.GST) / 100;
        //   if (TotalGst) {
        //     TotalAmt +=
        //       (Orderdata[i].order_total * Productdata.dataValues.GST) / 100;
        //   }
        // } else {
        //   TotalTax += Productdata.dataValues.Product_tax;
        //   if (TotalTax) {
        //     TotalAmt += Productdata.dataValues.Product_tax;
        //   }
        // }
        // if (Productdata.dataValues.shipping_charge) {
        //   Shipping += Productdata.dataValues.shipping_charge;
        //   if (Shipping) {
        //     TotalAmt += Productdata.dataValues.shipping_charge;
        //   }
        // }

        if (Productdata.dataValues.product_video) {
          let videolink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productVideo/${Productdata.dataValues.product_video}`;
          Productdata.dataValues.videolink = Productdata.dataValues.product_video
            ? videolink
            : "";
        }else{
          Productdata.dataValues.videolink = "";
        }
        const data1 = await productImage.findOne({
          where: { product_id: Productdata.dataValues.product_id },
          attributes: ["image"],
        });
        if (data1) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${data1.dataValues.image}`;
          Productdata.dataValues.imagelink = data1.dataValues.image
            ? imagelink
            : "";
        }

        // ProductData.push(Productdata);
        Orderdata[i].ProductData = Productdata;

        //   if (getCoupon) {
        //     if (getCoupon.dataValues.discount_Amt) {
        //       Orderdata[i] = Orderdata[i] - getCoupon.dataValues.discount_Amt;
        //     } else {
        //       if (getCoupon.dataValues.discount_per) {
        //         Orderdata[i] =
        //           Orderdata[i] -
        //           (Orderdata[i] * getCoupon.dataValues.discount_per) / 100;
        //       }
        //     }
        //   }
      }

      if (Orderdata.length != 0) {
        return res.status(200).json({
          status: 1,
          msg: "Done.",
          // ProductInCart: count,
          // SubTotalAmt: roundToTwo(SubTotalAmt),
          // TotalGst: roundToTwo(TotalGst),
          // TotalTax: roundToTwo(TotalTax),
          // Shipping: roundToTwo(Shipping),
          // Discount: roundToTwo(Discount),
          // TotalAmt: roundToTwo(TotalAmt),
          data: Orderdata,
        });
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "Product Not Found in order!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

//// get all order
const myOrderGet = async (req, res) => {
  const userData = req.body;
  const order_id = userData.order_id;

  try {
    if (order_id != 0) {
      const OrderData = await sequelize.query(
        `SELECT ord.order_id,   
                ord.user_id,
                ord.user_token,
                ord.order_total,
                ord.order_status,
                user_first_name,
                user_last_name,
                user_mobile_no,
                ord.user_address,
                user_pincode,
                user_country,
                user_state,
                payment_type
          FROM orders AS ord
          WHERE ord.order_id = :order_id AND ord.payment_type IS NOT NULL`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            order_id: order_id,
            payment_type: "",
          },
        }
      );

      const Orderdata = OrderData[0];

      if (Orderdata) {
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "Product Not Found in Order!" });
      }

      //// get ordertrn data
      const OrderTrndata = await orderTrn.findAll({
        where: { order_id: Orderdata.order_id },
        attributes: {
          exclude: ["is_active", "is_deleted", "created_date", "updated_date"],
        },
      });

      // console.log(OrderTrndata);
      // return
      for (let i = 0; i < OrderTrndata.length; i++) {
        const Productdata = await product.findOne({
          where: { product_id: OrderTrndata[i].product_id },
          attributes: {
            exclude: [
              "product_price",
              "product_discount",
              "product_discount_price",
              "product_modify_object",
              "product_view",
              "is_active",
              "is_deleted",
              "created_date",
              "updated_date",
            ],
          },
        });

        if (Productdata.product_video) {
          let videolink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productVideo/${Productdata.product_video}`;
          Productdata.dataValues.videolink = Productdata.dataValues.product_video
            ? videolink
            : "";
        }else{
          Productdata.dataValues.videolink = "";
        }
        const data1 = await productImage.findOne({
          where: { product_id: Productdata.dataValues.product_id },
          attributes: ["image"],
        });

        if (data1) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${data1.dataValues.image}`;
          Productdata.dataValues.imagelink = data1.dataValues.image
            ? imagelink
            : "";
        } else {
          Productdata.dataValues.imagelink = "";
        }
        if (!OrderTrndata[i].dataValues.productdata) {
          OrderTrndata[i].dataValues.productdata = [];
        }
        OrderTrndata[i].dataValues.productdata.push(Productdata);
      }

      //// get user data using orderdata
      // const Userdata = await user.findOne({
      //   where: { user_id: Orderdata.user_id, user_token: Orderdata.user_token },
      //   attributes: [
      //     "user_first_name",
      //     "user_last_name",
      //     "user_email",
      //     "user_mobile_no",
      //     "user_address",
      //     "user_pincode",
      //     "user_country",
      //     "user_state",
      //   ],
      // });

      //// add ordertrn data in orderdata object
      Orderdata.subData = OrderTrndata;
      //// add user data in orderdata object
      // Orderdata.userData = Userdata;

      if (Orderdata) {
        return res.status(200).json({
          status: 1,
          msg: "Done.",
          data: Orderdata,
        });
      } else {
        return res.status(404).json({ status: 0, msg: "Cart Data Not Found!" });
      }
    } else {
      const Orderdata = await sequelize.query(
        `SELECT ord.order_id,   
                ord.user_id,
                ord.user_token,
                ord.order_total,
                ord.order_status,
                user_first_name,
                user_last_name,
                user_mobile_no,
                ord.user_address,
                user_pincode,
                user_country,
                user_state,
                payment_type
          FROM orders AS ord
          WHERE ord.user_token = :user_token AND ord.payment_type IS NOT NULL AND user_id = :user_id`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            user_token: userData.user_detail.user_token,
            user_id: userData.user_detail.user_id,
          },
        }
      );

      if (!Orderdata) {
        return res
        .status(404)
        .json({ status: 0, msg: "Product Not Found in order!" });
      }

      if (Orderdata) {
        for (let i = 0; i < Orderdata.length; i++) {
         const orderdata = await orderstatus.findOne({
           where: {
             status_id: Orderdata[i].order_status,
           },
           attributes: ["status_name"],
         });
         ////add status
         Orderdata[i].orderstatus = orderdata;   
        }
      }


      if (Orderdata.length != 0) {
        return res.status(200).json({
          status: 1,
          msg: "Done.",
          data: Orderdata,
        });
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "Product Not Found in order!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};


//// use gift code on order
const applyCodeOnOrder = async (req, res) => {
  const userData = req.body;
  // console.log(userData);
  // return
  let t;
  try {
    const getOrderdata = await order.findOne({
      where: {
        order_id: userData.order_id,
        user_id: userData.user_detail.user_id,
        user_token: userData.user_detail.user_token,
      },
    });

    const getOrdertrndata = await orderTrn.findOne({
      where: {
        order_id: getOrderdata.order_id,
        product_id: userData.product_id,
      },
    });

    const getCoupon = await couponCard.findOne({
      where: {
        discount_code: userData.order_coupon_code,
        product_id: userData.product_id,
        is_active: 1,
      },
    });

    const productdata = await product.findOne({
      where: {
        product_id: userData.product_id,
        is_active: 1,
      },
    });
    //  console.log(productdata.dataValues.product_price);
    //  return
    if (getCoupon) {
      if (getCoupon.dataValues.product_id === userData.product_id) {
        if (getOrdertrndata) {
          if (getOrdertrndata.dataValues.order_coupon_code) {
            return res.status(200).json({
              status: 0,
              message: `${getOrderdata.dataValues.order_coupon_code} Already Apply on Product!`,
            });
          } else {
            let discountAmt;
            if (getCoupon) {
              if (getCoupon.dataValues.discount_Amt) {
                discountAmt = getCoupon.dataValues.discount_Amt;
                // * getOrdertrndata.dataValues.product_quantity;
              } else {
                // let TotalGst = 0;
                // let TotalTax = 0;
                let TotalAmt = productdata.dataValues.product_discount_price;
                // // console.log("productdata.dataValues.product_price" + productdata.dataValues.product_price);
                // if (productdata.dataValues.GST != 0) {
                //   TotalGst +=
                //     (productdata.dataValues.product_discount_price *
                //       productdata.dataValues.GST) /
                //     100;
                //   if (TotalGst) {
                //     TotalAmt += TotalGst;
                //   }
                // } else {
                //   TotalTax += productdata.dataValues.Product_tax;
                //   if (TotalTax) {
                //     TotalAmt += TotalTax;
                //   }
                // }

                // const PertoAmt =
                //   (TotalAmt * getCoupon.dataValues.discount_per) / 100;
                // discountAmt =
                //   PertoAmt * getOrdertrndata.dataValues.product_quantity;
                discountAmt =
                  (TotalAmt * getCoupon.dataValues.discount_per) / 100;
              }
            }
            const addCouponCode = await orderTrn.update(
              {
                order_coupon_code: userData.order_coupon_code,
                product_price:
                  getOrdertrndata.dataValues.product_price - discountAmt,
              },
              {
                where: {
                  order_id: userData.order_id,
                  product_id: userData.product_id,
                },
              }
            );
            if (addCouponCode) {
              return res.status(200).json({
                status: 1,
                message: "Coupon Code Apply Successfully.",
                data : discountAmt
              });
            } else {
              return res
                .status(200)
                .json({ status: 0, message: "Coupon Code Not Apply!" });
            }
          }
        } else {
          return res
            .status(404)
            .json({ status: 0, message: "Order Not Found!" });
        }
      } else {
        return res.status(400).json({
          status: 0,
          msg: "The Coupon Code is Not Applicable to this Product!",
        });
      }
    } else {
      return res.status(404).json({ status: 0, message: "Coupon Not Found!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 0, msg: "Internal Server Error!" });
  }
};

///// remove or delete order
const CartProductDelete = async (req, res) => {
  const mycart_id = req.body.mycart_id;
  try {
    const cartToDelete = await mycart.findByPk(mycart_id);

    if (!cartToDelete) {
      return res
        .status(200)
        .json({ status: 0, msg: "Product Not Found in Cart" });
    } else {
      // await orderTrn.destroy({
      //   where: {
      //     order_id: order_id,
      //   },
      // });
      await cartToDelete.destroy();

      return res
        .status(200)
        .json({ status: 1, msg: "Product Remove Successfully." });
    }
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error" });
  }
};

/////pay now

/////pay now
const paynow = async (req, res) => {
  const userData = req.body;
  try {
    const instance = new Razorpay({ key_id: CONFIG.ROZERPAY_key_id, key_secret: CONFIG.ROZERPAY_key_secret });

    const options = {
      amount: userData.order_total * 100,
      currency: userData.currency,
      receipt: "receipt#1",
      payment_capture: 1
    };

    const order = await instance.orders.create(options);
    if (order) {
      return res.status(200).json({ 
        status: 1, 
        msg: "Order generated successfully.", 
        data: { 
          order_id: order.id,
          currency: order.currency,
          amount: userData.order_total
        }
      });
    } else {
      return res.status(500).json({ 
        status: 0, 
        msg: "Failed to generate order. Please try again." 
      });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      status: 0, 
      msg: "An error occurred while creating the order.", 
      error: err.toString() 
    });
  }

}


const orderUpdate = async (req, res) => {
  const userData = req.body;
  const { order_id, payment_id } = userData;
  try {
    if (!order_id || !payment_id) {
      return res.status(200).json({ status: 0, msg: "Order ID and Payment ID are required." });
    }
    if (order_id != 0) {
      ///// payment gateway **************************start
      const instance = new Razorpay({ key_id: CONFIG.ROZERPAY_key_id, key_secret: CONFIG.ROZERPAY_key_secret });

      const payment = await instance.payments.fetch(payment_id);

      if(!payment){
        return res
          .status(500)
          .json({ status: 0, msg: "Error loading payment from Razorpay.!" });    
      }

      ///// payment gateway **************************end


      const OrderData = await order.findOne({
        where: { order_id: order_id },
      });
      if (!OrderData){
        return res
          .status(404)
          .json({ status: 0, msg: "Order Not Found!" });
      }

      const OrderTrnData = await orderTrn.findAll({
        where: { order_id: OrderData.dataValues.order_id },
      });

      if (OrderTrnData) {
        for (let i = 0; i < OrderTrnData.length; i++) {
          const productdata = await product.findOne({
            where: { product_id: OrderTrnData[i].product_id },
          });

          let newqua =
            productdata.dataValues.product_quantity -
            OrderTrnData[i].product_quantity;

          await product.update(
            { product_quantity: newqua },
            {
              where: { product_id: OrderTrnData[i].product_id },
            }
          );
        }
      }
      const newOrder = await order.update(
        {
          user_first_name: userData.user_first_name,
          user_last_name: userData.user_last_name,
          user_mobile_no: userData.user_mobile_no,
          user_pincode: userData.user_pincode,
          user_country: userData.user_country,
          user_state: userData.user_state,
          order_total: userData.order_total,
          user_address: userData.user_address,
          payment_type: payment.method,
          proceed_to_payment: 1,
          updated_date: Date.now(),
        },
        { where: { order_id: order_id } }
      );

      if(newOrder){
        const cartToDelete = await mycart.findByPk(userData.user_detail.user_id);

        if (!cartToDelete) {
          return res.status(200).json({ status: 0, msg: "Cart Not Found!" });
        }
        await cartToDelete.destroy();
      }

      if (newOrder) {
        return res
          .status(200)
          .json({ status: 1, msg: "Order Place Successfull." ,data : {
            status : payment.status,
            method : payment.method,
            amount : payment.amount,
            currency : payment.currency
          }});
      } else {
        return res.status(200).json({ status: 0, msg: "Failed to place order!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
}; 





// const paynow = async (req, res) => {
//   const userData = req.body;
//   const order_id = userData.order_id;
//   // console.log(userData.user_detail.user_id);
//   // return
//   try {
//     if (order_id != 0) {
//       // const OrderData = await sequelize.query(
//       //   `SELECT ord.order_id,
//       //           ord.user_id,
//       //           ord.user_token,
//       //           ord.order_total,
//       //           ord.user_address
//       //     FROM orders AS ord
//       //     WHERE ord.order_id = :order_id AND ord.payment_type = :payment_type`,
//       //   {
//       //     type: QueryTypes.SELECT,
//       //     replacements: {
//       //       order_id: order_id,
//       //       payment_type: "",
//       //     },
//       //   }
//       // );

//       // const Orderdata = OrderData[0];
//       const OrderData = await order.findOne({
//         where: { order_id: order_id },
//       });
//       if (!OrderData){
//         return res
//           .status(404)
//           .json({ status: 0, msg: "Order Not Found in Order List!" });
//       }

//       // console.log(OrderData);

//       const OrderTrnData = await orderTrn.findAll({
//         where: { order_id: OrderData.dataValues.order_id },
//       });

//       if (OrderTrnData) {
//         for (let i = 0; i < OrderTrnData.length; i++) {
//           const productdata = await product.findOne({
//             where: { product_id: OrderTrnData[i].product_id },
//           });

//           let newqua =
//             productdata.dataValues.product_quantity -
//             OrderTrnData[i].product_quantity;

//           await product.update(
//             { product_quantity: newqua },
//             {
//               where: { product_id: OrderTrnData[i].product_id },
//             }
//           );
//         }
//       }
//       const newOrder = await order.update(
//         {
//           user_first_name: userData.user_first_name,
//           user_last_name: userData.user_last_name,
//           user_mobile_no: userData.user_mobile_no,
//           user_pincode: userData.user_pincode,
//           user_country: userData.user_country,
//           user_state: userData.user_state,
//           order_total: userData.order_total,
//           user_address: userData.user_address,
//           payment_type: userData.payment_type,
//           proceed_to_payment: 1,
//           updated_date: Date.now(),
//         },
//         { where: { order_id: order_id } }
//       );

//       if(newOrder){
//         const cartToDelete = await mycart.findByPk(userData.user_detail.user_id);

//         if (!cartToDelete) {
//           return res.status(200).json({ status: 0, msg: "User Not Found!" });
//         }
//         await cartToDelete.destroy();
//       }

//       if (newOrder) {
//         return res
//           .status(200)
//           .json({ status: 1, msg: "Order Place Successfull." });
//       } else {
//         return res.status(200).json({ status: 1, msg: "Order Not Place." });
//       }
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(200).send({ status: 0, msg: err.toString() });
//   }
// };

//// get all pdf generate
const pdfgenerate = async (req, res) => {
  const userData = req.body;
  const order_id = userData.order_id;

  try {
    if (order_id != 0) {
      const OrderData = await sequelize.query(
        `SELECT ord.order_id,   
                ord.user_id,
                ord.user_token,
                ord.order_total,
                user_first_name,
                user_last_name,
                user_mobile_no,
                ord.user_address,
                user_pincode,
                user_country,
                user_state,
                payment_type
          FROM orders AS ord
          WHERE ord.order_id = :order_id AND ord.payment_type IS NOT NULL`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            order_id: order_id,
            payment_type: "",
          },
        }
      );

      const Orderdata = OrderData[0];

      if (Orderdata) {
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "Product Not Found in Order!" });
      }

      //// get ordertrn data
      const OrderTrndata = await orderTrn.findAll({
        where: { order_id: Orderdata.order_id },
        attributes: {
          exclude: ["is_active", "is_deleted", "created_date", "updated_date"],
        },
      });

      // console.log(OrderTrndata);
      // return
      for (let i = 0; i < OrderTrndata.length; i++) {
        const Productdata = await product.findOne({
          where: { product_id: OrderTrndata[i].product_id },
          attributes: {
            exclude: [
              "product_price",
              "product_discount",
              "product_discount_price",
              "product_modify_object",
              "product_view",
              "is_active",
              "is_deleted",
              "created_date",
              "updated_date",
            ],
          },
        });

        if (Productdata.product_video) {
          let videolink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productVideo/${Productdata.product_video}`;
          Productdata.dataValues.videolink = Productdata.dataValues.product_video
            ? videolink
            : "";
        }else{
          Productdata.dataValues.videolink = "";
        }
        const data1 = await productImage.findOne({
          where: { product_id: Productdata.dataValues.product_id },
          attributes: ["image"],
        });
        if (data1) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${data1.dataValues.image}`;
          Productdata.dataValues.imagelink = data1.dataValues.image
            ? imagelink
            : "";
        } else {
          Productdata.dataValues.imagelink = "";
        }
        if (!OrderTrndata[i].dataValues.productdata) {
          OrderTrndata[i].dataValues.productdata = [];
        }
        OrderTrndata[i].dataValues.productdata.push(Productdata);
      }

      //// get user data using orderdata
      const Userdata = await user.findOne({
        where: { user_id: Orderdata.user_id, user_token: Orderdata.user_token },
        attributes: [
          "user_first_name",
          "user_last_name",
          "user_email",
          "user_mobile_no",
          "user_address",
          "user_pincode",
          "user_country",
          "user_state",
        ],
      });

      //// add ordertrn data in orderdata object
      Orderdata.subData = OrderTrndata;
      //// add user data in orderdata object
      Orderdata.userData = Userdata;

      if (Orderdata) {
        return res.status(200).json({
          status: 1,
          msg: "Done.",
          data: Orderdata,
        });
      } else {
        return res.status(404).json({ status: 0, msg: "Cart Data Not Found!" });
      }
    } else {
      const Orderdata = await sequelize.query(
        `SELECT ord.order_id,
                ord.user_id,
                ord.user_token,
                ord.order_total,
                ord.user_address,
                orst.product_id,
                orst.order_coupon_code,
                orst.product_quantity,
                orst.product_price
          FROM orders AS ord
          LEFT JOIN ordertrns AS orst ON orst.order_id = ord.order_id 
          WHERE ord.user_token = :user_token AND ord.payment_type = :payment_type AND user_id = :user_id`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            user_token: userData.user_detail.user_token,
            user_id: userData.user_detail.user_id,
            payment_type: "",
          },
        }
      );

      //// get product data using order data
      for (let i = 0; i < Orderdata.length; i++) {
        const Productdata = await product.findOne({
          where: { product_id: Orderdata[i].product_id },
          attributes: {
            exclude: [
              "product_price",
              "GST",
              "Product_tax",
              "product_discount",
              "product_discount_price",
              "shipping_charge",
              "product_modify_object",
              "product_view",
              "is_active",
              "is_deleted",
              "created_date",
              "updated_date",
            ],
          },
        });

        if (Productdata.dataValues.product_video) {
          let videolink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productVideo/${Productdata.dataValues.product_video}`;
          Productdata.dataValues.videolink = Productdata.dataValues.product_video
            ? videolink
            : "";
        }else{
          Productdata.dataValues.videolink = "";
        }
        const data1 = await productImage.findOne({
          where: { product_id: Productdata.dataValues.product_id },
          attributes: ["image"],
        });
        if (data1) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${data1.dataValues.image}`;
          Productdata.dataValues.imagelink = data1.dataValues.image
            ? imagelink
            : "";
        }
        // ProductData.push(Productdata);
        Orderdata[i].ProductData = Productdata;
      }

      if (Orderdata.length != 0) {
        return res.status(200).json({
          status: 1,
          msg: "Done.",
          data: Orderdata,
        });
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "Product Not Found in order!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

//// add product for order gotoCheckOut
// const goToCheckOut = async (req, res) => {
//   const userData = req.body;
//   try {
//     if (userData) {
//       // Parse the JSON string into an array
//       const ids = JSON.parse(userData.order_ids);
//       // Ensure all items are integers and non-negative
//       if (
//         Array.isArray(ids) &&
//         ids.every((id) => Number.isInteger(id) && id >= 0)
//       ) {
//         // console.log(ids);
//         const orderdata = await order.findAll({
//           where: {
//             order_id: {
//               [Op.in]: ids,
//             },
//           },
//           attributes: {
//             exclude: ["is_active", "is_deleted", "createdAt", "updatedAt"],
//           },
//         });

//         if (orderdata) {
//           const newgoToCheckOut = await myorder.create({
//             user_id: userData.user_id,
//             order_sub_total: userData.order_sub_total,
//             order_total_gst: userData.order_total_gst,
//             order_total_tax: userData.order_total_tax,
//             order_shipping: userData.order_shipping,
//             order_discount: userData.order_discount,
//             order_total_Amt: userData.order_total_Amt,
//             order_ids: userData.order_ids,
//             order_status: 1,
//             created_date: Date.now(),
//             updated_date: Date.now(),
//           });

//           if (newgoToCheckOut) {
//             if (ids != 0) {
//               const Orderdata = await sequelize.query(
//                 `SELECT ord.order_id,   
//                         ord.product_id,
//                         ord.user_id,
//                         ord.user_token,
//                         ord.order_coupon_code,
//                         ord.order_status,
//                         ord.order_total,
//                         ors.status_name
//                   FROM orders AS ord
//                   LEFT JOIN orderstatuses AS ors ON ors.status_id = ord.order_status
//                   WHERE ord.user_token = :user_token AND ord.order_status != :order_status AND user_id = :user_id AND ord.order_id IN (:order_ids)`,
//                 {
//                   type: QueryTypes.SELECT,
//                   replacements: {
//                     user_token: userData.user_detail.user_token,
//                     order_status: 2,
//                     user_id: userData.user_detail.user_id,
//                     order_ids: ids,
//                   },
//                 }
//               );

//               //// get order count
//               const { count, rows } = await order.findAndCountAll({
//                 where: {
//                   order_status: { [Op.in]: [1] },
//                   user_token: userData.user_detail.user_token,
//                   user_id: userData.user_detail.user_id,
//                 },
//               });

//               //// get product data using order data
//               for (let i = 0; i < Orderdata.length; i++) {
//                 const Productdata = await product.findOne({
//                   where: { product_id: Orderdata[i].product_id },
//                   attributes: {
//                     exclude: [
//                       "is_active",
//                       "is_deleted",
//                       "created_date",
//                       "updated_date",
//                     ],
//                   },
//                 });
//                 const getCoupon = await giftCard.findOne({
//                   where: {
//                     discount_code: Orderdata[i].order_coupon_code,
//                   },
//                 });

//                 if (getCoupon) {
//                   if (getCoupon.dataValues.discount_Amt) {
//                     SubTotalAmt +=
//                       Orderdata[i].order_total -
//                       getCoupon.dataValues.discount_Amt;
//                     TotalAmt +=
//                       Orderdata[i].order_total -
//                       getCoupon.dataValues.discount_Amt;
//                     Discount += getCoupon.dataValues.discount_Amt;
//                   } else {
//                     if (getCoupon.dataValues.discount_per) {
//                       SubTotalAmt +=
//                         Orderdata[i].order_total -
//                         (Orderdata[i].order_total *
//                           getCoupon.dataValues.discount_per) /
//                           100;

//                       TotalAmt +=
//                         Orderdata[i].order_total -
//                         (Orderdata[i].order_total *
//                           getCoupon.dataValues.discount_per) /
//                           100;
//                       Discount +=
//                         (Orderdata[i].order_total *
//                           getCoupon.dataValues.discount_per) /
//                         100;
//                     }
//                   }
//                 } else {
//                   SubTotalAmt += Orderdata[i].order_total;
//                   TotalAmt += Orderdata[i].order_total;
//                 }

//                 if (Productdata.dataValues.GST != 0) {
//                   TotalGst +=
//                     (Orderdata[i].order_total * Productdata.dataValues.GST) /
//                     100;
//                   if (TotalGst) {
//                     TotalAmt +=
//                       (Orderdata[i].order_total * Productdata.dataValues.GST) /
//                       100;
//                   }
//                 } else {
//                   TotalTax += Productdata.dataValues.Product_tax;
//                   if (TotalTax) {
//                     TotalAmt += Productdata.dataValues.Product_tax;
//                   }
//                 }
//                 if (Productdata.dataValues.shipping_charge) {
//                   Shipping += Productdata.dataValues.shipping_charge;
//                   if (Shipping) {
//                     TotalAmt += Productdata.dataValues.shipping_charge;
//                   }
//                 }

//                 let videolink = `${req.protocol}://${req.get(
//                   "host"
//                 )}/src/images/productVideo/${
//                   Productdata.dataValues.product_video
//                 }`;
//                 Productdata.dataValues.videolink = Productdata.dataValues
//                   .product_video
//                   ? videolink
//                   : "";
//                 const data1 = await productImage.findOne({
//                   where: { product_id: Productdata.dataValues.product_id },
//                   attributes: ["image"],
//                 });
//                 if (data1) {
//                   let imagelink = `${req.protocol}://${req.get(
//                     "host"
//                   )}/src/images/productImage/${data1.dataValues.image}`;
//                   Productdata.dataValues.imagelink = data1.dataValues.image
//                     ? imagelink
//                     : "";
//                 }
//                 // ProductData.push(Productdata);
//                 Orderdata[i].ProductData = Productdata;

//                 if (getCoupon) {
//                   if (getCoupon.dataValues.discount_Amt) {
//                     Orderdata[i] =
//                       Orderdata[i] - getCoupon.dataValues.discount_Amt;
//                   } else {
//                     if (getCoupon.dataValues.discount_per) {
//                       Orderdata[i] =
//                         Orderdata[i] -
//                         (Orderdata[i] * getCoupon.dataValues.discount_per) /
//                           100;
//                     }
//                   }
//                 }
//               }

//               //////user details

//               const userdata = await user.findOne({
//                 where: {
//                   user_id: userData.user_id,
//                 },
//                 attributes: [
//                   "user_id",
//                   "user_token",
//                   "user_first_name",
//                   "user_last_name",
//                   "user_email",
//                   "user_mobile_no",
//                   "auth_token",
//                   "user_profile_photo",
//                   "user_address",
//                   "user_pincode",
//                   "user_country",
//                   "user_state",
//                 ],
//               });
//               if (userdata) {
//                 let imagelink = `${req.protocol}://${req.get(
//                   "host"
//                 )}/src/images/profileimage/${
//                   userdata.dataValues.user_profile_photo
//                 }`;
//                 userdata.dataValues.imagelink = userdata.dataValues
//                   .user_profile_photo
//                   ? imagelink
//                   : "";

//                 if (Orderdata.length != 0 && userdata != 0) {
//                   return res.status(200).json({
//                     status: 1,
//                     msg: "Done.",
//                     ProductInCart: count,
//                     SubTotalAmt: roundToTwo(SubTotalAmt),
//                     TotalGst: roundToTwo(TotalGst),
//                     TotalTax: roundToTwo(TotalTax),
//                     Shipping: roundToTwo(Shipping),
//                     Discount: roundToTwo(Discount),
//                     TotalAmt: roundToTwo(TotalAmt),
//                     data: Orderdata,
//                     user_details: userdata,
//                   });
//                 } else {
//                   return res
//                     .status(404)
//                     .json({ status: 0, msg: "Product Not Found in Cart!" });
//                 }
//               }

//               // return res.status(200).json({ status: 1, msg: "Order Received." });
//             } else {
//               return res
//                 .status(200)
//                 .json({ status: 0, msg: "Order Not Received." });
//             }
//           } else {
//             return res.status(404).json({ status: 0, msg: "Data Not Found!" });
//           }
//         } else {
//           console.error("Invalid favourite_news_list format");
//         }
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ status: 0, msg: "Internal Server Error!" });
//   }
// };

// //// add product for order gotoCheckOut
// const goToCheckOut = async (req, res) => {
//   const userData = req.body;
//   // let SubTotalAmt = 0;
//   // let TotalAmt = 0;
//   // let TotalGst = 0;
//   // let TotalTax = 0;
//   // let Shipping = 0;
//   // let Discount = 0;

//   // function roundToTwo(num) {
//   //   return Math.round(num * 100) / 100;
//   // }
//   try {
//     if (userData) {
//       // Parse the JSON string into an array
//       const ids = JSON.parse(userData.order_ids);
//       // Ensure all items are integers and non-negative
//       if (
//         Array.isArray(ids) &&
//         ids.every((id) => Number.isInteger(id) && id >= 0)
//       ) {
//         // console.log(ids);
//         const orderdata = await order.findAll({
//           where: {
//             order_id: {
//               [Op.in]: ids,
//             },
//           },
//           attributes: {
//             exclude: ["is_active", "is_deleted", "createdAt", "updatedAt"],
//           },
//         });

//         if (orderdata) {
//           const newgoToCheckOut = await myorder.create({
//             user_id: userData.user_id,
//             order_sub_total: userData.order_sub_total,
//             order_total_gst: userData.order_total_gst,
//             order_total_tax: userData.order_total_tax,
//             order_shipping: userData.order_shipping,
//             order_discount: userData.order_discount,
//             order_total_Amt: userData.order_total_Amt,
//             order_ids: userData.order_ids,
//             order_status: 1,
//             created_date: Date.now(),
//             updated_date: Date.now(),
//           });

//           if (newgoToCheckOut) {
//             if (ids != 0) {
//               const Orderdata = await sequelize.query(
//                 `SELECT ord.order_id,
//                         ord.product_id,
//                         ord.user_id,
//                         ord.user_token,
//                         ord.order_coupon_code,
//                         ord.order_status,
//                         ord.order_total,
//                         ors.status_name
//                   FROM orders AS ord
//                   LEFT JOIN orderstatuses AS ors ON ors.status_id = ord.order_status
//                   WHERE ord.user_token = :user_token AND ord.order_status != :order_status AND user_id = :user_id AND ord.order_id IN (:order_ids)`,
//                 {
//                   type: QueryTypes.SELECT,
//                   replacements: {
//                     user_token: userData.user_detail.user_token,
//                     order_status: 2,
//                     user_id: userData.user_detail.user_id,
//                     order_ids: ids,
//                   },
//                 }
//               );

//               //// get order count
//               const { count, rows } = await order.findAndCountAll({
//                 where: {
//                   order_status: { [Op.in]: [1] },
//                   user_token: userData.user_detail.user_token,
//                   user_id: userData.user_detail.user_id,
//                 },
//               });

//               //// get product data using order data
//               for (let i = 0; i < Orderdata.length; i++) {
//                 const Productdata = await product.findOne({
//                   where: { product_id: Orderdata[i].product_id },
//                   attributes: {
//                     exclude: [
//                       "is_active",
//                       "is_deleted",
//                       "created_date",
//                       "updated_date",
//                     ],
//                   },
//                 });
//                 const getCoupon = await giftCard.findOne({
//                   where: {
//                     discount_code: Orderdata[i].order_coupon_code,
//                   },
//                 });

//                 if (getCoupon) {
//                   if (getCoupon.dataValues.discount_Amt) {
//                     SubTotalAmt +=
//                       Orderdata[i].order_total -
//                       getCoupon.dataValues.discount_Amt;
//                     TotalAmt +=
//                       Orderdata[i].order_total -
//                       getCoupon.dataValues.discount_Amt;
//                     Discount += getCoupon.dataValues.discount_Amt;
//                   } else {
//                     if (getCoupon.dataValues.discount_per) {
//                       SubTotalAmt +=
//                         Orderdata[i].order_total -
//                         (Orderdata[i].order_total *
//                           getCoupon.dataValues.discount_per) /
//                           100;

//                       TotalAmt +=
//                         Orderdata[i].order_total -
//                         (Orderdata[i].order_total *
//                           getCoupon.dataValues.discount_per) /
//                           100;
//                       Discount +=
//                         (Orderdata[i].order_total *
//                           getCoupon.dataValues.discount_per) /
//                         100;
//                     }
//                   }
//                 } else {
//                   SubTotalAmt += Orderdata[i].order_total;
//                   TotalAmt += Orderdata[i].order_total;
//                 }

//                 if (Productdata.dataValues.GST != 0) {
//                   TotalGst +=
//                     (Orderdata[i].order_total * Productdata.dataValues.GST) /
//                     100;
//                   if (TotalGst) {
//                     TotalAmt +=
//                       (Orderdata[i].order_total * Productdata.dataValues.GST) /
//                       100;
//                   }
//                 } else {
//                   TotalTax += Productdata.dataValues.Product_tax;
//                   if (TotalTax) {
//                     TotalAmt += Productdata.dataValues.Product_tax;
//                   }
//                 }
//                 if (Productdata.dataValues.shipping_charge) {
//                   Shipping += Productdata.dataValues.shipping_charge;
//                   if (Shipping) {
//                     TotalAmt += Productdata.dataValues.shipping_charge;
//                   }
//                 }

//                 let videolink = `${req.protocol}://${req.get(
//                   "host"
//                 )}/src/images/productVideo/${
//                   Productdata.dataValues.product_video
//                 }`;
//                 Productdata.dataValues.videolink = Productdata.dataValues
//                   .product_video
//                   ? videolink
//                   : "";
//                 const data1 = await productImage.findOne({
//                   where: { product_id: Productdata.dataValues.product_id },
//                   attributes: ["image"],
//                 });
//                 if (data1) {
//                   let imagelink = `${req.protocol}://${req.get(
//                     "host"
//                   )}/src/images/productImage/${data1.dataValues.image}`;
//                   Productdata.dataValues.imagelink = data1.dataValues.image
//                     ? imagelink
//                     : "";
//                 }
//                 // ProductData.push(Productdata);
//                 Orderdata[i].ProductData = Productdata;

//                 if (getCoupon) {
//                   if (getCoupon.dataValues.discount_Amt) {
//                     Orderdata[i] =
//                       Orderdata[i] - getCoupon.dataValues.discount_Amt;
//                   } else {
//                     if (getCoupon.dataValues.discount_per) {
//                       Orderdata[i] =
//                         Orderdata[i] -
//                         (Orderdata[i] * getCoupon.dataValues.discount_per) /
//                           100;
//                     }
//                   }
//                 }
//               }

//               //////user details

//               const userdata = await user.findOne({
//                 where: {
//                   user_id: userData.user_id,
//                 },
//                 attributes: [
//                   "user_id",
//                   "user_token",
//                   "user_first_name",
//                   "user_last_name",
//                   "user_email",
//                   "user_mobile_no",
//                   "auth_token",
//                   "user_profile_photo",
//                   "user_address",
//                   "user_pincode",
//                   "user_country",
//                   "user_state",
//                 ],
//               });
//               if (userdata) {
//                 let imagelink = `${req.protocol}://${req.get(
//                   "host"
//                 )}/src/images/profileimage/${
//                   userdata.dataValues.user_profile_photo
//                 }`;
//                 userdata.dataValues.imagelink = userdata.dataValues
//                   .user_profile_photo
//                   ? imagelink
//                   : "";

//                 if (Orderdata.length != 0 && userdata != 0) {
//                   return res.status(200).json({
//                     status: 1,
//                     msg: "Done.",
//                     ProductInCart: count,
//                     SubTotalAmt: roundToTwo(SubTotalAmt),
//                     TotalGst: roundToTwo(TotalGst),
//                     TotalTax: roundToTwo(TotalTax),
//                     Shipping: roundToTwo(Shipping),
//                     Discount: roundToTwo(Discount),
//                     TotalAmt: roundToTwo(TotalAmt),
//                     data: Orderdata,
//                     user_details: userdata,
//                   });
//                 } else {
//                   return res
//                     .status(404)
//                     .json({ status: 0, msg: "Product Not Found in Cart!" });
//                 }
//               }

//               // return res.status(200).json({ status: 1, msg: "Order Received." });
//             } else {
//               return res
//                 .status(200)
//                 .json({ status: 0, msg: "Order Not Received." });
//             }
//           } else {
//             return res.status(404).json({ status: 0, msg: "Data Not Found!" });
//           }
//         } else {
//           console.error("Invalid favourite_news_list format");
//         }
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ status: 0, msg: "Internal Server Error!" });
//   }
// };

//// return price mul.. by 2 for COUPLE key
// const updateSingeCouple = async (req, res) => {
//   const userData = req.body;
//   try {
//     if (userData.product_id != 0) {
//       const getProduct = await product.findOne({
//         where: { product_id: userData.product_id },
//       });

//       if (getProduct) {
//         let NewPrice;
//         let savePrice;
//         let totalPrice;
//         if (userData.product_type === "COUPLE") {
//           NewPrice = getProduct.dataValues.product_price * 2;
//           if (getProduct.dataValues.product_discount != 0) {
//             savePrice = getProduct.dataValues.product_discount * 2;
//             totalPrice = NewPrice - savePrice;
//           } else {
//             totalPrice = NewPrice;
//             NewPrice = 0;
//             savePrice = 0;
//           }
//           return res.status(200).send({
//             status: 1,
//             msg: "Done.",
//             New_Price: NewPrice,
//             save_Price: savePrice,
//             total_Price: totalPrice,
//           });
//         } else {
//           NewPrice = getProduct.dataValues.product_price;
//           if (getProduct.dataValues.product_discount != 0) {
//             savePrice = getProduct.dataValues.product_discount;
//             totalPrice = NewPrice - savePrice;
//           } else {
//             totalPrice = NewPrice;
//             NewPrice = 0;
//             savePrice = 0;
//           }

//           return res.status(200).send({
//             status: 1,
//             msg: "Done.",
//             New_Price: NewPrice,
//             save_Price: savePrice,
//             total_Price: totalPrice,
//           });
//         }
//       } else {
//         return res.status(404).json({ message: "Product Not Found!" });
//       }
//     } else {
//       return res
//         .status(200)
//         .json({ status: 0, message: "Please Fill Product Id!" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ status: 0, msg: "Internal Server Error!" });
//   }
// };

module.exports = {
  addToCart,
  CartGet,
  getCartCount,
  addToOrder,
  OrderGet,
  myOrderGet,
  CartProductDelete,
  applyCodeOnOrder,
  userAddressFill,
  addAddress,
  userAddressRemove,
  paynow,
  orderUpdate,
  pdfgenerate,
  // updateSingeCouple,
  // goToCheckOut,
};
