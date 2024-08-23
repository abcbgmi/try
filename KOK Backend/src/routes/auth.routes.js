const express = require("express");
const validationMiddleware = require("../middleware/validation_middleware");
const header_middleware = require("../middleware/header_middleware");
const filemiddleware = require("../utils/file_upload_function");
const validation = require("../validation/auth_validation");
const aRouter = express.Router();
const authmehtod = require("../controller/auth_controller");

///// user register
aRouter.post("/register",validationMiddleware(validation.register),authmehtod.handleUserSingUp);

///// user signin
aRouter.post("/login",validationMiddleware(validation.login),authmehtod.handleUserSingIn);

//// update user
aRouter.post("/update",filemiddleware.upload.single("image"),header_middleware.checkAuthToken,authmehtod.updateUser);

//// get user
aRouter.post("/fill",header_middleware.checkAuthToken,validationMiddleware(validation.userFill),authmehtod.userFill);

//// remove or delete user
aRouter.delete("/remove",header_middleware.checkAuthToken,validationMiddleware(validation.removeUser),authmehtod.removeUser);

//// change password in profile
aRouter.post("/changePassword",validationMiddleware(validation.changePassword),header_middleware.checkAuthToken,authmehtod.changePassword);

//// change password using email id
aRouter.post("/forgotPassword",validationMiddleware(validation.forgotPassword),authmehtod.forgotPassword);

aRouter.post("/changePasswordWithVerificationCode",validationMiddleware(validation.changePasswordWithVerificationCode),authmehtod.changePasswordWithVerificationCode);

//// user logout
aRouter.post("/logout",header_middleware.checkAuthToken,authmehtod.userLogout);

module.exports = aRouter;
