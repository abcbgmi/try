const db = require("../configs/db.js");
const user = db.user;
const product = db.product;
const productImage = db.productImages;
const couponCard = db.couponCard;
const category = db.category;
const sequelize = db.sequelize;
const productReview = db.productReview;
const image = db.image;
const subscriptionemail = db.subscriptionemail;
const contactPage = db.contactPage;
const { Op } = require("sequelize");
const commonValidation = require("../validation/common_validation.js");
const uploadImages = require("../utils/file_upload_function.js");
const CONFIG = require("../configs/config.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

///// get all product
const productGet = async (req, res) => {
  const userData = req.body;
  const product_id = userData.product_id;
  // console.log(userData);
  // return
  try {
    if (product_id != 0) {
      const data = await product.findOne({
        where: { product_id: product_id, is_active: 1 },
      });
      if (data) {
        ///// get avg rating
        const product_id = data.dataValues.product_id;
        // Raw SQL query to get the average rating of reviews for a specific product

        const adminstars = await productReview.findOne({
          where: {
            product_id: product_id,
            admin_rating: {
              [Op.ne]: 0,
            },
          },
        });

        if (adminstars) {
          if (adminstars) {
            data.dataValues.average_rating = adminstars.dataValues.admin_rating;
          }
        } else {
          const query = `
                          SELECT product_id, AVG(rating) AS average_rating ,COUNT(*) AS total_reviews
                          FROM productreviews
                          WHERE product_id = :product_id AND admin_rating = 0
                          GROUP BY product_id;
                        `;

          // Execute the raw SQL query
          const [results, metadata] = await sequelize.query(query, {
            replacements: { product_id },
            type: sequelize.QueryTypes.SELECT,
          });

          if (results) {
            data.dataValues.average_rating = results.average_rating;
            data.dataValues.total_reviews = results.total_reviews;
          } else {
            data.dataValues.average_rating = 0;
            data.dataValues.total_reviews = 0;
          }
        }

        const comment = await productReview.findAll({
          where: {
            product_id: product_id,
          },
          attributes: ["user_id", "review_text"],
        });

        for (let i = 0; i < comment.length; i++) {
          //  console.log(comment[i].dataValues.user_id);
          const userdata = await user.findOne({
            where: {
              user_id: comment[i].dataValues.user_id,
            },
            attributes: [
              "user_first_name",
              "user_last_name",
              "user_profile_photo",
            ],
          });

          if (userdata.dataValues.user_profile_photo) {
            let imagelink = `${req.protocol}://${req.get(
              "host"
            )}/src/images/profileimage/${
              userdata.dataValues.user_profile_photo
            }`;
            userdata.dataValues.imagelink = userdata.dataValues
              .user_profile_photo
              ? imagelink
              : "";
          }else{
            userdata.dataValues.imagelink = "";
          }
          comment[i].dataValues.user_data = userdata ? userdata : "";
        }
        /////   product for sale or not
        if (data.dataValues.is_active === false) {
          data.dataValues.for_sale = "OUT OF STOCK";
        }

        if (comment) {
          data.dataValues.taxt_comment = comment;
        } else {
          data.dataValues.taxt_comment = comment;
        }

        // if (results) {
        //   data.dataValues.average_rating = results.average_rating;
        // } else {
        //   data.dataValues.average_rating = 0;
        // }
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }

      await product.update(
        {
          product_view: data.dataValues.product_view + 1,
        },
        {
          where: { product_id: product_id },
        }
      );
      if(data.dataValues.product_video){
        let videolink = `${req.protocol}://${req.get(
          "host"
        )}/src/images/productVideo/${data.dataValues.product_video}`;
        data.dataValues.videolink = data.dataValues.product_video
          ? videolink
          : "";
      }else{
        data.dataValues.videolink = "";
      }

      const data1 = await productImage.findAll({
        where: { product_id: product_id },
        attributes: ["productImage_id", "product_id", "image"],
      });
      for (let i = 0; i < data1.length; i++) {
        if(data1[i].dataValues.image){
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${data1[i].dataValues.image}`;
          data1[i].dataValues.imagelink = data1[i].dataValues.image
            ? imagelink
            : "";
        }else{
          data1[i].dataValues.imagelink = "";
        }
      }

      data.dataValues.OtherImages = data1;

      if (data) {
        return res.status(200).json({ status: 1, msg: "Done.", data: data });
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }
    } else {
      const datas = await product.findAll({ where: { is_active: 1 } });
      for (let i = 0; i < datas.length; i++) {
        ///// get avg rating
        const product_id = datas[i].dataValues.product_id;
        // Raw SQL query to get the average rating of reviews for a specific product

        const adminstars = await productReview.findOne({
          where: {
            product_id: product_id,
            admin_rating: {
              [Op.ne]: 0,
            },
          },
        });

        if (adminstars) {
          if (adminstars) {
            datas[i].dataValues.average_rating =
              adminstars.dataValues.admin_rating;
          }
        } else {
          const query = `
                          SELECT product_id, AVG(rating) AS average_rating ,COUNT(*) AS total_reviews
                          FROM productreviews
                          WHERE product_id = :product_id AND admin_rating = 0
                          GROUP BY product_id;
                        `;

          // Execute the raw SQL query
          const [results, metadata] = await sequelize.query(query, {
            replacements: { product_id },
            type: sequelize.QueryTypes.SELECT,
          });
          if (results) {
            datas[i].dataValues.average_rating = results.average_rating;
            datas[i].dataValues.total_reviews = results.total_reviews;
          } else {
            datas[i].dataValues.average_rating = 0;
            datas[i].dataValues.total_reviews = 0;
          }
        }

        // const query = `
        //                  SELECT product_id, AVG(rating) AS average_rating
        //                  FROM productreviews
        //                  WHERE product_id = :product_id
        //                  GROUP BY product_id;
        //                `;

        // // Execute the raw SQL query
        // const [results, metadata] = await sequelize.query(query, {
        //   replacements: { product_id },
        //   type: sequelize.QueryTypes.SELECT,
        // });

        // if (results) {
        //   datas[i].dataValues.average_rating = results.average_rating;
        // } else {
        //   datas[i].dataValues.average_rating = 0;
        // }

        if(datas[i].dataValues.product_video){
          let videolink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productVideo/${datas[i].dataValues.product_video}`;
          datas[i].dataValues.videolink = datas[i].dataValues.product_video
            ? videolink
            : "";
        }else{
          datas[i].dataValues.videolink = "";
        }

        const data1 = await productImage.findOne({
          where: { product_id: datas[i].dataValues.product_id },
          attributes: ["image"],
        });

        if (data1) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${data1.dataValues.image}`;
          datas[i].dataValues.imagelink = data1.dataValues.image
            ? imagelink
            : "";
        } else {
          datas[i].dataValues.imagelink = "";
        }
      }

      /////   product for sale or not
      for (let i = 0; i < datas.length; i++) {
        if (datas[i].dataValues.is_active === false) {
          datas[i].dataValues.for_sale = "OUT OF STOCK";
        }
      }

      if (datas) {
        return res.status(200).json({ status: 1, msg: "Done.", data: datas });
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const productFillByCategory = async (req, res) => {
  const userData = req.body;
  const product_id = userData.product_id;
  const product_category = userData.category;
  try {
    const categoryname = await category.findOne({
      where: {
        category_id: product_category,
      },
      attributes: ["category_name"],
    });
    if (product_id != 0 && product_category != 0) {
      const data = await product.findOne({
        where: {
          product_id: product_id,
          product_category: product_category,
          is_active: 1,
        },
      });
      if (data) {
        ///// get avg rating
        const product_id = data.dataValues.product_id;
        // Raw SQL query to get the average rating of reviews for a specific product

        const adminstars = await productReview.findOne({
          where: {
            product_id: product_id,
            admin_rating: {
              [Op.ne]: 0,
            },
          },
        });

        if (adminstars) {
          if (adminstars) {
            data.dataValues.average_rating = adminstars.dataValues.admin_rating;
          }
        } else {
          const query = `
                         SELECT product_id, AVG(rating) AS average_rating ,COUNT(*) AS total_reviews
                         FROM productreviews
                         WHERE product_id = :product_id AND admin_rating = 0
                         GROUP BY product_id;
                       `;

          // Execute the raw SQL query
          const [results, metadata] = await sequelize.query(query, {
            replacements: { product_id },
            type: sequelize.QueryTypes.SELECT,
          });
          if (results) {
            data.dataValues.average_rating = results.average_rating;
            data.dataValues.total_reviews = results.total_reviews;
          } else {
            data.dataValues.average_rating = 0;
            data.dataValues.total_reviews = 0;
          }
        }

        const comment = await productReview.findAll({
          where: {
            product_id: product_id,
          },
          attributes: ["user_id", "review_text"],
        });

        for (let i = 0; i < comment.length; i++) {
          //  console.log(comment[i].dataValues.user_id);
          const userdata = await user.findOne({
            where: {
              user_id: comment[i].dataValues.user_id,
            },
            attributes: [
              "user_first_name",
              "user_last_name",
              "user_profile_photo",
            ],
          });

          if (userdata.dataValues.user_profile_photo) {
            let imagelink = `${req.protocol}://${req.get(
              "host"
            )}/src/images/profileimage/${
              userdata.dataValues.user_profile_photo
            }`;
            userdata.dataValues.imagelink = userdata.dataValues
              .user_profile_photo
              ? imagelink
              : "";
          }else{
            userdata.dataValues.imagelink = "";
          }
          comment[i].dataValues.user_data = userdata ? userdata : "";
        }
        /////   product for sale or not
        if (data.dataValues.is_active === false) {
          data.dataValues.for_sale = "OUT OF STOCK";
        }

        if (comment) {
          data.dataValues.taxt_comment = comment;
        } else {
          data.dataValues.taxt_comment = comment;
        }

        // if (results) {
        //   data.dataValues.average_rating = results.average_rating;
        // } else {
        //   data.dataValues.average_rating = 0;
        // }
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }
      if(data.dataValues.product_video){
        let videolink = `${req.protocol}://${req.get(
          "host"
        )}/src/images/productVideo/${data.dataValues.product_video}`;
        data.dataValues.videolink = data.dataValues.product_video
          ? videolink
          : "";
      }else{
        data.dataValues.videolink = "";
      }

      const data1 = await productImage.findAll({
        where: { product_id: product_id },
        attributes: ["productImage_id", "product_id", "image"],
      });
      for (let i = 0; i < data1.length; i++) {
        if(data1[i].dataValues.image){
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${data1[i].dataValues.image}`;
          data1[i].dataValues.imagelink = data1[i].dataValues.image
            ? imagelink
            : "";
        }else{
          data1[i].dataValues.imagelink = "";
        }
      }

      data.dataValues.OtherImages = data1;
      if (data) {
        return res
          .status(200)
          .json({
            status: 1,
            msg: "Done.",
            data: data,
            categoryname: categoryname,
          });
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }
    } else {
      const categoryBanner = await category.findOne({
        where: {
          category_id: product_category,
        },
        attributes: ["category_banner_image"],
      });


        if(categoryBanner.dataValues.category_banner_image){
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/categoryImage/${
            categoryBanner.dataValues.category_banner_image
          }`;
          categoryBanner.dataValues.imagelink = categoryBanner.dataValues
            .category_banner_image
            ? imagelink
            : "";
      }else{
        categoryBanner.dataValues.imagelink = "";
      }

      const datas = await product.findAll({
        attributes: {
          exclude: ["is_deleted", "created_date", "updated_date"],
        },
        where: {
          product_category: product_category,
          is_active: 1,
        },
      });
      for (let i = 0; i < datas.length; i++) {
        ///// get avg rating
        const product_id = datas[i].dataValues.product_id;
        // Raw SQL query to get the average rating of reviews for a specific product

        const adminstars = await productReview.findOne({
          where: {
            product_id: product_id,
            admin_rating: {
              [Op.ne]: 0,
            },
          },
        });

        if (adminstars) {
          if (adminstars) {
            datas[i].dataValues.average_rating =
              adminstars.dataValues.admin_rating;
          }
        } else {
          const query = `
                         SELECT product_id, AVG(rating) AS average_rating , COUNT(*) AS total_reviews
                         FROM productreviews
                         WHERE product_id = :product_id AND admin_rating = 0
                         GROUP BY product_id;
                       `;

          // Execute the raw SQL query
          const [results, metadata] = await sequelize.query(query, {
            replacements: { product_id },
            type: sequelize.QueryTypes.SELECT,
          });
          if (results) {
            datas[i].dataValues.average_rating = results.average_rating;
            datas[i].dataValues.total_reviews = results.total_reviews;
          } else {
            datas[i].dataValues.average_rating = 0;
            datas[i].dataValues.total_reviews = 0;
          }
        }

        if(datas[i].dataValues.product_video){
          let videolink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productVideo/${datas[i].dataValues.product_video}`;
          datas[i].dataValues.videolink = datas[i].dataValues.product_video
            ? videolink
            : "";
        }else{
          datas[i].dataValues.videolink = "";
        }
        const data1 = await productImage.findOne({
          where: { product_id: datas[i].dataValues.product_id },
          attributes: ["image"],
        });
        if (data1) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${data1.dataValues.image}`;
          datas[i].dataValues.imagelink = data1.dataValues.image
            ? imagelink
            : "";
        } else {
          datas[i].dataValues.imagelink = "";
        }
      }

      /////   product for sale or not
      for (let i = 0; i < datas.length; i++) {
        if (datas[i].dataValues.is_active === false) {
          datas[i].dataValues.for_sale = "OUT OF STOCK";
        }
      }

      if (datas) {
        return res
          .status(200)
          .json({
            status: 1, 
            msg: "Done.",
            data: datas,
            categoryname: categoryname,
            categoryBanner: categoryBanner,

          });
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};
 
// //// get all charms
// const charmGet = async (req, res) => {
//   const charm_id = req.body.charm_id;
//   try {
//     if (charm_id != 0) {
//       const datas = await charm.findOne({
//         where: {
//           charm_id: charm_id,
//         },
//       });
//       if (datas) {
//         return res.status(200).json({ status: 1, msg: "Done.", data: datas });
//       } else {
//         return res.status(404).json({ status: 0, msg: "Charm Not Found!" });
//       }
//     } else {
//       const datas = await charm.findAll();
//       if (datas) {
//         return res.status(200).json({ status: 1, msg: "Done.", data: datas });
//       } else {
//         return res.status(404).json({ status: 0, msg: "Charm Not Found!" });
//       }
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(200).send({ status: 0, msg: err.toString() });
//   }
// };

//// get all giftcard
const couponCardFill = async (req, res) => {
  const userData = req.body;
  const couponCard_id = userData.couponCard_id;
  let imagelink;
  try {
    if (couponCard_id != 0) {
      const data = await couponCard.findOne({
        where: { couponCard_id: couponCard_id, is_active: 1 },
        attributes: {
          exclude: ["is_active", "is_deleted", "created_date", "updated_date"],
        },
      });

      if (data) {
        imagelink = `${req.protocol}://${req.get(
          "host"
        )}/src/images/couponCardImage/${data.dataValues.couponCard_image}`;
        data.dataValues.imagelink = data.dataValues.couponCard_image
          ? imagelink
          : "";
        // console.log(data.dataValues);
        const productdata = await product.findOne({
          where: { product_id: data.dataValues.product_id, is_active: 1 },
          attributes: {
            exclude: ["is_deleted", "created_date", "updated_date"],
          },
        });
        if (productdata) {
          let videolink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productVideo/${productdata.dataValues.product_video}`;
          productdata.dataValues.videolink = productdata.dataValues
            .product_video
            ? videolink
            : "";
          const data1 = await productImage.findOne({
            where: { product_id: productdata.dataValues.product_id },
            attributes: ["image"],
          });
          if (data1) {
            let imagelink = `${req.protocol}://${req.get(
              "host"
            )}/src/images/productImage/${data1.dataValues.image}`;
            productdata.dataValues.imagelink = data1.dataValues.image
              ? imagelink
              : "";
          } else {
            productdata.dataValues.imagelink = "";
          }
          data.dataValues.product_details = productdata;
        }
        return res.status(200).json({ status: 1, msg: "Done.", data: data });
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "CouponCard Not Found!" });
      }
    } else {
      const datas = await couponCard.findAll({
        where: {
          is_active: 1,
        },
        attributes: {
          exclude: [
            "discount_code",
            "discount_Amt",
            "discount_per",
            "is_active",
            "is_deleted",
            "created_date",
            "updated_date",
          ],
        },
      });
      if (datas) {
        for (let i = 0; i < datas.length; i++) {
          imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/couponCardImage/${
            datas[i].dataValues.couponCard_image
          }`;
          datas[i].dataValues.imagelink = datas[i].dataValues.couponCard_image
            ? imagelink
            : "";
        }
        return res.status(200).json({ status: 1, msg: "Done.", data: datas });
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "couponCard Not Found!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

///// category
const categoryFill = async (req, res) => {
  try {
    const datas = await category.findAll({
      attributes: {
        exclude: ["is_deleted", "created_date", "updated_date"],
      },
      where: {
        is_active: 1,
      },
    });

    if (datas) {
    for (let i = 0; i < datas.length; i++) {
      if(datas[i].dataValues.category_image){
        let imagelink = `${req.protocol}://${req.get(
          "host"
        )}/src/images/categoryImage/${datas[i].dataValues.category_image}`;
        datas[i].dataValues.imagelink = datas[i].dataValues.category_image
          ? imagelink
          : "";
      }else{
        datas[i].dataValues.imagelink = "";
      }
    }

      return res.status(200).json({ status: 1, msg: "Done.", data: datas });
    } else {
      return res.status(404).json({ status: 0, msg: "Category Not Found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

///// testimonialsFill user side
const testimonialsFill = async (req, res) => {
  const userData = req.body;
  try {
    //   if (
    //     userData.user_detail.is_admin === 1 ||
    //     userData.user_detail.is_admin === true
    //   ) {
    //   } else {
    //     return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    //   }

    const comment = await productReview.findAll({
      where: {
        is_testimonials: 1,
      },
      attributes: {
        exclude: [
          "product_id",
          "is_active",
          "is_deleted",
          "created_date",
          "updated_date",
        ],
      },
    });

    for (let i = 0; i < comment.length; i++) {
      const userdata = await user.findOne({
        where: {
          user_id: comment[i].dataValues.user_id,
        },
        attributes: ["user_first_name", "user_last_name", "user_profile_photo"],
      });

      if (userdata.dataValues.user_profile_photo) {
        let imagelink = `${req.protocol}://${req.get(
          "host"
        )}/src/images/profileimage/${userdata.dataValues.user_profile_photo}`;
        userdata.dataValues.imagelink = userdata.dataValues.user_profile_photo
          ? imagelink
          : "";
      }else{
        userdata.dataValues.imagelink = "";
      }
      comment[i].dataValues.user_data = userdata ? userdata : "";
    }

    if (comment) {
      return res.status(200).json({ status: 1, msg: "Done.", data: comment });
    } else {
      return res.status(404).json({ status: 0, msg: "comment Not Found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

/////// images get home page
const headerimagesFill = async (req, res) => {
  const userData = req.body;
  try {
    // if (
    //   userData.user_detail.is_admin === 0 ||
    //   userData.user_detail.is_admin === false
    // ) {
    // } else {
    //   return res.status(200).json({ status: 0, message: "You Are Not !" });
    // }
    const datas = await image.findAll({
      where: {
        image_type: 1,
      },
    });
    if (datas) {
    for (let i = 0; i < datas.length; i++) {
      if(datas[i].dataValues.images){
        let imagelink = `${req.protocol}://${req.get(
          "host"
        )}/src/images/header&footerImages/${datas[i].dataValues.images}`;
        datas[i].dataValues.imagelink = datas[i].dataValues.images
          ? imagelink
          : "";
      }else{
        datas[i].dataValues.imagelink = "";
      }
    }

      return res.status(200).json({ status: 1, msg: "Done.", data: datas });
    } else {
      return res.status(404).json({ status: 0, msg: "Images Not Found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const headerimageoneFill = async (req, res) => {
  const userData = req.body;
  try {
    // if (
    //   userData.user_detail.is_admin === 1 ||
    //   userData.user_detail.is_admin === true
    // ) {
    // } else {
    //   return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    // }
    const data = await image.findOne({
      where: {
        image_type: 2,
      },
    });
    if (data.dataValues.images) {
      let imagelink = `${req.protocol}://${req.get(
        "host"
      )}/src/images/header&footerImages/${data.dataValues.images}`;
      data.dataValues.imagelink = data.dataValues.images ? imagelink : "";
    }

    if (data) {
      return res.status(200).json({ status: 1, msg: "Done.", data: data });
    } else {
      return res.status(404).json({ status: 0, msg: "Images Not Found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const headerimagetwoFill = async (req, res) => {
  const userData = req.body;
  try {
    // if (
    //   userData.user_detail.is_admin === 1 ||
    //   userData.user_detail.is_admin === true
    // ) {
    // } else {
    //   return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    // }
    const data = await image.findOne({
      where: {
        image_type: 3,
      },
    });
    if (data.dataValues.images) {
      let imagelink = `${req.protocol}://${req.get(
        "host"
      )}/src/images/header&footerImages/${data.dataValues.images}`;
      data.dataValues.imagelink = data.dataValues.images ? imagelink : "";
    }

    if (data) {
      return res.status(200).json({ status: 1, msg: "Done.", data: data });
    } else {
      return res.status(404).json({ status: 0, msg: "Images Not Found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const footerimageFill = async (req, res) => {
  const userData = req.body;
  try {
    // if (
    //   userData.user_detail.is_admin === 1 ||
    //   userData.user_detail.is_admin === true
    // ) {
    // } else {
    //   return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    // }
    const data = await image.findOne({
      where: {
        image_type: 4,
      },
    });
    if (data.dataValues.images) {
      let imagelink = `${req.protocol}://${req.get(
        "host"
      )}/src/images/header&footerImages/${data.dataValues.images}`;
      data.dataValues.imagelink = data.dataValues.images ? imagelink : "";
    }

    if (data) {
      return res.status(200).json({ status: 1, msg: "Done.", data: data });
    } else {
      return res.status(404).json({ status: 0, msg: "Images Not Found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const footerContactPage= async (req, res) => {
  const userData = req.body;
  // console.log(userData);
  // return
  try {
    const newcontactadd = await contactPage.create(
      {
        user_first_name : userData.user_first_name,
        user_last_name : userData.user_last_name,
        user_email : userData.user_email,
        user_mobile_no : userData.user_mobile_no,
        msg: userData.msg,
        created_date: Date.now(),
        updated_date: Date.now(),
      });

    if (newcontactadd) {
          return res
          .status(200)
          .send({ status: 1, msg: "Contact MSG Send Successfull." });
        } else {
          return res
            .status(200)
            .send({ status: 0, msg: "Contact MSG not Send!" });
        }
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: error.toString() });
  }
};

///// get all BestSaller
const getBestSeller = async (req, res) => {
  const userData = req.body;
  const product_id = userData.product_id;
  try {
    if (product_id != 0) {
      const data = await product.findOne({
        where: { product_id: product_id, is_active: 1 },
      });
      if (data) {
        ///// get avg rating
        const product_id = data.dataValues.product_id;
        // Raw SQL query to get the average rating of reviews for a specific product

        const adminstars = await productReview.findOne({
          where: {
            product_id: product_id,
            admin_rating: {
              [Op.ne]: 0,
            },
          },
        });

        if (adminstars) {
          if (adminstars) {
            data.dataValues.average_rating = adminstars.dataValues.admin_rating;
          }
        } else {
          const query = `
                        SELECT product_id, AVG(rating) AS average_rating ,COUNT(*) AS total_reviews
                        FROM productreviews
                        WHERE product_id = :product_id AND admin_rating = 0
                        GROUP BY product_id;
                      `;

          // Execute the raw SQL query
          const [results, metadata] = await sequelize.query(query, {
            replacements: { product_id },
            type: sequelize.QueryTypes.SELECT,
          });

          if (results) {
            data.dataValues.average_rating = results.average_rating;
            data.dataValues.total_reviews = results.total_reviews;
          } else {
            data.dataValues.average_rating = 0;
            data.dataValues.total_reviews = 0;
          }
        }

        const comment = await productReview.findAll({
          where: {
            product_id: product_id,
          },
          attributes: ["user_id", "review_text"],
        });

        for (let i = 0; i < comment.length; i++) {
          //  console.log(comment[i].dataValues.user_id);
          const userdata = await user.findOne({
            where: {
              user_id: comment[i].dataValues.user_id,
            },
            attributes: [
              "user_first_name",
              "user_last_name",
              "user_profile_photo",
            ],
          });

          if (userdata.dataValues.user_profile_photo) {
            let imagelink = `${req.protocol}://${req.get(
              "host"
            )}/src/images/profileimage/${
              userdata.dataValues.user_profile_photo
            }`;
            userdata.dataValues.imagelink = userdata.dataValues
              .user_profile_photo
              ? imagelink
              : "";
          }else{
            userdata.dataValues.imagelink = "";
          }
          comment[i].dataValues.user_data = userdata ? userdata : "";
        }
        /////   product for sale or not
        if (data.dataValues.is_active === false) {
          data.dataValues.for_sale = "OUT OF STOCK";
        }

        if (comment) {
          data.dataValues.taxt_comment = comment;
        } else {
          data.dataValues.taxt_comment = comment;
        }

        // if (results) {
        //   data.dataValues.average_rating = results.average_rating;
        // } else {
        //   data.dataValues.average_rating = 0;
        // }
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }

      await product.update(
        {
          product_view: data.dataValues.product_view + 1,
        },
        {
          where: { product_id: product_id },
        }
      );
      if(data.dataValues.product_video){
        let videolink = `${req.protocol}://${req.get(
          "host"
        )}/src/images/productVideo/${data.dataValues.product_video}`;
        data.dataValues.videolink = data.dataValues.product_video
          ? videolink
          : "";
      }else{
        data.dataValues.videolink = "";
      }

      const data1 = await productImage.findAll({
        where: { product_id: product_id },
        attributes: ["productImage_id", "product_id", "image"],
      });
      if(data1){
        for (let i = 0; i < data1.length; i++) {
          if(data1[i].dataValues.image){
            let imagelink = `${req.protocol}://${req.get(
              "host"
            )}/src/images/productImage/${data1[i].dataValues.image}`;
            data1[i].dataValues.imagelink = data1[i].dataValues.image
              ? imagelink
              : "";
          }else{
            data1[i].dataValues.imagelink = "";
          }
        }
      }

      data.dataValues.OtherImages = data1;

      if (data) {
        return res.status(200).json({ status: 1, msg: "Done.", data: data });
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }
    } else {
      // Raw SQL query to count the number of products grouped by product_id

      const bestSellingQuery = `
              WITH best_selling_products AS (
                SELECT p.*, COUNT(ot.product_id) AS product_count
                FROM products p
                LEFT JOIN ordertrns ot ON p.product_id = ot.product_id
                WHERE p.admin_bestselling = 1
                GROUP BY p.product_id
                LIMIT 8
              )
              SELECT * FROM best_selling_products;
            `;

      const topSellingQuery = `
              WITH top_selling_products AS (
                SELECT p.*, COUNT(ot.product_id) AS product_count 
                FROM products p
                LEFT JOIN ordertrns ot ON p.product_id = ot.product_id
                WHERE p.admin_bestselling != 1
                GROUP BY p.product_id
                ORDER BY product_count DESC
                LIMIT 8
              )
              SELECT * FROM top_selling_products;
            `;

      const [bestSellingProducts] = await sequelize.query(bestSellingQuery);

      let combinedProducts = bestSellingProducts;

      if (combinedProducts.length < 8) {
        const [topSellingProducts] = await sequelize.query(topSellingQuery);
        combinedProducts = combinedProducts.concat(
          topSellingProducts.slice(0, 8 - combinedProducts.length)
        );
      }

      // // Execute the raw SQL query
      // const [results, metadata] = await sequelize.query(query);
      // console.log(results);
      // return;

      for (let i = 0; i < combinedProducts.length; i++) {
        ///// get avg rating
        const product_id = combinedProducts[i].product_id;
        // Raw SQL query to get the average rating of reviews for a specific product
        const query = `
                           SELECT product_id, AVG(rating) AS average_rating, COUNT(*) AS total_reviews
                           FROM productreviews
                           WHERE product_id = :product_id
                           GROUP BY product_id;
                         `;

        // Execute the raw SQL query
        const [results1, metadata] = await sequelize.query(query, {
          replacements: { product_id },
          type: sequelize.QueryTypes.SELECT,
        });
        if (results1) {
          combinedProducts[i].average_rating = results1.average_rating;
          combinedProducts[i].total_reviews = results1.total_reviews;
        } else {
          combinedProducts[i].average_rating = 0;
          combinedProducts[i].total_reviews = 0;
        }

        if(combinedProducts[i].product_video){
          let videolink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productVideo/${combinedProducts[i].product_video}`;
          combinedProducts[i].videolink = combinedProducts[i].product_video
            ? videolink
            : "";
        }else{
          combinedProducts[i].videolink = "";
        }
        combinedProducts[i].videolink = combinedProducts[i].product_video
        ? videolink
        : "";
        const data1 = await productImage.findOne({
          where: { product_id: combinedProducts[i].product_id },
          attributes: ["image"],
        });

        if (data1) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${data1.dataValues.image}`;
          combinedProducts[i].imagelink = data1.dataValues.image
            ? imagelink
            : "";
        } else {
          combinedProducts[i].imagelink = "";
        }
      }

      if (combinedProducts) {
        return res
          .status(200)
          .json({ status: 1, msg: "Done.", data: combinedProducts });
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
}; 

///// get all TopView
const getTopView = async (req, res) => {
  const userData = req.body;
  const product_id = userData.product_id;
  try {
    if (product_id != 0) {
      const data = await product.findOne({
        where: { product_id: product_id, is_active: 1 },
      });
      if (data) {
        ///// get avg rating
        const product_id = data.dataValues.product_id;
        // Raw SQL query to get the average rating of reviews for a specific product

        const adminstars = await productReview.findOne({
          where: {
            product_id: product_id,
            admin_rating: {
              [Op.ne]: 0,
            },
          },
        });

        if (adminstars) {
          if (adminstars) {
            data.dataValues.average_rating = adminstars.dataValues.admin_rating;
          }
        } else {
          const query = `
                        SELECT product_id, AVG(rating) AS average_rating ,COUNT(*) AS total_reviews
                        FROM productreviews
                        WHERE product_id = :product_id AND admin_rating = 0
                        GROUP BY product_id;
                      `;

          // Execute the raw SQL query
          const [results, metadata] = await sequelize.query(query, {
            replacements: { product_id },
            type: sequelize.QueryTypes.SELECT,
          });

          if (results) {
            data.dataValues.average_rating = results.average_rating;
            data.dataValues.total_reviews = results.total_reviews;
          } else {
            data.dataValues.average_rating = 0;
            data.dataValues.total_reviews = 0;
          }
        }

        const comment = await productReview.findAll({
          where: {
            product_id: product_id,
          },
          attributes: ["user_id", "review_text"],
        });

        for (let i = 0; i < comment.length; i++) {
          //  console.log(comment[i].dataValues.user_id);
          const userdata = await user.findOne({
            where: {
              user_id: comment[i].dataValues.user_id,
            },
            attributes: [
              "user_first_name",
              "user_last_name",
              "user_profile_photo",
            ],
          });

          if (userdata.dataValues.user_profile_photo) {
            let imagelink = `${req.protocol}://${req.get(
              "host"
            )}/src/images/profileimage/${
              userdata.dataValues.user_profile_photo
            }`;
            userdata.dataValues.imagelink = userdata.dataValues
              .user_profile_photo
              ? imagelink
              : "";
          }else{
            userdata.dataValues.imagelink = "";
          }
          comment[i].dataValues.user_data = userdata ? userdata : "";
        }

        /////  product for sale or not
        if (data.dataValues.is_active === false) {
          data.dataValues.for_sale = "OUT OF STOCK";
        }

        if (comment) {
          data.dataValues.taxt_comment = comment;
        } else {
          data.dataValues.taxt_comment = comment;
        }

        // if (results) {
        //   data.dataValues.average_rating = results.average_rating;
        // } else {
        //   data.dataValues.average_rating = 0;
        // }
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }

      await product.update(
        {
          product_view: data.dataValues.product_view + 1,
        },
        {
          where: { product_id: product_id },
        }
      );
      if(data.dataValues.product_video){
        let videolink = `${req.protocol}://${req.get(
          "host"
        )}/src/images/productVideo/${data.dataValues.product_video}`;
        data.dataValues.videolink = data.dataValues.product_video
          ? videolink
          : "";
      }else{
        data.dataValues.videolink = "";
      }

      const data1 = await productImage.findAll({
        where: { product_id: product_id },
        attributes: ["productImage_id", "product_id", "image"],
      });
      if(data1){
        for (let i = 0; i < data1.length; i++) {
          if(data1[i].dataValues.image){
            let imagelink = `${req.protocol}://${req.get(
              "host"
            )}/src/images/productImage/${data1[i].dataValues.image}`;
            data1[i].dataValues.imagelink = data1[i].dataValues.image
              ? imagelink
              : "";
          }else{
            data1[i].dataValues.imagelink = "";
          }
        }
      }

      data.dataValues.OtherImages = data1;

      if (data) {
        return res.status(200).json({ status: 1, msg: "Done.", data: data });
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }
    } else {
      // Raw SQL query to count the number of products grouped by product_id

      const bestViewQuery = `
                  SELECT p.*
                  FROM products p
                  WHERE p.admin_topview = 1
                  ORDER BY p.product_view DESC
                  LIMIT 8
    `;

      const topViewQuery = `
                  SELECT p.*
                  FROM products p
                  WHERE p.admin_topview != 1
                  ORDER BY p.product_view DESC
                  LIMIT 8 
    `;

      const [bestViewProducts] = await sequelize.query(bestViewQuery);

      let combinedProducts = bestViewProducts;

      if (combinedProducts.length < 8) {
        const [topViewProducts] = await sequelize.query(topViewQuery);
        combinedProducts = combinedProducts.concat(
          topViewProducts.slice(0, 8 - combinedProducts.length)
        );
      }
      // console.log(combinedProducts);
      // return;

      for (let i = 0; i < combinedProducts.length; i++) {
        ///// get avg rating
        const product_id = combinedProducts[i].product_id;
        // Raw SQL query to get the average rating of reviews for a specific product
        const query = `
                           SELECT product_id, AVG(rating) AS average_rating, COUNT(*) AS total_reviews
                           FROM productreviews
                           WHERE product_id = :product_id
                           GROUP BY product_id;
                         `;

        // Execute the raw SQL query
        const [results1, metadata] = await sequelize.query(query, {
          replacements: { product_id },
          type: sequelize.QueryTypes.SELECT,
        });
        if (results1) {
          combinedProducts[i].average_rating = results1.average_rating;
          combinedProducts[i].total_reviews = results1.total_reviews;
        } else {
          combinedProducts[i].average_rating = 0;
          combinedProducts[i].total_reviews = 0;
        }

        if(combinedProducts[i].product_video){
          let videolink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productVideo/${combinedProducts[i].product_video}`;
          combinedProducts[i].videolink = combinedProducts[i].product_video
            ? videolink
            : "";
        }
        const data1 = await productImage.findOne({
          where: { product_id: combinedProducts[i].product_id },
          attributes: ["image"],
        });
        if (data1) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${data1.dataValues.image}`;
          combinedProducts[i].imagelink = data1.dataValues.image
            ? imagelink
            : "";
        } else {
          combinedProducts[i].imagelink = "";
        }
      }

      if (combinedProducts) {
        return res
          .status(200)
          .json({ status: 1, msg: "Done.", data: combinedProducts });
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

///// add review on product
const reviewInsUp = async (req, res) => {
  const userData = req.body;
  // console.log(userData);
  // return
  try {
    if (
      userData.user_detail.user_id == userData.user_id &&
      userData.user_detail.is_admin == false
    ) {
    } else {
      return res
        .status(200)
        .json({ status: 0, msg: "you not able to add comment!" });
    }

    const findOneReview = await productReview.findOne({
      where: {
        [Op.and]: [
          { product_id: userData.product_id },
          { user_id: userData.user_id },
        ],
      },
      attributes: [
        "review_id",
        "product_id",
        "user_id",
        "rating",
        "review_text",
      ],
    });
    if (findOneReview) {
      if (findOneReview.dataValues.review_id != 0) {
        const updatedReview = await productReview.update(
          {
            product_id: userData.product_id,
            user_id: userData.user_id,
            rating: userData.rating,
            review_text: userData.review_text,
            updated_date: Date.now(),
          },
          {
            where: { review_id: findOneReview.dataValues.review_id },
          }
        );

        if (updatedReview === 0) {
          return res.status(404).json({ message: "Review Not Found!" });
        } else {
          return res
            .status(200)
            .send({ status: 1, msg: "Review Updated Successfully." });
        }
      }
    } else {
      const newReview = await productReview.create({
        product_id: userData.product_id,
        user_id: userData.user_id,
        rating: userData.rating,
        review_text: userData.review_text,
        created_date: Date.now(),
        updated_date: Date.now(),
      });

      if (newReview) {
        return res
          .status(200)
          .send({ status: 1, msg: "Review Insert Successfull." });
      } else {
        return res.status(200).send({ status: 0, msg: "Review Not Insert!" });
      }
    }
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(200)
        .json({ status: 0, message: "Product Name Already Exists!" });
    } else {
      return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
    }
  }
};



///// add emails and images handling

const subscriptionimageFill = async (req, res) => {
  const userData = req.body;
  try {
    // if (
    //   userData.user_detail.is_admin === 1 ||
    //   userData.user_detail.is_admin === true
    // ) {
    // } else {
    //   return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    // }
    const data = await image.findOne({
      where: {
        image_type: 5,
      },
    });
    if (data.dataValues.images) {
      let imagelink = `${req.protocol}://${req.get(
        "host"
      )}/src/images/header&footerImages/${data.dataValues.images}`;
      data.dataValues.imagelink = data.dataValues.images ? imagelink : "";
    }

    if (data) {
      return res.status(200).json({ status: 1, msg: "Done.", data: data });
    } else {
      return res.status(404).json({ status: 0, msg: "Images Not Found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const subscriptionEmail= async (req, res) => {
  const userData = req.body;
  // console.log(userData);
  // return
  try {

    if (userData.user_email) {
      const email = await subscriptionemail.findOne({
        where: {
            user_email: userData.user_email,
        }
    })
      if (!email) {
      } else {
        return res
          .status(200)
          .send({ status: 0, msg: "You have Already Subscribed!" });
      }
    } else {
      return res.status(200).send({ status: 0, msg: "Please Enter Email!" });
    }

    const NewEmailadd = await subscriptionemail.create(
      {
        user_email: userData.user_email,
        created_date: Date.now(),
        updated_date: Date.now(),
      });

    if (NewEmailadd) {
          return res
          .status(200)
          .send({ status: 1, msg: "Subscription email add successfull." });
        } else {
          return res
            .status(200)
            .send({ status: 1, msg: "Email not add!" });
        }
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: error.toString() });
  }
};


module.exports = {
  productGet,
  // charmGet,
  couponCardFill,
  categoryFill,
  productFillByCategory,
  testimonialsFill,
  getBestSeller,
  getTopView,
  reviewInsUp,
  headerimagesFill,
  headerimageoneFill,
  headerimagetwoFill,
  footerimageFill,
  subscriptionimageFill,
  subscriptionEmail,
  footerContactPage,
};
