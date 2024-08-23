const db = require("../configs/db.js");
const user = db.user;
const commonValidation = require("../validation/common_validation");
const uploadImages = require("../utils/file_upload_function.js");
const CONFIG = require("../configs/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const val = require("../validation/auth_validation.js");

///// user register
const handleUserSingUp = async (req, res) => {    
  const requestData = req.body;
  try {
    // const finduser = await user.findOne({
    //     where: {
    //         user_email: requestData.user_email
    //     }
    // })
    if (requestData.user_password === requestData.user_confirm_password) {
    } else {
      return res
        .status(200)
        .send({ status: 0, msg: "Password and Confirm-Password Don't Match!" });
    }

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
        user_password: password,
        is_admin : 0,
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
        attributes: [
          "user_first_name",
          "user_last_name",
          "user_email",
          "user_mobile_no",
          "user_password",
          "user_token",
          "auth_token",
        ],
      });

      if (userdata) {
        return res
          .status(200)
          .send({ status: 1, msg: "Register Successfull." });
      } else {
        return res.status(200).send({ status: 0, msg: "Fail to Register!" });
      }
    }

    // if (finduser.is_deleted == 0) {
    //     const password = await bcrypt.compare(requestData.user_password, finduser.user_password);
    //     if (!password) {
    //         return res.status(200).send({ status: 0, msg: "Wrong password" });
    //     }

    //     var isUpdated = await updateAuthToken(finduser.user_id);

    //     if (!isUpdated) {
    //         return res.status(200).send({ status: 0, msg: "Fail to update auth token" });
    //     }

    //     const userdata = await user.findOne({
    //         where: {
    //             user_token: finduser.user_token
    //         },
    //         attributes: ["user_email", "user_password", "user_token", "auth_token"]
    //     })
    //     if (userdata) {
    //         return res.status(200).send({ status: 1, msg: "Login successfull", data: userdata });
    //     } else {
    //         return res.status(200).send({ status: 0, msg: "Fail to login.", data: userdata });
    //     }

    // } else {
    //     return res.status(200).send({ status: 0, msg: "User not exist" });

    // }
  } catch (err) {
    console.log(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

///// user signin
const handleUserSingIn = async (req, res) => {
  const requestData = req.body;
  console.log(requestData);
  // return   
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

      if(finduser.dataValues.user_id && finduser.dataValues.is_admin === false){}else{
        return res.status(200).json({ status: 0, msg: "User Not Found!" });
      }
      
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
          "user_token",
          "auth_token",
        ],
      });
      if (userdata) {
        return res
          .status(200)
          .send({ status: 1, msg: "Login Successfull.", data: userdata });
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

//// update user
const updateUser = async (req, res) => {
  const userdata = req.body;
  let image;
  try {
    if(userdata.user_detail.user_id == userdata.user_id){}else{
      return res.status(200).json({ status: 0, msg: "User Not Found!" });
    }
    const { value, error } = val.updateUser.validate(userdata);
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
    const userData = value;
    if (userData.user_id != 0) {
      const userdata = await user.findOne({
        where: {
          user_id: userData.user_id,
        },
      });
      if (userdata) {
      } else {
        return res.status(200).json({ status: 0, msg: "User Not Found!" });
      }
      if (req.file) {
        const folderPath = "./src/Images/ProfileImage/";
        const random = Math.floor(Math.random() * 10000000);
        var file_name = `${value.user_id}_${random}_${value.user_id}.png`;
        var P_Image = await uploadImages.uploadImageToFolder(req.file.buffer,file_name,folderPath);
        fs.unlink(`./src/Images/ProfileImage/${value.user_profile_photo}`, (err) => {});
        if(P_Image){
          image = file_name;
        }
      } else {
        image = value.user_profile_photo;
      }

      const updatedUser = await user.update(
        {
          user_first_name: value.user_first_name,
          user_last_name: value.user_last_name,
          user_mobile_no: value.user_mobile_no,
          user_address: value.user_address,
          user_pincode: value.user_pincode,
          user_country: value.user_country,
          user_state: value.user_state,
          user_profile_photo: image,
          updated_date: Date.now(),
        },
        {
          where: { user_id: value.user_id },
        }
      );
      if (updatedUser === 0) {
        return res.status(200).json({ status: 0, msg: "User Not Found!" });
      }
      return res
        .status(200)
        .send({ status: 1, msg: "User Update Successfull." });
    } else {
      return res.status(200).json({ status: 0, msg: "Please Enter User Id!" });
    }
  } catch (err) {
    console.error(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

//// get user
const userFill = async (req, res) => {
  const userData = req.body;
  // console.log(userData)
  // return
  try {
    if(userData.user_detail.user_id == userData.user_id){}else{
      return res.status(200).json({ status: 0, msg: "User Not Found!" });
    }
    const userdata = await user.findOne({
      where: {
        user_id: userData.user_id,
      },
      attributes: [
        "user_id",
        "user_token",
        "user_first_name",
        "user_last_name",
        "user_email",
        "user_mobile_no",
        "auth_token",
        "user_profile_photo",
        "user_address",
        "user_pincode",
        "user_country",
        "user_state"
      ],
    });
    if (userdata) {
      let imagelink = `${req.protocol}://${req.get(
        "host"
      )}/src/images/profileimage/${userdata.dataValues.user_profile_photo}`;
      userdata.dataValues.imagelink = userdata.dataValues.user_profile_photo
        ? imagelink
        : "";

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
  } catch (err) {
    console.error(err);
    return res.status(500).send({ status: 0, msg: err.toString() });
  }
};

//// remove or delete user
const removeUser = async (req, res) => {
  const userData = req.body;
  const user_id = userData.user_id;
  try {

    if(userData.user_detail.user_id == userData.user_id){}else{
      return res.status(200).json({ status: 0, msg: "User Not Found!" });
    }

    const userToDelete = await user.findByPk(user_id);

    if (!userToDelete) {
      return res.status(200).json({ status: 0, msg: "User Not Found!" });
    } else {
      fs.unlink(
        `./src/Images/ProfileImage/${userToDelete.dataValues.user_profile_photo}`,
        (err) => {}
      );
      // fs.unlink(`./src/Images/BlogFiles/${blogToDelete.dataValues.blog_description_id}.txt`, (err) => {})
      await userToDelete.destroy();
      return res
        .status(200)
        .json({ status: 1, msg: "User Remove Successfully." });
    }
  } catch (error) {
    console.error(error);
    return res.status(200).send({ status: 0, msg: "Internal Server Error" });
  }
};

//// change password in profile
const changePassword = async (req, res) => {
  const requestData = req.body;
  const currentUserDetail = requestData.user_detail;
  try {
    
    const passwordCompare = await bcrypt.compare(
      requestData.old_password,
      currentUserDetail.user_password
    );
    if (!passwordCompare) {
      return res.status(200).send({ status: 0, msg: "Old_Password is Wrong!" });
    }

    if (requestData.new_password === requestData.new_confirm_password) {
      var password = await bcrypt.hash(requestData.new_password, 10);
    } else {
      return res
        .status(200)
        .send({ status: 0, msg: "Password and Confirm-Password Don't Match!" });
    }

    var updatedData = await user.update(
      {
        user_password: password,
        updated_date: Date.now(),
      },
      {
        where: {
          user_email: currentUserDetail.user_email,
        },
      }
    );

    if (updatedData == 1) {
      return res.status(200).send({ status: 1, msg: "Password Changed." });
    } else {
      return res
        .status(200)
        .send({ status: 0, msg: "Fail to Change Password!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

//// change password using email id
const forgotPassword = async (req, res) => {
  try {
    const requestData = req.body;

    const finduser = await user.findOne({
      where: {
        user_email: requestData.user_email,
      },
    });
    if (!finduser) {
      return res
        .status(200)
        .send({ status: 0, msg: "User Not Exist With This Email!" });
    }

    var code = Math.floor(1000 + Math.random() * 9000);

    var updatedData = await user.update(
      {
        verify_email_code: code,
      },
      {
        where: {
          user_email: requestData.user_email,
        },
      }
    );

    if (updatedData != 1) {
      return response
        .status(200)
        .send({ status: 0, msg: "Fail to Generate Verification Code!" });
    }

    require("../utils/general_function").sendEmailUsingGmail(
      requestData.user_email,
      "Forgot Password",
      `Here is code:- \n${code}`,
      function (error, info) {
        if (error) {
          console.log("Email error: " + error);
          return res
            .status(200)
            .send({ status: 0, msg: "We are Unable to Send Email Right Now." });
        } else {
          console.log("Email sent: " + info.response);
          res
            .status(200)
            .send({
              status: 1,
              msg: "Forgot Password Code Sent to Your Email.",
              code: code,
            });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

const changePasswordWithVerificationCode = async (req, res) => {
  try {
    const requestData = req.body;

    const finduser = await user.findOne({
      where: {
        user_email: requestData.user_email,
      },
    });

    if (!finduser) {
      return res
        .status(200)
        .send({ status: 0, msg: "User Not Exist With This Email!" });
    }

    if (finduser.verify_email_code != requestData.verify_code) {
      return res
        .status(200)
        .send({ status: 0, msg: "Verification Code is Not Valid!" });
    }

    const password = await bcrypt.hash(requestData.user_password, 10);

    var updatedData = await user.update(
      {
        verify_email_code: password,
        updated_date: Date.now(),
      },
      {
        where: {
          user_email: requestData.user_email,
        },
      }
    );

    if (updatedData == 1) {
      await user.update(
        {
          verify_email_code: null,
          updated_date: Date.now(),
        },
        {
          where: {
            user_email: requestData.user_email,
          },
        }
      );
      return res.status(200).send({ status: 1, msg: "Password Changed." });
    } else {
      return res
        .status(200)
        .send({ status: 0, msg: "Fail to Change Password!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
  }
};

//// user logout
const userLogout = async (req, res) => {
  try {
    const requestData = req.body;
    const currentUserDetail = requestData.user_detail;

    if (currentUserDetail) {
      const data = await user.update(
        {
          auth_token: null,
          is_logged_out: 1,
          is_active: 0,
        },
        {
          where: {
            user_id: currentUserDetail.user_id,
            user_token: currentUserDetail.user_token,
          },
        }
      );
      if (data) {
        return res
          .status(200)
          .json({ status: 0, msg: "User Logout Successfull." });
      }
    } else {
      return res.status(200).json({ status: 0, msg: "User Not Found!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).send({ status: 0, msg: err.toString() });
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
  handleUserSingUp,
  handleUserSingIn,
  updateUser,
  userFill,
  removeUser,
  changePassword,
  userLogout,
  forgotPassword,
  changePasswordWithVerificationCode,
};
