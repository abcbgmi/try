const db = require("../configs/db.js");
const user = db.user;
const product = db.product;
const productImage = db.productImages;
const charm = db.charm;
const image = db.image;
const color = db.color;
const orderstatus = db.orderStatus;
const couponCard = db.couponCard;
const order = db.order;
const orderTrn = db.orderTrn;
const category = db.category;
const subscriptionemail = db.subscriptionemail;
const productReview = db.productReview;
const contactPage = db.contactPage;
const commonValidation = require("../validation/common_validation.js");
const uploadImages = require("../utils/file_upload_function.js");
const CONFIG = require("../configs/config.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const val = require("../validation/admin_validation.js");
const sequelize = db.sequelize;
const { QueryTypes, where } = require("sequelize");
const { Op } = require("sequelize");
const e = require("express");

///// Admin register
const handleAdminSingUp = async (req, res) => {
  const requestData = req.body;
  try {
    // const finduser = await user.findOne({
    //     where: {
    //         user_email: requestData.user_email
    //     }
    // })
    // if (requestData.user_password === requestData.user_confirm_password) {
    // } else {
    //   return res
    //     .status(200)
    //     .send({ status: 0, msg: "Password and Confirm-Password Don't Match!" });
    // }

    if (requestData) {
      const password = await bcrypt.hash(requestData.user_password, 10);
      if (requestData.user_email) {
        const email = await commonValidation.isUserExistWithEmail(
          requestData.user_email
        );
        if (email) {
        } else {
          return res
            .status(200)
            .send({ status: 0, msg: "Email Already Exist!" });
        }
      } else {
        return res.status(200).send({ status: 0, msg: "Please Enter Email!" });
      }
      const users = await user.create({
        user_first_name: requestData.user_first_name,
        user_last_name: requestData.user_last_name,
        user_email: requestData.user_email,
        user_mobile_no: requestData.user_mobile_no,
        is_admin: 1,
        user_password: password,
        created_date: Date.now(),
        updated_date: Date.now(),
      });

      const unique_id = users.user_id;
      const u_tokens = jwt.sign(unique_id, CONFIG.secret_key);

      await user.update(
        {
          user_token: u_tokens,
        },
        {
          where: {
            user_id: users.user_id,
          },
        }
      );

      var isUpdated = await updateAuthToken(unique_id);

      if (!isUpdated) {
        return res
          .status(200)
          .send({ status: 0, msg: "Fail To Update Auth Token!" });
      }

      const userdata = await user.findOne({
        where: {
          user_id: users.user_id,
        },
        attributes: ["auth_token"],
      });

      if (userdata) {
        return res
          .status(200)
          .send({ status: 1, msg: "Register Successfull." });
      } else {
        return res.status(200).send({ status: 0, msg: "Fail to Register!" });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

/////////Admin signin
const handleUserSingIn = async (req, res) => {
  const requestData = req.body;
  console.log(requestData);
  try {
    const finduser = await user.findOne({
      where: {
        user_email: requestData.user_email,
      },
    });

    if (!finduser) {
      return res
        .status(200)
        .send({ status: 0, msg: "Please Check Email First!" });
    }

    // if(requestData.user_password === requestData.user_confirm_password){}
    // else{return res.status(200).send({ status: 0, msg: "Password and Confirm-Password Don't Match!"});}

    // if (!finduser) {
    //     const password = await bcrypt.hash(requestData.user_password, 10);
    //     if (requestData.user_email) {
    //         const email = await commonValidation.isUserExistWithEmail(requestData.user_email);
    //         if (email) { } else {
    //             return res.status(200).send({ status: 0, msg: "Email Already Exist!"});
    //         }
    //     } else {
    //         return res.status(200).send({ status: 0, msg: "Please Enter Email!"});
    //     }
    //     const users = await user.create({
    //         user_first_name: requestData.user_first_name,
    //         user_last_name: requestData.user_last_name,
    //         user_email: requestData.user_email,
    //         user_mobile_no: requestData.user_mobile_no,
    //         user_password: password,
    //         created_date: Date.now(),
    //         updated_date: Date.now()
    //     })

    //     const unique_id = users.user_id;
    //     const u_tokens = jwt.sign(unique_id, CONFIG.secret_key)

    //     await user.update({
    //         user_token: u_tokens

    //     }, {
    //         where: {
    //             user_id: users.user_id
    //         }
    //     })

    //     var isUpdated = await updateAuthToken(unique_id);

    //     if (!isUpdated) {
    //         return res.status(200).send({ status: 0, msg: "Fail To Update Auth Token!"});
    //     }

    //     const userdata = await user.findOne({
    //         where: {
    //             user_token: u_tokens
    //         },
    //         attributes: ["user_first_name","user_last_name","user_email","user_mobile_no", "user_password", "user_token", "auth_token"]
    //     })

    //     if (userdata) {
    //         return res.status(200).send({ status: 1, msg: "Register Successfull.", data: userdata });
    //     } else {
    //         return res.status(200).send({ status: 0, msg: "Fail to Register!", data:[]});
    //     }
    // }

    if (finduser.is_deleted == 0) {
      const password = await bcrypt.compare(
        requestData.user_password,
        finduser.user_password
      );
      if (!password) {
        return res.status(200).send({ status: 0, msg: "Wrong Password!" });
      }

      var isUpdated = await updateAuthToken(finduser.user_id);
      await user.update(
        { is_logged_out: 0, is_active: 1 },
        {
          where: {
            user_token: finduser.user_token,
          },
        }
      );
      if (!isUpdated) {
        return res
          .status(200)
          .send({ status: 0, msg: "Fail to Update Auth Token!" });
      }

      const userdata = await user.findOne({
        where: {
          user_token: finduser.user_token,
        },
        attributes: [
          "user_id",
          "user_first_name",
          "user_last_name",
          "user_email",
          "user_mobile_no",
          "is_admin",
          "user_token",
          "auth_token",
        ],
      });
      if (userdata) {
        return res
          .status(200)
          .send({ status: 1, msg: "Admin Login Successfull.", data: userdata });
      } else {
        return res.status(200).send({ status: 0, msg: "Fail to Login!" });
      }
    } else {
      return res
        .status(200)
        .send({ status: 0, msg: "User Not Exist Please Register First!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

///// product
const productInsUp = async (req, res) => {
  const userData = req.body;
  try {
    const { value, error } = val.productInsUp.validate(userData);
    const valid = error == null;
    if (valid) {
    } else {
      const { details } = error;
      const message = details
        .map((i) => i.message)
        .join(",")
        .replace(/"/g, "");
      console.log("error", message);
      return res.status(422).json({ status: 0, msg: message });
    }

    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }
    const {
      product_id,
      product_video,
      product_price,
      product_discount,
      product_modify_object,
      ...rest
    } = value;

    let video;
    const product_discount_price = product_price - product_discount;
    if (product_id != 0) {
      const productData = await product.findOne({
        where: {
          product_id: product_id,
        },
      });

      if (!productData) {
        return res
          .status(200)
          .json({ status: 0, message: "Product Not Found!" });
      }

      if (req.files.video) {
        const folderPath = "./src/Images/productVideo/";
        const random = Math.floor(Math.random() * 10000000);
        var file_name = `${product_id}_${random}_${product_id}.mp4`;
        var P_Video = await uploadImages.uploadImageToFolder(
          req.files.video[0].buffer,
          file_name,
          folderPath
        );
        fs.unlink(`./src/Images/productVideo/${product_video}`, (err) => {});
      }

      if (P_Video) {
        video = file_name;
      } else {
        video = product_video;
      }

      const updatedProduct = await product.update(
        {
          ...rest,
          product_price: product_price,
          product_discount: product_discount,
          product_discount_price: product_discount_price,
          product_modify_object: JSON.parse(product_modify_object),
          product_video: video,
          updated_date: Date.now(),
        },
        {
          where: { product_id: product_id },
        }
      );

      if (updatedProduct === 0) {
        return res.status(404).json({ message: "Product Not Found!" });
      }

      if (req.files.otherImages) {
        const data = await productImage.findAll({
          where: {
            product_id: product_id,
          },
        });
        for (let i = 0; i < data.length; i++) {
          fs.unlink(
            `./src/Images/productImage/${data[i].dataValues.image}`,
            (err) => {}
          );
        }
        await productImage.destroy({
          where: {
            product_id: product_id,
          },
        });
        for (let i = 0; i < req.files.otherImages.length; i++) {
          const folderPath = "./src/Images/productImage/";
          const random = Math.floor(Math.random() * 10000000);
          var file_name = `${product_id}_${random}_${product_id}.png`;
          var OImage = await uploadImages.uploadImageToFolder(
            req.files.otherImages[i].buffer,
            file_name,
            folderPath
          );
          if (OImage) {
            await productImage.create({
              product_id: product_id,
              image: file_name,
              created_date: Date.now(),
              updated_date: Date.now(),
            });
          }
        }
      }
      return res
        .status(200)
        .send({ status: 1, msg: "Product Updated Successfully." });
    } else {
      const product_discount_price = product_price - product_discount;
      const newProduct = await product.create({
        ...rest,
        product_price: product_price,
        product_discount: product_discount,
        product_discount_price: product_discount_price,
        product_modify_object: product_modify_object,
        created_date: Date.now(),
        updated_date: Date.now(),
      });

      if (req.files.video) {
        const folderPath = "./src/Images/productVideo/";
        const random = Math.floor(Math.random() * 10000000);
        var file_name = `${newProduct.product_id}_${random}_${newProduct.product_id}.mp4`;
        var PVideo = await uploadImages.uploadImageToFolder(
          req.files.video[0].buffer,
          file_name,
          folderPath
        );
      }
      if (PVideo) {
        video = file_name;
      } else {
        video = product_video;
      }
      const updatedproduct = await product.update(
        {
          product_video: video,
          updated_date: Date.now(),
        },
        {
          where: { product_id: newProduct.product_id },
        }
      );

      if (updatedproduct === 0) {
        return res.status(404).json({ message: "Product Not Found" });
      }

      if (req.files.otherImages) {
        for (let i = 0; i < req.files.otherImages.length; i++) {
          const folderPath = "./src/Images/productImage/";
          const random = Math.floor(Math.random() * 10000000);
          var file_name = `${newProduct.product_id}_${random}_${newProduct.product_id}.png`;
          var PImage = await uploadImages.uploadImageToFolder(
            req.files.otherImages[i].buffer,
            file_name,
            folderPath
          );
          if (PImage) {
            await productImage.create({
              product_id: newProduct.product_id,
              image: file_name,
              created_date: Date.now(),
              updated_date: Date.now(),
            });
          }
        }
      }
      return res
        .status(200)
        .send({ status: 1, msg: "Product Insert Successfull." });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(200)
        .json({ status: 0, message: "Product Name Already Exists!" });
    } else {
      return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
    }
  }
};

const productFill = async (req, res) => {
  const userData = req.body;
  const product_id = userData.product_id;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }
    if (product_id != 0) {
      const data = await product.findOne({ where: { product_id: product_id } });
      if (data) {
      } else {
        return res
          .status(200)
          .json({ status: 0, message: "Product Not Found!" });
      }
      const categorydata = await category.findOne({
        where: {
          category_id: data.dataValues.product_category,
        },
      });
      if (categorydata) {
        data.dataValues.product_category_name =
          categorydata.dataValues.category_name;
      }
      if (data) {
        ///// get avg rating
        const product_id = data.dataValues.product_id;
        // Raw SQL query to get the average rating of reviews for a specific product
        const query = `
                        SELECT product_id, AVG(rating) AS average_rating, COUNT(*) AS review_count 
                        FROM productreviews
                        WHERE product_id = :product_id
                        GROUP BY product_id;
                      `;

        // Execute the raw SQL query
        const [results, metadata] = await sequelize.query(query, {
          replacements: { product_id },
          type: sequelize.QueryTypes.SELECT,
        });
        if (results) {
          data.dataValues.average_rating = results.average_rating;
          data.dataValues.review_count = results.review_count;
          data.dataValues.review_text = results.review_text;
        } else {
          data.dataValues.average_rating = 0;
          data.dataValues.review_count = 0;
          data.dataValues.review_text = [];
        }
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }
      
      if (data.dataValues.product_video) {
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
      if (data1) {
        for (let i = 0; i < data1.length; i++) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${data1[i].dataValues.image}`;
          data1[i].dataValues.imagelink = data1[i].dataValues.image
            ? imagelink
            : "";
        }
      }
      data.dataValues.OtherImages = data1;
      if (data) {
        return res.status(200).json({ status: 1, msg: "Done.", data: data });
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }
    } else {
      const datas = await product.findAll({
        order: [
          ['product_id', 'DESC']
        ]
      });
      for (let i = 0; i < datas.length; i++) {
        const categorydata = await category.findOne({
          where: {
            category_id: datas[i].dataValues.product_category,
          },
        });
        if (categorydata) {
          datas[i].dataValues.product_category_name =
            categorydata.dataValues.category_name;
        }

        ///// get avg rating
        const product_id = datas[i].dataValues.product_id;
        // Raw SQL query to get the average rating of reviews for a specific product
        const query = `
                        SELECT product_id, AVG(rating) AS average_rating, COUNT(*) AS review_count
                        FROM productreviews
                        WHERE product_id = :product_id
                        GROUP BY product_id;
                      `;

        // Execute the raw SQL query
        const [results, metadata] = await sequelize.query(query, {
          replacements: { product_id },
          type: sequelize.QueryTypes.SELECT,
        });
        if (results) {
          datas[i].dataValues.average_rating = results.average_rating;
          datas[i].dataValues.review_count = results.review_count;
        } else {
          datas[i].dataValues.average_rating = 0;
          datas[i].dataValues.review_count = 0;
        }

        if (datas[i].dataValues.product_video) {
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
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }
    if (product_id != 0 && product_category != 0) {
      const data = await product.findOne({
        where: { product_id: product_id, product_category: product_category },
      });
      if (data) { 
        ///// get avg rating
        const product_id = data.dataValues.product_id;
        // Raw SQL query to get the average rating of reviews for a specific product
        const query = `
                          SELECT product_id, AVG(rating) AS average_rating, COUNT(*) AS review_count,review_text 
                          FROM productreviews
                          WHERE product_id = :product_id
                          GROUP BY product_id;
                        `;

        // Execute the raw SQL query
        const [results, metadata] = await sequelize.query(query, {
          replacements: { product_id },
          type: sequelize.QueryTypes.SELECT,
        });
        if (results) {
          data.dataValues.average_rating = results.average_rating;
          data.dataValues.review_count = results.review_count;
          data.dataValues.review_text = results.review_text;
        } else {
          data.dataValues.average_rating = 0;
          data.dataValues.review_count = 0;
          data.dataValues.review_text = [];
        }
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }
      if (data.dataValues.product_video) {
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
      if (data1) {
        for (let i = 0; i < data1.length; i++) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${data1[i].dataValues.image}`;
          data1[i].dataValues.imagelink = data1[i].dataValues.image
            ? imagelink
            : "";
        }
        data.dataValues.OtherImages = data1;
      }
      if (data) {
        return res.status(200).json({ status: 1, msg: "Done.", data: data });
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }
    } else {
      const datas = await product.findAll({
        attributes: {
          exclude: ["is_deleted", "created_date", "updated_date"],
        },
        where: {
          product_category: product_category,
        },
        order: [
          ['product_id', 'DESC']
               ]
      });
      if (datas) {
        for (let i = 0; i < datas.length; i++) {
          ///// get avg rating
          const product_id = datas[i].dataValues.product_id;
          // Raw SQL query to get the average rating of reviews for a specific product
          const query = `
                                  SELECT product_id, AVG(rating) AS average_rating, COUNT(*) AS review_count
                                  FROM productreviews
                                  WHERE product_id = :product_id
                                  GROUP BY product_id;
                                `;
  
          // Execute the raw SQL query
          const [results, metadata] = await sequelize.query(query, {
            replacements: { product_id },
            type: sequelize.QueryTypes.SELECT,
          });
          if (results) {
            datas[i].dataValues.average_rating = results.average_rating;
            datas[i].dataValues.review_count = results.review_count;
          } else {
            datas[i].dataValues.average_rating = 0;
            datas[i].dataValues.review_count = 0;
          }
  
          if (datas[i].dataValues.product_video) {
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
          return res.status(200).json({ status: 1, msg: "Done.", data: datas });
      }else{
        return res.status(404).json({ status: 0, msg: "Product Data Not Found!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const productDelete = async (req, res) => {
  const userData = req.body;
  const product_id = userData.product_id;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }
    const ProductToDelete = await product.findByPk(product_id);

    if (!ProductToDelete) {
      return res.status(200).json({ status: 0, msg: "Product Not Found" });
    }
    if (ProductToDelete.product_video) {
      fs.unlink(
        `./src/Images/productVideo/${ProductToDelete.product_video}`,
        (err) => {}
      );
    }
    const data = await productImage.findAll({
      where: {
        product_id: product_id,
      },
    });
    if (data) {
      for (let i = 0; i < data.length; i++) {
        fs.unlink(
          `./src/Images/productImage/${data[i].dataValues.image}`,
          (err) => {}
        );
      }
      await productImage.destroy({
        where: {
          product_id: product_id,
        },
      });
    }

    await ProductToDelete.destroy();

    return res
      .status(200)
      .json({ status: 1, msg: "Product Deleted Successfully." });
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error" });
  }
};

const productActiveDeactive = async (req, res) => {
  const data = req.body;
  try {
    if (data.user_detail.is_admin === 1 || data.user_detail.is_admin === true) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }
    const productstatus = await product.findByPk(data.product_id);

    if (!productstatus) {
      return res.status(200).json({ status: 0, msg: "Product Not Found!" });
    } else {
      const updatedproduct = await product.update(
        {
          is_active: data.status,
          updated_date: Date.now(),
        },
        {
          where: { product_id: data.product_id },
        }
      );
      if (updatedproduct) {
        if (data.status === 1) {
          return res
            .status(200)
            .json({ status: 1, msg: "Product Activate Successfully." });
        } else {
          return res
            .status(200)
            .json({ status: 1, msg: "Product DeActivate Successfully." });
        }
      } else {
        return res
          .status(200)
          .json({ status: 1, msg: "Product Status Update UnSuccessfull!" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

///// category
const categoryInsupd = async (req, res) => {
  const userData = req.body;
  // console.log(userData);
  // console.log(req.files); n
  // return 
  try {   
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const { value, error } = val.categoryInsupd.validate(userData);
    const valid = error == null;
    if (valid) {
    } else {
      const { details } = error;
      const message = details
        .map((i) => i.message)
        .join(",")
        .replace(/"/g, "");
      console.log("error", message);
      return res.status(422).json({ status: 0, msg: message });
    }

    if (value.category_id != 0) {
      const categorydata = await category.findOne({
        where: {
          category_id: value.category_id,
        },
      });
      if (categorydata) {
      } else {
        return res
          .status(200)
          .json({ status: 0, msg: "Category Data Not Found!" });
      }

      if (categorydata.dataValues.category_image) {
          fs.unlink(
          `./src/Images/categoryImage/${categorydata.dataValues.category_image}`,
          (err) => {}
        );
      }
      if (categorydata.dataValues.category_banner_image) {
              fs.unlink(
        `./src/Images/categoryImage/${categorydata.dataValues.category_banner_image}`,
        (err) => {}
          );
          }

      let image;
      let bannerimage;

      // if (req.files.image) {
      //   const folderPath = "./src/Images/categoryImage/";
      //   const random = Math.floor(Math.random() * 10000000);
      //   var file_name = `${value.category_id}_${random}_${value.category_id}.png`;
      //   var P_Image = await uploadImages.uploadImageToFolder(
      //     req.files.image[0].buffer,
      //     file_name,
      //     folderPath
      //   );
      //   fs.unlink(
      //     `./src/Images/categoryImage/${value.category_image}`,
      //     (err) => {}
      //   );
      //   if (P_Image) {
      //     image = file_name;
      //   }
      // } else {
      //   image = value.category_image;
      // }

      // if (req.files.banner_image) {
      //   const folderPath = "./src/Images/categoryImage/";
      //   const random = Math.floor(Math.random() * 10000000);
      //   var file_name = `${value.category_id}_${random}_${value.category_id}.png`;
      //   var b_Image = await uploadImages.uploadImageToFolder(
      //     req.files.banner_image[0].buffer,
      //     file_name,
      //     folderPath
      //   );
      //   fs.unlink(
      //     `./src/Images/categoryImage/${value.category_banner_image}`,
      //     (err) => {}
      //   );
      //   if (b_Image) {
      //     bannerimage = file_name;
      //   }
      // } else {
      //   bannerimage = value.category_image;
      // }

      if (req.files.image) {
        const folderPath = "./src/Images/categoryImage/";
        const random = Math.floor(Math.random() * 10000000);
        var file_name = `${value.category_id}_${random}_${value.category_id}.png`;
        var P_Image = await uploadImages.uploadImageToFolder(
          req.files.image[0].buffer,
          file_name,
          folderPath
        );
        if (P_Image) {
          image = file_name;
        }
      }

      if (req.files.banner_image) {
        const folderPath = "./src/Images/categoryImage/";
        const random = Math.floor(Math.random() * 10000000);
        var file_name = `${value.category_id}_${random}_${value.category_id}.png`;
        var b_Image = await uploadImages.uploadImageToFolder(
          req.files.banner_image[0].buffer,
          file_name,
          folderPath
        );
        if (b_Image) {
          bannerimage = file_name;
        }
      }

      const updatedCategory = await category.update(
        {
          category_name: userData.category_name,
          category_image: image,
          category_banner_image: bannerimage,
          is_active: userData.is_active,
          updated_date: Date.now(),
        },
        {
          where: { category_id: userData.category_id },
        }
      );
      if (updatedCategory === 0) {
        return res.status(200).json({ status: 0, msg: "Category Not Found!" });
      }
      return res
        .status(200)
        .send({ status: 1, msg: "Category Update Successfull." });
    } else {
      const categoryData = await category.findOne({
        where: {
          category_name: userData.category_name,
        },
      });
      if (categoryData) {
        return res.status(200).send({
          status: 0,
          msg: `'${userData.category_name}' Category Already Exists!`,
        });
      }

      const newCategory = await category.create({
        category_name: userData.category_name,
        created_date: Date.now(),
        updated_date: Date.now(),
      });

      let image;
      let bannerimage;
      if (req.files.image) {
        const folderPath = "./src/Images/categoryImage/";
        const random = Math.floor(Math.random() * 10000000);
        var file_name = `${newCategory.category_id}_${random}_${newCategory.category_id}.png`;
        var P_Image = await uploadImages.uploadImageToFolder(
          req.files.image[0].buffer,
          file_name,
          folderPath
        );
        if (P_Image) {
          image = file_name;
        }
      }

      if (req.files.banner_image) {
        const folderPath = "./src/Images/categoryImage/";
        const random = Math.floor(Math.random() * 10000000);
        var file_name = `${newCategory.category_id}_${random}_${newCategory.category_id}.png`;
        var b_Image = await uploadImages.uploadImageToFolder(
          req.files.banner_image[0].buffer,
          file_name,
          folderPath
        );
        if (b_Image) {
          bannerimage = file_name;
        }
      }

      await category.update(
        {
          category_image: image,
          category_banner_image: bannerimage,
        },
        {
          where: { category_id: newCategory.category_id },
        }
      );

      if (newCategory) {
        return res
          .status(200)
          .send({ status: 1, msg: "Category Insert Successfull." });
      } else {
        return res
          .status(200)
          .send({ status: 1, msg: "Fail to Insert Category!" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error" });
  }
};

const categoryDelete = async (req, res) => {
  const userData = req.body;
  const category_id = userData.category_id;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const categoryToDelete = await category.findByPk(category_id);

    if (categoryToDelete.dataValues.category_image) {
      fs.unlink(
        `./src/Images/categoryImage/${categoryToDelete.dataValues.category_image}`,
        (err) => {}
      );
    }
    if (categoryToDelete.dataValues.category_banner_image) {
      fs.unlink(
        `./src/Images/categoryImage/${categoryToDelete.dataValues.category_banner_image}`,
        (err) => {}
      );
    }

    if (!categoryToDelete) {
      return res.status(200).json({ status: 0, msg: "Category Not Found!" });
    } else {
      await categoryToDelete.destroy();
      return res
        .status(200)
        .json({ status: 1, msg: "Category Deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: "Internal server error" });
  }
};

const categoryFill = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const datas = await category.findAll({
      attributes: {
        exclude: ["is_deleted", "created_date", "updated_date"],
      },
    });

    if (datas) {
      for (let i = 0; i < datas.length; i++) {
        if (datas[i].dataValues.category_image) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/categoryImage/${datas[i].dataValues.category_image}`;
          datas[i].dataValues.imagelink = datas[i].dataValues.category_image
            ? imagelink
            : "";
        }else{
          datas[i].dataValues.imagelink = "";
        }
        if (datas[i].dataValues.category_banner_image) {
          let posterImagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/categoryImage/${datas[i].dataValues.category_banner_image}`;
          datas[i].dataValues.posterImagelink = datas[i].dataValues
            .category_banner_image
            ? posterImagelink
            : "";
        }else{
          datas[i].dataValues.posterImagelink =  "";
        }
      }
    }

    if (datas) {
      return res.status(200).json({ status: 1, msg: "Done.", data: datas });
    } else {
      return res.status(404).json({ status: 0, msg: "Category Not Found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const categoryActiveDeactive = async (req, res) => {
  const data = req.body;
  try {
    if (data.user_detail.is_admin === 1 || data.user_detail.is_admin === true) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const categorystatus = await category.findByPk(data.category_id);

    if (!categorystatus) {
      return res.status(200).json({ status: 0, msg: "Category Not Found!" });
    } else {
      const updatedCategory = await category.update(
        {
          is_active: data.status,
          updated_date: Date.now(),
        },
        {
          where: { category_id: data.category_id },
        }
      );
      if (updatedCategory) {
        if (data.status === 1) {
          return res
            .status(200)
            .json({ status: 1, msg: "Category Activate Successfully." });
        } else {
          return res
            .status(200)
            .json({ status: 1, msg: "Category DeActivate Successfully." });
        }
      } else {
        return res
          .status(200)
          .json({ status: 1, msg: "Category Status Update UnSuccessfull!" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

///// charms
const charmInsUp = async (req, res) => {
  const userData = req.body;
  const { charm_id, charm_name, ...rest } = userData;

  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const charmData = await charm.findOne({
      where: {
        charm_name: charm_name,
      },
    });
    if (charmData) {
      return res.status(200).send({
        status: 0,
        msg: `'${charm_name}' Charm Already Exists!`,
      });
    }

    if (charm_id != 0) {
      const updatedCharm = await charm.update(
        {
          ...rest,
          charm_name: charm_name,
          updated_date: Date.now(),
        },
        {
          where: { charm_id: charm_id },
        }
      );

      if (updatedCharm === 0) {
        return res.status(404).json({ message: "Charm Not Found!" });
      }
      return res
        .status(200)
        .send({ status: 1, msg: "Charm Updated Successfully." });
    } else {
      const newCharm = await charm.create({
        ...rest,
        charm_name: charm_name,
        created_date: Date.now(),
        updated_date: Date.now(),
      });

      if (newCharm) {
        return res
          .status(200)
          .send({ status: 1, msg: "Charm Insert Successfull." });
      } else {
        return res
          .status(200)
          .send({ status: 0, msg: "Charm Insert UnSuccessful!" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

const charmFill = async (req, res) => {
  const userData = req.body;
  const charm_id = userData.charm_id;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    if (charm_id != 0) {
      const datas = await charm.findOne({
        where: {
          charm_id: charm_id,
        },
      });
      if (datas) {
        return res.status(200).json({ status: 1, msg: "Done.", data: datas });
      } else {
        return res.status(404).json({ status: 0, msg: "Charm Not Found!" });
      }
    } else {
      const datas = await charm.findAll();
      if (datas) {
        return res.status(200).json({ status: 1, msg: "Done.", data: datas });
      } else {
        return res.status(404).json({ status: 0, msg: "Charm Not Found!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const charmDelete = async (req, res) => {
  const userData = req.body;
  const charm_id = userData.charm_id;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const charmToDelete = await charm.findByPk(charm_id);

    if (!charmToDelete) {
      return res.status(200).json({ status: 0, msg: "Charm Not Found!" });
    }
    await charmToDelete.destroy();

    return res
      .status(200)
      .json({ status: 1, msg: "Charm Deleted Successfully." });
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

const charmActiveDeactive = async (req, res) => {
  const data = req.body;
  try {
    if (data.user_detail.is_admin === 1 || data.user_detail.is_admin === true) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const charmstatus = await charm.findByPk(data.charm_id);

    if (!charmstatus) {
      return res.status(200).json({ status: 0, msg: "Charm Not Found!" });
    } else {
      const updatedCharm = await charm.update(
        {
          is_active: data.status,
          updated_date: Date.now(),
        },
        {
          where: { charm_id: data.charm_id },
        }
      );
      if (updatedCharm) {
        if (data.status === 1) {
          return res
            .status(200)
            .json({ status: 1, msg: "Charm Activate Successfully." });
        } else {
          return res
            .status(200)
            .json({ status: 1, msg: "Charm DeActivate Successfully." });
        }
      } else {
        return res
          .status(200)
          .json({ status: 1, msg: "Charm Status Update UnSuccessfull!" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

///// order status
const orderStatusInsUp = async (req, res) => {
  const userData = req.body;
  const { status_id, status_name, ...rest } = userData;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const statusData = await orderstatus.findOne({
      where: {
        status_name: status_name,
      },
    });
    if (statusData) {
      return res.status(200).send({
        status: 0,
        msg: `'${status_name}'Status Already Exists!`,
      });
    }

    if (status_id != 0) {
      const updatedstatus = await orderstatus.update(
        {
          ...rest,
          status_name: status_name,
          updated_date: Date.now(),
        },
        {
          where: { status_id: status_id },
        }
      );

      if (updatedstatus === 0) {
        return res.status(404).json({ message: "OrderStatus Not Found!" });
      }
      return res
        .status(200)
        .send({ status: 1, msg: "OrderStatus Updated Successfully." });
    } else {
      const newOrderSatatus = await orderstatus.create({
        ...rest,
        status_name: status_name,
        created_date: Date.now(),
        updated_date: Date.now(),
      });

      if (newOrderSatatus) {
        return res
          .status(200)
          .send({ status: 1, msg: "OrderStatus Insert Successfull." });
      } else {
        return res
          .status(200)
          .send({ status: 0, msg: "OrderStatus Insert UnSuccessful!" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

const orderStatusFill = async (req, res) => {
  const userData = req.body;
  const status_id = userData.status_id;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    if (status_id != 0) {
      const datas = await orderstatus.findOne({
        where: {
          status_id: status_id,
        },
      });
      if (datas) {
        return res.status(200).json({ status: 1, msg: "Done.", data: datas });
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "OrderStatus Not Found!" });
      }
    } else {
      const datas = await orderstatus.findAll();
      if (datas) {
        return res.status(200).json({ status: 1, msg: "Done.", data: datas });
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "OrderStatus Not Found!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const orderStatusDelete = async (req, res) => {
  const userData = req.body;
  const status_id = userData.status_id;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const statusToDelete = await orderstatus.findByPk(status_id);

    if (!statusToDelete) {
      return res.status(200).json({ status: 0, msg: "OrderStatus Not Found!" });
    }
    await statusToDelete.destroy();

    return res
      .status(200)
      .json({ status: 1, msg: "OrderStatus Deleted Successfully." });
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

///// couponcard
const couponCardInsUp = async (req, res) => {
  const userData = req.body;
  let image;

  var discount_code = Math.floor(100000 + Math.random() * 9000);
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    if (userData) {
      if (userData.discount_Amt) {
        userData.discount_per = 0.0;
      } else if (userData.discount_per) {
        userData.discount_Amt = 0.0;
      } else {
        return res.status(200).json({
          status: 0,
          message: "Please Fill any one discountAmt or discountper!",
        });
      }
    }

    const { value, error } = val.couponCardInsUp.validate(userData);
    const valid = error == null;
    if (valid) {
    } else {
      const { details } = error;
      const message = details
        .map((i) => i.message)
        .join(",")
        .replace(/"/g, "");
      console.log("error", message);
      return res.status(422).json({ status: 0, msg: message });
    }

    const { couponCard_id, couponCard_image, ...rest } = value;
    if (couponCard_id != 0) {
      if (req.file) {
        const folderPath = "./src/Images/couponCardImage/";
        const random = Math.floor(Math.random() * 10000000);
        var file_name = `${couponCard_id}_${random}_${couponCard_id}.png`;
        var G_Image = await uploadImages.uploadImageToFolder(
          req.file.buffer,
          file_name,
          folderPath
        );
        fs.unlink(
          `./src/Images/couponCardImage/${couponCard_image}`,
          (err) => {}
        );
        if (G_Image) {
          image = file_name;
        }
      } else {
        image = couponCard_image;
      }
      // console.log(image);
      //  return
      const updatedcouponCard = await couponCard.update(
        {
          ...rest,
          discount_code: discount_code,
          couponCard_image: image,
          updated_date: Date.now(),
        },
        {
          where: { couponCard_id: couponCard_id },
        }
      );

      if (updatedcouponCard === 0) {
        return res
          .status(404)
          .json({ status: 0, message: "CouponCard Not Found!" });
      } else {
        return res
          .status(200)
          .send({ status: 1, msg: "CouponCard Updated Successfully." });
      }
    } else {
      const newcouponCard = await couponCard.create({
        ...rest,
        discount_code: discount_code,
        created_date: Date.now(),
        updated_date: Date.now(),
      });

      if (req.file) {
        const folderPath = "./src/Images/couponCardImage/";
        const random = Math.floor(Math.random() * 10000000);
        var file_name = `${newcouponCard.couponCard_id}_${random}_${newcouponCard.couponCard_id}.png`;
        var G_Image = await uploadImages.uploadImageToFolder(
          req.file.buffer,
          file_name,
          folderPath
        );
        fs.unlink(
          `./src/Images/couponCardImage/${couponCard_image}`,
          (err) => {}
        );
        if (G_Image) {
          image = file_name;
        }
      } else {
        image = "";
      }

      const updatedcouponCard = await couponCard.update(
        {
          couponCard_image: image,
          updated_date: Date.now(),
        },
        {
          where: { couponCard_id: newcouponCard.couponCard_id },
        }
      );

      if (updatedcouponCard) {
        return res
          .status(200)
          .send({ status: 1, msg: "CouponCard Insert Successfull." });
      } else {
        return res
          .status(200)
          .send({ status: 1, msg: "CouponCard Insert UnSuccessfull!" });
      }
    }
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(200)
        .json({ status: 0, message: "CouponCard Name Already Exists!" });
    } else {
      return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
    }
  }
};

const couponCardFill = async (req, res) => {
  const userData = req.body;
  const couponCard_id = userData.couponCard_id;
  let imagelink;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    if (couponCard_id != 0) {
      const data = await couponCard.findOne({
        where: { couponCard_id: couponCard_id },
        attributes: {
          exclude: ["is_deleted", "created_date", "updated_date"],
        },
      });
      if (data.dataValues.couponCard_image) {
        imagelink = `${req.protocol}://${req.get(
          "host"
        )}/src/images/couponCardImage/${data.dataValues.couponCard_image}`;
        data.dataValues.imagelink = data.dataValues.couponCard_image
          ? imagelink
          : "";
      }else{
        data.dataValues.imagelink = "";
      }
      if (data) {
        return res.status(200).json({ status: 1, msg: "Done.", data: data });
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "CouponCard Not Found!" });
      }
    } else {
      const datas = await couponCard.findAll({
        attributes: {
          exclude: [
            "discount_code",
            "discount_Amt",
            "discount_per",
            "is_deleted",
            "created_date",
            "updated_date",
          ],
        },
        order: [
          ['couponCard_id', 'DESC'] 
        ]
      });
      if (datas) {
        for (let i = 0; i < datas.length; i++) {
          if (datas[i].dataValues.couponCard_image) {
            imagelink = `${req.protocol}://${req.get(
              "host"
            )}/src/images/couponCardImage/${datas[i].dataValues.couponCard_image}`;
            datas[i].dataValues.imagelink = datas[i].dataValues.couponCard_image
              ? imagelink
              : "";
          }else{
            datas[i].dataValues.imagelink = "";
          }
        }
      }
      if (datas) {
        return res.status(200).json({ status: 1, msg: "Done.", data: datas });
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "CouponCard Not Found!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const couponCardDelete = async (req, res) => {
  const userData = req.body;
  const couponCard_id = req.body.couponCard_id;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const couponCardToDelete = await couponCard.findByPk(couponCard_id);
    if (!couponCardToDelete) {
      return res.status(200).json({ status: 0, msg: "CouponCard Not Found!" });
    } else {
      if (couponCardToDelete.couponCard_image) {
        fs.unlink(
          `./src/Images/couponCardImage/${couponCardToDelete.couponCard_image}`,
          (err) => {}
        );
      }
      await couponCardToDelete.destroy();
      return res
        .status(200)
        .json({ status: 1, msg: "CouponCard Deleted Successfully." });
    }
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

const couponCardActiveDeactive = async (req, res) => {
  const data = req.body;
  try {
    if (data.user_detail.is_admin === 1 || data.user_detail.is_admin === true) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const couponCardToDelete = await couponCard.findByPk(data.couponCard_id);

    if (!couponCardToDelete) {
      return res.status(200).json({ status: 0, msg: "CouponCard Not Found!" });
    } else {
      const updatedcouponCard = await couponCard.update(
        {
          is_active: data.status,
          updated_date: Date.now(),
        },
        {
          where: { couponCard_id: data.couponCard_id },
        }
      );
      if (updatedcouponCard) {
        if (data.status === 1) {
          return res
            .status(200)
            .json({ status: 1, msg: "CouponCard Activate Successfully." });
        } else {
          return res
            .status(200)
            .json({ status: 1, msg: "CouponCard DeActivate Successfully." });
        }
      } else {
        return res
          .status(200)
          .json({ status: 1, msg: "CouponCard Status Update UnSuccessfull!" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

///// order status
const colorInsUp = async (req, res) => {
  const userData = req.body;
  const { color_id, color_name, ...rest } = userData;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const colorData = await color.findOne({
      where: {
        color_name: color_name,
      },
    });
    if (colorData) {
      return res.status(200).send({
        status: 0,
        msg: `'${color_name}'Color Already Exists!`,
      });
    }

    if (color_id != 0) {
      const updatedcolor = await color.update(
        {
          ...rest,
          color_name: color_name,
          updated_date: Date.now(),
        },
        {
          where: { color_id: color_id },
        }
      );

      if (updatedcolor === 0) {
        return res.status(404).json({ message: "Color Not Found!" });
      }
      return res
        .status(200)
        .send({ status: 1, msg: "Color Updated Successfully." });
    } else {
      const newcolor = await color.create({
        ...rest,
        color_name: color_name,
        created_date: Date.now(),
        updated_date: Date.now(),
      });

      if (newcolor) {
        return res
          .status(200)
          .send({ status: 1, msg: "Color Insert Successfull." });
      } else {
        return res
          .status(200)
          .send({ status: 0, msg: "Color Insert UnSuccessful!" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

const colorFill = async (req, res) => {
  const userData = req.body;
  const color_id = userData.color_id;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    if (color_id != 0) {
      const datas = await color.findOne({
        where: {
          color_id: color_id,
        },
      });
      if (datas) {
        return res.status(200).json({ status: 1, msg: "Done.", data: datas });
      } else {
        return res.status(404).json({ status: 0, msg: "Color Not Found!" });
      }
    } else {
      const datas = await color.findAll();
      if (datas) {
        return res.status(200).json({ status: 1, msg: "Done.", data: datas });
      } else {
        return res.status(404).json({ status: 0, msg: "Color Not Found!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const colorDelete = async (req, res) => {
  const userData = req.body;
  const color_id = req.body.color_id;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const colorToDelete = await color.findByPk(color_id);

    if (!colorToDelete) {
      return res.status(200).json({ status: 0, msg: "Color Not Found!" });
    }
    await colorToDelete.destroy();

    return res
      .status(200)
      .json({ status: 1, msg: "Color Deleted Successfully." });
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

const colorActiveDeactive = async (req, res) => {
  const data = req.body;
  try {
    if (data.user_detail.is_admin === 1 || data.user_detail.is_admin === true) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const colorStatusUpdate = await color.findByPk(data.color_id);

    if (!colorStatusUpdate) {
      return res.status(200).json({ status: 0, msg: "Color Not Found!" });
    } else {
      const updatedcolor = await color.update(
        {
          is_active: data.status,
          updated_date: Date.now(),
        },
        {
          where: { color_id: data.color_id },
        }
      );
      if (updatedcolor) {
        if (data.status === 1) {
          return res
            .status(200)
            .json({ status: 1, msg: "Color Activate Successfully." });
        } else {
          return res
            .status(200)
            .json({ status: 1, msg: "Color DeActivate Successfully." });
        }
      } else {
        return res
          .status(200)
          .json({ status: 1, msg: "Color Status Update UnSuccessfull!" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

////// header and footer images
const headerimagesInsUp = async (req, res) => {
  const userData = req.body;
  // const validJsonString = userData.product_ids
  //   .replace(/'/g, '"').replace(/(\w+)\s*:/g, '"$1":');
  // const parsedProductIds = JSON.parse(validJsonString);
  // console.log(parsedProductIds[0].image1);
  // console.log(userData)
  // const data = JSON.parse(userData.product_ids);
  // console.log(req.files);

  // const data = JSON.parse(JSON.parse(userData.productData))
  // console.log(userData);
  // return;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    // const { value, error } = val.headerimagesInsUp.validate(userData);
    // const valid = error == null;
    // if (valid) {
    // } else {
    //   const { details } = error;
    //   const message = details
    //     .map((i) => i.message)
    //     .join(",")
    //     .replace(/"/g, "");
    //   console.log("error", message);
    //   return res.status(422).json({ status: 0, msg: message });
    // }

    // Check if the number of images is not more than 3
    function getObjectLength(obj) {
      return Object.keys(obj).length;
    }

    if (getObjectLength(req.files) > 3) {
      return res
        .status(200)
        .send({ status: 0, msg: "You can upload max 3 images!" });
    }

    if (req.files) {
      const data = await image.findAll({
        where: {
          image_type: 1,
        },
      });

      for (let i = 0; i < data.length; i++) {
        fs.unlink(
          `./src/Images/header&footerImages/${data[i].dataValues.images}`,
          (err) => {}
        );
      }
      await image.destroy({
        where: {
          image_type: 1,
        },
      });

      const fileKeys = Object.keys(req.files);
      for (let i = 0; i < fileKeys.length; i++) {
        const key = fileKeys[i];
        // console.log(parsedProductIds[i][key]);
        // console.log(req.files[key][0].buffer);
        const folderPath = "./src/Images/header&footerImages/";
        const random = Math.floor(Math.random() * 10000000);
        var file_name = `${1}_${random}_${1}.png`;
        var Image = await uploadImages.uploadImageToFolder(
          req.files[key][0].buffer,
          file_name,
          folderPath
        );
        if (Image) {
          await image.create({
            images: file_name,
            // product_id: parsedProductIds[i][key],
            image_type: 1,
            created_date: Date.now(),
            updated_date: Date.now(),
          });
        }
      }
      return res
        .status(200)
        .send({ status: 1, msg: "Image upload successfull." });
    }
  } catch (error) {
    console.log(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

const headerimagesFill = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }
    const datas = await image.findAll({
      where: {
        image_type: 1,
      },
    });
    if (datas) {
      for (let i = 0; i < datas.length; i++) {
        let imagelink = `${req.protocol}://${req.get(
          "host"
        )}/src/images/header&footerImages/${datas[i].dataValues.images}`;
        datas[i].dataValues.imagelink = datas[i].dataValues.images
          ? imagelink
          : "";
      }
    }

    if (datas) {
      return res.status(200).json({ status: 1, msg: "Done.", data: datas });
    } else {
      return res.status(404).json({ status: 0, msg: "Images Not Found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const headerimageoneInsUp = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    if (req.file.length > 1) {
      return res
        .status(200)
        .send({ status: 0, msg: "You can upload max 1 images!" });
    }

    if (req.file) {
      const data = await image.findOne({
        where: {
          image_type: 2,
        },
      });

      if (data.dataValues.images) {
        fs.unlink(
          `./src/Images/header&footerImages/${data.dataValues.images}`,
          (err) => {}
        );
      }

      await image.destroy({
        where: {
          image_type: 2,
        },
      });

      const folderPath = "./src/Images/header&footerImages/";
      const random = Math.floor(Math.random() * 10000000);
      var file_name = `${2}_${random}_${2}.png`;
      var Image = await uploadImages.uploadImageToFolder(
        req.file.buffer,
        file_name,
        folderPath
      );
      if (Image) {
        await image.create({
          images: file_name,
          image_type: 2,
          created_date: Date.now(),
          updated_date: Date.now(),
        });
        return res
          .status(200)
          .send({ status: 1, msg: "Image upload successfull." });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

const headerimageoneFill = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }
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

const headerimagetwoInsUp = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    if (req.file.length > 1) {
      return res
        .status(200)
        .send({ status: 0, msg: "You can upload max 1 images!" });
    }

    if (req.file) {
      const data = await image.findOne({
        where: {
          image_type: 3,
        },
      });

      if (data.dataValues.images) {
        fs.unlink(
          `./src/Images/header&footerImages/${data.dataValues.images}`,
          (err) => {}
        );
      }

      await image.destroy({
        where: {
          image_type: 3,
        },
      });

      const folderPath = "./src/Images/header&footerImages/";
      const random = Math.floor(Math.random() * 10000000);
      var file_name = `${3}_${random}_${3}.png`;
      var Image = await uploadImages.uploadImageToFolder(
        req.file.buffer,
        file_name,
        folderPath
      );
      if (Image) {
        await image.create({
          images: file_name,
          image_type: 3,
          created_date: Date.now(),
          updated_date: Date.now(),
        });
        return res
          .status(200)
          .send({ status: 1, msg: "Image upload successfull." });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

const headerimagetwoFill = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }
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
    }else{
      data.dataValues.imagelink = "";
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

const footerimageInsUp = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    if (req.file > 1) {
      return res
        .status(200)
        .send({ status: 0, msg: "You can upload max 1 images!" });
    }

    if (req.file) {
      const data = await image.findOne({
        where: {
          image_type: 4,
        },
      });

      if (data.dataValues.images) {
        fs.unlink(
          `./src/Images/header&footerImages/${data.dataValues.images}`,
          (err) => {}
        );
      }

      await image.destroy({
        where: {
          image_type: 4,
        },
      });

      const folderPath = "./src/Images/header&footerImages/";
      const random = Math.floor(Math.random() * 10000000);
      var file_name = `${4}_${random}_${4}.png`;
      var Image = await uploadImages.uploadImageToFolder(
        req.file.buffer,
        file_name,
        folderPath
      );
      if (Image) {
        await image.create({
          image_tital: userData.image_tital,
          image_description: userData.image_description,
          images: file_name,
          image_type: 4,
          created_date: Date.now(),
          updated_date: Date.now(),
        });
        return res
          .status(200)
          .send({ status: 1, msg: "Image upload successfull." });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

const footerimageFill = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }
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
    }else{
      data.dataValues.imagelink = "";
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

const subscriptionimageInsUp = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    if (req.file > 1) {
      return res
        .status(200)
        .send({ status: 0, msg: "You can upload max 1 images!" });
    }

    if (req.file) {
      const data = await image.findOne({
        where: {
          image_type: 5,
        },
      });

      if (data.dataValues.images) {
        fs.unlink(
          `./src/Images/header&footerImages/${data.dataValues.images}`,
          (err) => {}
        );
      }

      await image.destroy({
        where: {
          image_type: 5,
        },
      });

      const folderPath = "./src/Images/header&footerImages/";
      const random = Math.floor(Math.random() * 10000000);
      var file_name = `${5}_${random}_${5}.png`;
      var Image = await uploadImages.uploadImageToFolder(
        req.file.buffer,
        file_name,
        folderPath
      );
      if (Image) {
        await image.create({
          image_tital: userData.image_tital,
          image_description: userData.image_description,
          image_sub_description: userData.image_sub_description,
          images: file_name,
          image_type: 5,
          created_date: Date.now(),
          updated_date: Date.now(),
        });
        return res
          .status(200)
          .send({ status: 1, msg: "Image upload successfull." });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

const subscriptionimageFill = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }
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
    }else{
      data.dataValues.imagelink = "";
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

const getallsubscriptionEmail = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const findallemails = await subscriptionemail.findAll({
      attributes: ["user_email"],
      order: [
        ['email_id', 'DESC']
      ]
    });

    if (findallemails) {
      return res
        .status(200)
        .send({ status: 1, msg: "Done.", data: findallemails });
    } else {
      return res.status(200).send({ status: 0, msg: "Data not Found!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: error.toString() });
  }
};

const getallContactDetails = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const contactDetails = await contactPage.findAll({
      attributes: {
        exclude: ["is_active", "is_deleted", "created_date", "updated_date"],
      },
      order: [
        ['contact_id', 'DESC']
      ]
    });

    if (contactDetails) {
      return res
        .status(200)
        .send({ status: 1, msg: "Done.", data: contactDetails });
    } else {
      return res.status(200).send({ status: 0, msg: "Data not Found!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: error.toString() });
  }
};

///// comment manage
const commentFill = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const comment = await productReview.findAll({
      attributes: {
        exclude: ["is_active", "is_deleted", "created_date", "updated_date"],
      },
      order: [
        ['review_id', 'DESC']
      ]
    });

    if (comment) {
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
  
        const productdata = await product.findOne({
          where: {
            product_id: comment[i].dataValues.product_id,
          },
          attributes: ["product_id", "product_name", "product_description"],
        });
  
        const data1 = await productImage.findOne({
          where: { product_id: productdata.dataValues.product_id },
          attributes: ["image"],
        });
        if (data1.dataValues.image) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${data1.dataValues.image}`;
          productdata.dataValues.imagelink = data1.dataValues.image
            ? imagelink
            : "";
        } else {
          productdata.dataValues.imagelink = "";
        }
        comment[i].dataValues.product_data = productdata ? productdata : "";
        comment[i].dataValues.user_data = userdata ? userdata : "";
      }
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

const commentremove = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const commentToDelete = await productReview.findByPk(userData.review_id);

    if (!commentToDelete) {
      return res.status(200).json({ status: 0, msg: "Comment Not Found!" });
    }
    await commentToDelete.destroy();

    return res
      .status(200)
      .json({ status: 1, msg: "Comment Deleted Successfully." });
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const addtestimonials = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const commentStatusUpdate = await productReview.findByPk(
      userData.review_id
    );

    if (!commentStatusUpdate) {
      return res.status(200).json({ status: 0, msg: "Comment Not Found!" });
    } else {
      const updatedcomment = await productReview.update(
        {
          is_testimonials: userData.status,
          updated_date: Date.now(),
        },
        {
          where: { review_id: userData.review_id },
        }
      );
      if (updatedcomment) {
        if (userData.status === 1) {
          return res.status(200).json({
            status: 1,
            msg: "Comment add in testimonials Successfully.",
          });
        } else {
          return res.status(200).json({
            status: 1,
            msg: "Comment remove testimonials Successfully.",
          });
        }
      } else {
        return res.status(200).json({
          status: 1,
          msg: "Comment add in testimonials UnSuccessfull!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

const testimonialsFill = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

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
      order: [
        ['review_id', 'DESC']
      ]
    });

    if (comment) {
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

//// get all user
const adminuserFill = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const userdata = await user.findAll({
      where: {
        is_admin: 0,
      },
      attributes: [
        "user_id",
        "user_first_name",
        "user_last_name",
        "user_email",
        "user_mobile_no",
        "user_profile_photo",
        "user_address",
        "user_pincode",
        "user_country",
        "user_state",
      ],
      order: [
        ['user_id', 'DESC']
      ]
    });

    if (userdata) {
      for (let i = 0; i < userdata.length; i++) {
        if (userdata[i].dataValues.user_profile_photo) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/profileimage/${
            userdata[i].dataValues.user_profile_photo
          }`;
          userdata[i].dataValues.imagelink = userdata[i].dataValues
            .user_profile_photo
            ? imagelink
            : "";
        }else{
          userdata[i].dataValues.imagelink = "";
        }
      }
      if (userdata != null) {
        return res
          .status(200)
          .json({ status: 1, msg: "Done.", data: userdata });
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

///// stars && product manage for sale
const addstars = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
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
            rating: 0,
            admin_rating: userData.rating,
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
        rating: 0,
        admin_rating: userData.rating,
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

const adminstarsFill = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const comment = await productReview.findAll({
      where: {
        admin_rating: {
          [Op.ne]: 0,
        },
      },
      attributes: {
        exclude: [
          "is_active",
          "is_deleted",
          "created_date",
          "updated_date",
        ],
      },
      order: [
        ['review_id ', 'DESC']
      ]
    });

    // console.log(comment);
    // return

    for (let i = 0; i < comment.length; i++) {
      const product_id = comment[i].dataValues.product_id;
      const datas = await product.findOne({
        where : {
          product_id : product_id
        }
      });
      // console.log(datas);
      // return
        const categorydata = await category.findOne({
          where: {
            category_id: datas.dataValues.product_category,
          },
        });
        if (categorydata) {
          datas.dataValues.product_category_name =
            categorydata.dataValues.category_name;
        }

        ///// get avg rating
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
            datas.dataValues.average_rating =
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
            datas.dataValues.average_rating = results.average_rating;
            datas.dataValues.total_reviews = results.total_reviews;
          } else {
            datas.dataValues.average_rating = 0;
            datas.dataValues.total_reviews = 0;
          }
        }

        if (datas.dataValues.product_video) {
          let videolink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productVideo/${datas.dataValues.product_video}`;
          datas.dataValues.videolink = datas.dataValues.product_video
            ? videolink
            : "";
        }else{
          datas.dataValues.videolink = "";
        }
        const data1 = await productImage.findOne({
          where: { product_id: datas.dataValues.product_id },
          attributes: ["image"],
        });
        if (data1.dataValues.image) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productImage/${data1.dataValues.image}`;
          datas.dataValues.imagelink = data1.dataValues.image
            ? imagelink
            : "";
        } else {
          datas.dataValues.imagelink = "";
        }
      comment[i].dataValues.Product_data = datas ? datas : "";

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

const removestars = async (req, res) => {
  const userData = req.body;
  const review_id = req.body.review_id;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const reviewToDelete = await productReview.findByPk(review_id);

    if (!reviewToDelete) {
      return res.status(200).json({ status: 0, msg: "Review Not Found!" });
    }
    await reviewToDelete.destroy();

    return res
      .status(200)
      .json({ status: 1, msg: "Review Deleted Successfully." });
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

////// get order list
const getorderlist = async (req, res) => {
  const data = req.body;
  const order_id = data.order_id;
  try {
    if (data.user_detail.is_admin === 1 || data.user_detail.is_admin === true) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    if (order_id != 0) {
      const Orderdata = await order.findOne({
        where: {
          order_id: order_id,
          payment_type: { [Op.ne]: "" },
        },
      });
      if (Orderdata) {
      } else {
        return res.status(200).json({ status: 0, msg: "Order Not Found!" });
      }

      const orderstatus = await orderstatus.findOne({
        where: {
          status_id: Orderdata.order_status,
        },
        attributes: ["status_name"],
      });
      ////add status
      Orderdata.dataValues.ordersattus = orderstatus;

      //// get ordertrn data
      const OrderTrndata = await orderTrn.findAll({
        where: { order_id: Orderdata.order_id },
        attributes: {
          exclude: ["is_active", "is_deleted", "created_date", "updated_date"],
        },
      });


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
      Orderdata.dataValues.OrderTrndata = OrderTrndata;
      if (Orderdata) {
        return res
          .status(200)
          .json({ status: 1, msg: "Done.", data: Orderdata });
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }
    } else {
      const Orderdata = await order.findAll({
        where: {
          payment_type: { [Op.ne]: "" },
        },
        order: [
          ['order_id', 'DESC']
        ] 
      });


      if (Orderdata) {
        for (let i = 0; i < Orderdata.length; i++) {
          const ordersattus = await orderstatus.findOne({
            where: {
              status_id: Orderdata[i].order_status,
            },
            attributes: ["status_name"],
          });
          ////add status
          Orderdata[i].dataValues.ordersattus = ordersattus;

          const username = await user.findOne({
            where: {
              user_id: Orderdata[i].user_id,
            },
            attributes: ["user_first_name", "user_last_name"],
          });
          Orderdata[i].dataValues.userName = username;
        }
        // console.log(Orderdata);
        return res
          .status(200)
          .json({ status: 1, msg: "Done.", data: Orderdata });
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "OrderStatus Not Found!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const updateorderSatatus = async (req, res) => {
  const data = req.body;
  try {
    if (data.user_detail.is_admin === 1 || data.user_detail.is_admin === true) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }
    if (data.order_id != 0) {
      const Orderdata = await order.findOne({
        where: {
          order_id: data.order_id,
          payment_type: { [Op.ne]: "" },
        },
      });

      if (Orderdata) {
      } else {
        return res.status(200).json({ status: 0, msg: "Order Not Found!" });
      }

      const statusup = await order.update(
        { order_status: data.status_id , updated_date: Date.now()},
        {
          where: {
            order_id: data.order_id,
          },
        }
      );

      if (statusup) {
        return res.status(200).json({ status: 1, msg: "Status Updated." });
      } else {
        return res.status(404).json({ status: 0, msg: "Status Not Updated!" });
      }
    } else {
      const Orderdata = await order.findAll({
        where: {
          order_status: 1,
          payment_type: { [Op.ne]: "" },
        },
      });

      if (Orderdata) {
        for (let i = 0; i < Orderdata.length; i++) {
   
          const username = await user.findOne({
            where: {
              user_id: Orderdata[i].user_id,
            },
            attributes: ["user_first_name", "user_last_name"],
          });
          Orderdata[i].dataValues.userName = username;
        }

        return res
          .status(200)
          .json({ status: 1, msg: "Done.", data: Orderdata });
      } else {
        return res
          .status(404)
          .json({ status: 0, msg: "OrderStatus Not Found!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const dashboarddetails = async (req, res) => {
  const data = req.body;
  try {
    const today = new Date();
    let startDate;
    let endDate = today;
    switch (data.filter) {
      case "day":
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;

      case "week":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay());
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;

      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;

      case "year":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        endDate.setHours(23, 59, 59, 999);
        break;

      default:
        startDate = null;
        endDate = null;
    }

    const whereCondition = {
      payment_type: { [Op.ne]: "" },
    };

    if (startDate != null && endDate != null) {
      whereCondition.updated_date = { [Op.between]: [startDate, endDate] };
    }
  
    if (data.status_id) {
      whereCondition.order_status = data.status_id;
    }

    const Orderdata = await order.findAll({
      where: whereCondition,
      order: [
        ['updated_date', 'DESC']
      ]
    });

    for (let i = 0; i < Orderdata.length; i++) {
      const orderStatus = await orderstatus.findOne({
        where: {
          status_id: Orderdata[i].order_status,
        },
        attributes: ["status_name"],
      });
      Orderdata[i].dataValues.orderStatusName = orderStatus;
    }

    if (Orderdata) {
      for (let i = 0; i < Orderdata.length; i++) {
        // console.log();
        // return
        const username = await user.findOne({
          where: {
            user_id: Orderdata[i].user_id,
          },
          attributes: ["user_first_name", "user_last_name"],
        });
        Orderdata[i].dataValues.userName = username;
      }
      // console.log(Orderdata);
      return res.status(200).json({ status: 1, msg: "Done.", data: Orderdata });
    } else {
      return res.status(404).json({ status: 0, msg: "OrderStatus Not Found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};
  
const getordercount = async (req, res) => {
  const data = req.body;
  try {
    if (data.user_detail.is_admin === 1 || data.user_detail.is_admin === true) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    const countdata = {};
    countdata["ALL_ORDERS"] = await order.count({
      where: { payment_type: { [Op.ne]: "" } },
    });
    countdata["ALL_INPROCESS"] = await order.count({
      where: { payment_type: { [Op.ne]: "" }, order_status: 1 },
    });
    countdata["ALL_SHIPPING"] = await order.count({
      where: { payment_type: { [Op.ne]: "" }, order_status: 2 },
    });
    countdata["ALL_DELIVERED"] = await order.count({
      where: { payment_type: { [Op.ne]: "" }, order_status: 3 },
    });
    // const allorders =  await order.count({
    //   where : {
    //     payment_type: { [Op.ne]: "" },
    //   }
    // })
    // //  data["ALLORDERS"] = allorders;
    // const allinprocess = await order.count({
    //   where : {
    //     payment_type: { [Op.ne]: "" },
    //     order_status : 1
    //   }
    // })

    // const allshipping = await order.count({
    //   where : {
    //     payment_type: { [Op.ne]: "" },
    //     order_status : 2
    //   }
    // })

    // const alldelivered = await order.count({
    //   where : {
    //     payment_type: { [Op.ne]: "" },
    //     order_status : 3
    //   }
    // })

    if (countdata) {
      return res.status(200).json({ status: 1, msg: "Done.", data: countdata });
    } else {
      return res
        .status(200)
        .json({ status: 0, msg: "Data not Found.", data: countdata });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

///// handle all BestSeller

const addbestseller = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }
    if (userData.status === 1) {
      const count = await product.count({
        where: {
          admin_bestselling: 1,
        },
      });

      if (count < 8) {
      } else {
        return res
          .status(200)
          .json({
            status: 0,
            message:
              "You can add only four Bestseller please remove first old product!",
          });
      }
    }

    const findOneProduct = await product.findOne({
      where: {
        product_id: userData.product_id,
      },
      attributes: [
        "product_id",
        "product_name",
        "product_description",
        "product_price",
      ],
    });

    if (findOneProduct) {
      if (findOneProduct.dataValues.product_id != 0) {
        const updatestatus = await product.update(
          {
            admin_bestselling: userData.status,
          },
          {
            where: { product_id: userData.product_id },
          }
        );

        if (updatestatus === 0) {
          return res.status(404).json({ message: "Product Not Found!" });
        } else {
          return res
            .status(200)
            .send({ status: 1, msg: "BestSeller Updated Successfully." });
        }
      }
    } else {
      return res.status(200).send({ status: 1, msg: "product Not Found." });
    }
  } catch (error) {
    console.log(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

const getBestSeller = async (req, res) => {
  const userData = req.body;
  const product_id = userData.product_id;
  try {
    if (product_id != 0) {
      const data = await product.findOne({ where: { product_id: product_id } });

      if (data) {
        ///// get avg rating
        const product_id = data.dataValues.product_id;
        // Raw SQL query to get the average rating of reviews for a specific product
        const query = `
                        SELECT product_id, AVG(rating) AS average_rating
                        FROM productreviews
                        WHERE product_id = :product_id
                        GROUP BY product_id;
                      `;

        // Execute the raw SQL query
        const [results, metadata] = await sequelize.query(query, {
          replacements: { product_id },
          type: sequelize.QueryTypes.SELECT,
        });
        if (results) {
          data.dataValues.average_rating = results.average_rating;
        } else {
          data.dataValues.average_rating = 0;
        }
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }

      if (data.dataValues.product_video) {
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

      if (data1) {
        for (let i = 0; i < data1.length; i++) {
          if (data1[i].dataValues.image) {
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
                           SELECT product_id, AVG(rating) AS average_rating
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
        } else {
          combinedProducts[i].average_rating = 0;
        }

        if (combinedProducts[i].product_video) {
          let videolink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productVideo/${combinedProducts[i].product_video}`;
          combinedProducts[i].videolink = combinedProducts[i].product_video
            ? videolink
            : "";
        }else{
          combinedProducts[i].videolink = "";
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

///// get all TopView
const addTopView = async (req, res) => {
  const userData = req.body;
  try {
    if (
      userData.user_detail.is_admin === 1 ||
      userData.user_detail.is_admin === true
    ) {
    } else {
      return res.status(200).json({ status: 0, message: "You Are Not Admin!" });
    }

    if (userData.status === 1) {
      const count = await product.count({
        where: {
          admin_topview: 1,
        },
      });

      if (count < 8) {
      } else {
        return res
          .status(200)
          .json({
            status: 0,
            message:
              "You can add only four Topview please remove first old product!",
          });
      }
    }

    const findOneProduct = await product.findOne({
      where: {
        product_id: userData.product_id,
      },
      attributes: [
        "product_id",
        "product_name",
        "product_description",
        "product_price",
      ],
    });
    if (findOneProduct) {
      if (findOneProduct.dataValues.product_id != 0) {
        const updatestatus = await product.update(
          {
            admin_topview: userData.status,
          },
          {
            where: { product_id: userData.product_id },
          }
        );

        if (updatestatus === 0) {
          return res.status(404).json({ message: "Product Not Found!" });
        } else {
          return res
            .status(200)
            .send({ status: 1, msg: "TopView Updated Successfully." });
        }
      }
    } else {
      return res.status(200).send({ status: 1, msg: "product Not Found." });
    }
  } catch (error) {
    console.log(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
  }
};

const getTopView = async (req, res) => {
  const userData = req.body;
  const product_id = userData.product_id;
  try {
    if (product_id != 0) {
      const data = await product.findOne({ where: { product_id: product_id } });

      if (data) {
        ///// get avg rating
        const product_id = data.dataValues.product_id; 
        // Raw SQL query to get the average rating of reviews for a specific product
        const query = `
                        SELECT product_id, AVG(rating) AS average_rating
                        FROM productreviews
                        WHERE product_id = :product_id
                        GROUP BY product_id;
                      `;

        // Execute the raw SQL query
        const [results, metadata] = await sequelize.query(query, {
          replacements: { product_id },
          type: sequelize.QueryTypes.SELECT,
        });
        if (results) {
          data.dataValues.average_rating = results.average_rating;
        } else {
          data.dataValues.average_rating = 0;
        }
      } else {
        return res.status(404).json({ status: 0, msg: "Product Not Found!" });
      }

      if (data.dataValues.product_video) {
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
      if (data1) {
        for (let i = 0; i < data1.length; i++) {
          if (data1[i].dataValues.image) {
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
                           SELECT product_id, AVG(rating) AS average_rating
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
        } else {
          combinedProducts[i].average_rating = 0;
        }

        if (combinedProducts[i].product_video) {
          let videolink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/productVideo/${combinedProducts[i].product_video}`;
          combinedProducts[i].videolink = combinedProducts[i].product_video
            ? videolink
            : "";
        }else{
          combinedProducts[i].videolink = "";
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

////// get top buyers
const getopBuyers = async (req, res) => {
  const userData = req.body;
  const user_id = userData.user_id;
  try {
    if (user_id != 0) {
      const userdata = await user.findOne({
        where: { user_id: user_id },
        attributes: [
          "user_id",
          "user_first_name",
          "user_last_name",
          "user_email",
          "user_mobile_no",
          "user_profile_photo",
          "user_address",
          "user_pincode",
          "user_country",
          "user_state",
        ],
      });

      if (userdata) {
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

        if (userdata.dataValues.length != "") {
          return res
            .status(200)
            .json({ status: 1, msg: "Done.", data: userdata });
        } else {
          return res.status(200).json({ status: 0, msg: "Data Not Found!" });
        }
      } else {
        return res.status(200).json({ status: 0, msg: "User Not Found!" });
      }
    } else {
      // Raw SQL query to count the number of products grouped by product_id

      const query = `
      SELECT u.user_id ,
             u.user_first_name,
             u.user_last_name,
             u.user_email,
             u.user_mobile_no,
             u.user_profile_photo,
             u.user_address,
             u.user_pincode,
             u.user_country,
             u.user_state,
             COUNT(o.order_id) AS order_count
             FROM users u
             JOIN orders o ON u.user_id = o.user_id
             GROUP BY u.user_id
             ORDER BY order_count DESC;
                    `;

      const [results] = await sequelize.query(query);

      if (results) {
        for (let i = 0; i < results.length; i++) {
          if (results[i].user_profile_photo) {
            let imagelink = `${req.protocol}://${req.get(
              "host"
            )}/src/images/profileimage/${results[i].user_profile_photo}`;
            results[i].imagelink = results[i].user_profile_photo ? imagelink : "";
          }else{
            results[i].imagelink = "";
          }
        }
      }
      if (results.length != "") {
        return res.status(200).json({ status: 1, msg: "Done.", data: results });
      } else {
        return res.status(200).json({ status: 0, msg: "Data Not Found!" });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

///// get user who can order
const getUsersPlaceOrder = async (req, res) => {
  try {
    const Orderdata = await sequelize.query(
      `   SELECT
                  u.user_id,
                  u.user_first_name,
                  u.user_last_name,
                  u.user_email,
                  u.user_mobile_no,
                  u.user_profile_photo
                  FROM orders AS ord
                  LEFT JOIN users AS u ON u.user_id = ord.user_id AND u.user_token = ord.user_token
                  Where ord.order_status != 6 GROUP BY u.user_first_name`,
      {
        type: QueryTypes.SELECT,
      }
    );


    if (Orderdata) {
      for (let i = 0; i < Orderdata.length; i++) {
        if (Orderdata[i].user_profile_photo) {
          let imagelink = `${req.protocol}://${req.get(
            "host"
          )}/src/images/profileimage/${Orderdata[i].user_profile_photo}`;
          Orderdata[i].imagelink = Orderdata[i].user_profile_photo
            ? imagelink
            : "";          
        }else{
          Orderdata[i].imagelink =  "";    
        }
      }
      return res.status(200).json({ status: 1, msg: "Done.", data: Orderdata });
    } else {
      return res.status(404).json({ status: 0, msg: "OrderStatus Not Found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};



const getOrdersByuserId = async (req, res) => {
  const user_id = req.body.user_id;
  let SubTotalAmt = 0;
  let TotalAmt = 0;
  let TotalGst = 0;
  let TotalTax = 0;
  let Shipping = 0;
  let Discount = 0;
  try {
    const Orderdata = await sequelize.query(
      `   SELECT
                  u.user_id,
                  u.user_first_name,
                  u.user_last_name,
                  u.user_email,
                  u.user_mobile_no,
                  ord.order_id,    
                  ord.user_id,
                  ord.user_token,
                  ord.order_coupon_code,
                  ord.order_status,   
                  Os.status_name,
                  p.product_id,
                  p.product_name,
                  p.product_description,
                  p.product_price,
                  p.GST,
                  p.Product_tax,
                  p.product_discount,
                  p.product_discount_price,
                  p.product_video,     
                  p.shipping_charge,
                  p.product_category
                  FROM orders AS ord
                  LEFT JOIN users AS u ON u.user_id = ord.user_id AND u.user_token = ord.user_token
                  LEFT JOIN orderstatuses AS Os ON Os.status_id = ord.order_status 
                  LEFT JOIN products AS p ON p.product_id = ord.product_id
                  Where ord.order_status != 6 AND ord.user_id = :user_id`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          user_id: user_id,
        },
      }
    );

    if (Orderdata) {
      //// get product data using order data
      for (let i = 0; i < Orderdata.length; i++) {
        const Productdata = await product.findOne({
          where: { product_id: Orderdata[i].product_id },
          attributes: {
            exclude: [
              "is_active",
              "is_deleted",
              "created_date",
              "updated_date",
            ],
          },
        });

        const getCoupon = await giftCard.findOne({
          where: {
            discount_code: Orderdata[i].order_coupon_code,
          },
        });

        if (getCoupon) {
          if (getCoupon.dataValues.discount_Amt) {
            SubTotalAmt +=
              Productdata.dataValues.product_price -
              getCoupon.dataValues.discount_Amt;
            TotalAmt +=
              Productdata.dataValues.product_price -
              getCoupon.dataValues.discount_Amt;
            Discount += getCoupon.dataValues.discount_Amt;
          } else {
            if (getCoupon.dataValues.discount_per) {
              SubTotalAmt +=
                (Productdata.dataValues.product_price *
                  getCoupon.dataValues.discount_per) /
                100;
              TotalAmt +=
                (Productdata.dataValues.product_price *
                  getCoupon.dataValues.discount_per) /
                100;
              Discount +=
                (Productdata.dataValues.product_price *
                  getCoupon.dataValues.discount_per) /
                100;
            }
          }
        } else {
          SubTotalAmt += Productdata.dataValues.product_price;
          TotalAmt += Productdata.dataValues.product_price;
        }

        if (Productdata.dataValues.GST != 0) {
          TotalGst +=
            (Productdata.dataValues.product_price *
              Productdata.dataValues.GST) /
            100;
          if (TotalGst) {
            TotalAmt +=
              (Productdata.dataValues.product_price *
                Productdata.dataValues.GST) /
              100;
          }
        } else {
          TotalTax += Productdata.dataValues.Product_tax;
          if (TotalTax) {
            TotalAmt += Productdata.dataValues.Product_tax;
          }
        }
        if (Productdata.dataValues.shipping_charge) {
          Shipping += Productdata.dataValues.shipping_charge;
          if (Shipping) {
            TotalAmt += Productdata.dataValues.shipping_charge;
          }
        }

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
        if (data1.dataValues.image) {
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
        Orderdata[i].ProductData = Productdata;
      }
      return res.status(200).json({
        status: 1,
        msg: "Done.",
        SubTotalAmt: SubTotalAmt,
        TotalGst: TotalGst,
        TotalTax: TotalTax,
        Shipping: Shipping,
        Discount: Discount,
        TotalAmt: TotalAmt,
        data: Orderdata,
      });
    } else {
      return res.status(404).json({ status: 0, msg: "OrderStatus Not Found!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

//// get and update order status
const updateAllOrderStatus = async (req, res) => {
  const userdata = req.body;
  try {
    const updatestatus = await order.update(
      {
        order_status: userdata.order_status,
        updated_date: Date.now(),
      },
      {
        where: { user_id: userdata.user_id },
      }
    );

    if (updatestatus[0] === 0) {
      return res.status(404).json({ status: 0, message: "Order Not Found!" });
    }
    return res
      .status(200)
      .send({ status: 1, msg: "OrderStatus Updated Successfully." });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(200)
        .json({ status: 0, message: "OrderStatus Already Exists!" });
    } else {
      return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
    }
  }
};

const updateOneOrderStatus = async (req, res) => {
  const userdata = req.body;
  try {
    const updatestatus = await order.update(
      {
        order_status: userdata.order_status,
        updated_date: Date.now(),
      },
      {
        where: {
          [Op.and]: [
            { user_id: userdata.user_id },
            { order_id: userdata.order_id },
          ],
        },
      }
    );

    if (updatestatus[0] === 0) {
      return res.status(404).json({ status: 0, message: "Order Not Found!" });
    }
    if (updatestatus) {
      return res
        .status(200)
        .send({ status: 1, msg: "OrderStatus Updated Successfully." });
    } else {
      return res
        .status(200)
        .send({ status: 0, msg: "OrderStatus Not Updated!" });
    }
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(200)
        .json({ status: 0, message: "OrderStatus Already Exists!" });
    } else {
      return res.status(200).send({ status: 0, msg: "Internal Server Error!" });
    }
  }
};

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
        }else{
          Productdata.dataValues.imagelink = "";
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

const bankingDetails = async (req, res) => {
  const userdata = req.body;
  try {
    const orders = await sequelize.query(`
      SELECT 
        order_id,
        user_id,
        order_total,
        user_first_name,
        user_last_name,
        payment_type,
        proceed_to_payment,
        is_active,
        is_deleted,
        created_date,
        updated_date,
        SUM(order_total) OVER (ORDER BY order_id) AS running_total,
        (SELECT SUM(order_total) 
           FROM orders 
           WHERE payment_type != '' 
           AND proceed_to_payment = 1) AS total_order_sum
      FROM orders
      WHERE payment_type != '' 
      AND proceed_to_payment = 1
      ORDER BY updated_date DESC;
    `, {
      type: QueryTypes.SELECT
    });

    // Query to get the total sum
    const totalResult = await sequelize.query(`
      SELECT SUM(order_total) AS total_order_sum
      FROM orders
      WHERE payment_type != '' 
      AND proceed_to_payment = 1;
    `, {
      type: QueryTypes.SELECT
    });

    const totalOrderSum = totalResult[0].total_order_sum;

    // Add the total to the result
    const result = {
      orders,
      totalOrderSum
    };

    if (result) {
      return res
        .status(200)
        .send({ status: 1, msg: "Done." , data : result});
    } else {
      return res
        .status(200)
        .send({ status: 0, msg: "Data not FOund!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: error.toString() });
  }
};



//// update authtoken
const updateAuthToken = async (id) => {
  try {
    const auth_token =
      id +
      [...(CONFIG.auth_string + CONFIG.auth_string)]
        .sort(() => Math.random() - 0.5)
        .join("") +
      id;

    await user.update(
      {
        auth_token: auth_token,
      },
      {
        where: {
          user_id: id,
        },
      }
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  handleAdminSingUp,
  handleUserSingIn,
  productInsUp,
  productFill,
  productFillByCategory,
  productDelete,
  productActiveDeactive,
  charmInsUp,
  charmFill,
  charmDelete,
  charmActiveDeactive,
  orderStatusInsUp,
  orderStatusFill,
  orderStatusDelete,
  getUsersPlaceOrder,
  couponCardInsUp,
  couponCardFill,
  couponCardDelete,
  couponCardActiveDeactive,
  getOrdersByuserId,
  updateAllOrderStatus,
  updateOneOrderStatus,
  categoryInsupd,
  categoryDelete,
  categoryFill,
  categoryActiveDeactive,
  colorInsUp,
  colorFill,
  colorDelete,
  colorActiveDeactive,
  commentFill,
  commentremove,
  addtestimonials,
  adminuserFill,
  testimonialsFill,
  addstars,
  adminstarsFill,
  removestars,
  headerimagesInsUp,
  headerimagesFill,
  headerimageoneInsUp,
  headerimageoneFill,
  headerimagetwoInsUp,
  headerimagetwoFill,
  footerimageInsUp,
  footerimageFill,
  subscriptionimageInsUp,
  subscriptionimageFill,
  getorderlist,
  updateorderSatatus,
  dashboarddetails,
  getordercount,
  addbestseller,
  getBestSeller,
  addTopView,
  getTopView,
  getopBuyers,
  getallsubscriptionEmail,
  getallContactDetails,
  pdfgenerate,
  bankingDetails,
  bankingDetails
};
