const express = require("express");
const validationMiddleware = require("../middleware/validation_middleware");
const header_middleware = require("../middleware/header_middleware");
const filemiddleware = require("../utils/file_upload_function");
const validation = require("../validation/admin_validation");
const adRouter = express.Router();
const uploadImages = require("../utils/file_upload_function");
const adminmethod = require("../controller/admin_controller");

///// user register
adRouter.post("/register",validationMiddleware(validation.register),adminmethod.handleAdminSingUp);

/// user signin
adRouter.post("/login",validationMiddleware(validation.login),adminmethod.handleUserSingIn);

//// product 
adRouter.post("/productInsUp",
  uploadImages.upload.fields([
    { name: "video", minCount: 0, maxCount: 1 },
    { name: "otherImages", minCount: 1, maxCount: 5 },
  ]),header_middleware.checkAuthToken,adminmethod.productInsUp);
adRouter.post("/productFill",header_middleware.checkAuthToken,validationMiddleware(validation.productFill),adminmethod.productFill);
adRouter.post("/productFillByCategory",header_middleware.checkAuthToken,validationMiddleware(validation.productFillByCategory),adminmethod.productFillByCategory);
adRouter.post("/productDelete",header_middleware.checkAuthToken,validationMiddleware(validation.productDelete),adminmethod.productDelete);
adRouter.post("/productActiveDeactive",header_middleware.checkAuthToken,validationMiddleware(validation.productActiveDeactive),adminmethod.productActiveDeactive);

  
///// categorys
adRouter.post('/categoryInsupd',  uploadImages.upload.fields([
  { name: "image", minCount: 0, maxCount: 1 },
  { name: "banner_image", minCount: 1, maxCount: 1 },
]),header_middleware.checkAuthToken,adminmethod.categoryInsupd);
adRouter.get('/categoryFill',header_middleware.checkAuthToken,adminmethod.categoryFill);
adRouter.post('/categoryDelete',header_middleware.checkAuthToken,validationMiddleware(validation.categoryDelete),adminmethod.categoryDelete);
adRouter.post("/categoryActiveDeactive",header_middleware.checkAuthToken,validationMiddleware(validation.categoryActiveDeactive),adminmethod.categoryActiveDeactive);


///// charms 
adRouter.post("/charmInsUp",header_middleware.checkAuthToken,validationMiddleware(validation.charmInsUp),adminmethod.charmInsUp);
adRouter.post("/charmFill",header_middleware.checkAuthToken,validationMiddleware(validation.charmFill),adminmethod.charmFill);
adRouter.post("/charmDelete",header_middleware.checkAuthToken,validationMiddleware(validation.charmDelete),adminmethod.charmDelete);
adRouter.post("/charmActiveDeactive",header_middleware.checkAuthToken,validationMiddleware(validation.charmActiveDeactive),adminmethod.charmActiveDeactive);


///// order status  
adRouter.post("/orderStatusInsUp",header_middleware.checkAuthToken,validationMiddleware(validation.orderStatusInsUp),adminmethod.orderStatusInsUp);
adRouter.post("/orderStatusFill",header_middleware.checkAuthToken,validationMiddleware(validation.orderStatusFill),adminmethod.orderStatusFill);
adRouter.post("/orderStatusDelete",header_middleware.checkAuthToken,validationMiddleware(validation.orderStatusDelete),adminmethod.orderStatusDelete);

///// color status 
adRouter.post("/colorInsUp",header_middleware.checkAuthToken,validationMiddleware(validation.colorInsUp),adminmethod.colorInsUp);
adRouter.post("/colorFill",header_middleware.checkAuthToken,validationMiddleware(validation.colorFill),adminmethod.colorFill);
adRouter.post("/colorDelete",header_middleware.checkAuthToken,validationMiddleware(validation.colorDelete),adminmethod.colorDelete);
adRouter.post("/colorActiveDeactive",header_middleware.checkAuthToken,validationMiddleware(validation.colorActiveDeactive),adminmethod.colorActiveDeactive);

///// comment data
adRouter.get("/commentFill",header_middleware.checkAuthToken,adminmethod.commentFill);
adRouter.post("/commentremove",header_middleware.checkAuthToken,validationMiddleware(validation.commentremove),adminmethod.commentremove);
adRouter.post("/addtestimonials",header_middleware.checkAuthToken,validationMiddleware(validation.addtestimonials),adminmethod.addtestimonials);
adRouter.get("/testimonialsFill",header_middleware.checkAuthToken,adminmethod.testimonialsFill);

///// get all users
adRouter.get("/adminuserFill",header_middleware.checkAuthToken,adminmethod.adminuserFill);
adRouter.post("/getopBuyers",header_middleware.checkAuthToken,validationMiddleware(validation.getopBuyers), adminmethod.getopBuyers);



/////get all orders 
adRouter.post("/getorderlist",header_middleware.checkAuthToken,validationMiddleware(validation.getorderlist), adminmethod.getorderlist);
adRouter.post("/updateorderSatatus",header_middleware.checkAuthToken,validationMiddleware(validation.updateorderSatatus), adminmethod.updateorderSatatus);
adRouter.post("/dashboarddetails",header_middleware.checkAuthToken,validationMiddleware(validation.dashboarddetails),adminmethod.dashboarddetails);
adRouter.get("/getordercount",header_middleware.checkAuthToken,adminmethod.getordercount);



////handle all bestseller and topviews
adRouter.post("/addbestseller",header_middleware.checkAuthToken,validationMiddleware(validation.addbestseller), adminmethod.addbestseller);
adRouter.post("/getBestSeller",header_middleware.checkAuthToken,validationMiddleware(validation.getBestSaller),adminmethod.getBestSeller);
adRouter.post("/addTopView",header_middleware.checkAuthToken,validationMiddleware(validation.addTopView), adminmethod.addTopView);
adRouter.post("/getTopView",header_middleware.checkAuthToken,validationMiddleware(validation.getTopView),adminmethod.getTopView);


// adRouter.post("/getorderlist",header_middleware.checkAuthToken,validationMiddleware(validation.getorderlist), adminmethod.getorderlist);





//// get and update order status
adRouter.post("/updateAllOrderStatus",validationMiddleware(validation.updateAllOrderStatus),adminmethod.updateAllOrderStatus);
adRouter.post("/updateOneOrderStatus",validationMiddleware(validation.updateOneOrderStatus),adminmethod.updateOneOrderStatus);




///// coupon cards  
adRouter.post("/couponCardInsUp",filemiddleware.upload.single("image"),header_middleware.checkAuthToken,adminmethod.couponCardInsUp);
adRouter.post("/couponCardFill",header_middleware.checkAuthToken,validationMiddleware(validation.couponCardFill),adminmethod.couponCardFill);
adRouter.post("/couponCardDelete",header_middleware.checkAuthToken,validationMiddleware(validation.couponCardDelete),adminmethod.couponCardDelete);
adRouter.post("/couponCardActiveDeactive",header_middleware.checkAuthToken,validationMiddleware(validation.couponCardActiveDeactive),adminmethod.couponCardActiveDeactive);

///// images upload headers and footer
adRouter.post("/headerimagesInsUp",
  uploadImages.upload.fields([
    { name: "image1", minCount: 0, maxCount: 1 },
    { name: "image2", minCount: 0, maxCount: 1 },
    { name: "image3", minCount: 0, maxCount: 1 },
  ]),
  header_middleware.checkAuthToken,adminmethod.headerimagesInsUp);
adRouter.get("/headerimagesFill",header_middleware.checkAuthToken,adminmethod.headerimagesFill);
adRouter.post("/headerimageoneInsUp",filemiddleware.upload.single("image"),header_middleware.checkAuthToken,adminmethod.headerimageoneInsUp);
adRouter.get("/headerimageoneFill",header_middleware.checkAuthToken,adminmethod.headerimageoneFill);
adRouter.post("/headerimagetwoInsUp",filemiddleware.upload.single("image"),header_middleware.checkAuthToken,adminmethod.headerimagetwoInsUp);
adRouter.get("/headerimagetwoFill",header_middleware.checkAuthToken,adminmethod.headerimagetwoFill);
adRouter.post("/footerimageInsUp",filemiddleware.upload.single("image"),header_middleware.checkAuthToken,adminmethod.footerimageInsUp);
adRouter.get("/footerimageFill",header_middleware.checkAuthToken,adminmethod.footerimageFill);
adRouter.post("/subscriptionimageInsUp",filemiddleware.upload.single("image"),header_middleware.checkAuthToken,adminmethod.subscriptionimageInsUp);
adRouter.get("/subscriptionimageFill",header_middleware.checkAuthToken,adminmethod.subscriptionimageFill);
adRouter.get("/getallsubscriptionEmail",header_middleware.checkAuthToken,adminmethod.getallsubscriptionEmail);
adRouter.get("/getallContactDetails",header_middleware.checkAuthToken,adminmethod.getallContactDetails);



///// stars && product manage for sale 
adRouter.post("/addstars",header_middleware.checkAuthToken,validationMiddleware(validation.addstars),adminmethod.addstars);
adRouter.get("/adminstarsFill",header_middleware.checkAuthToken,adminmethod.adminstarsFill);
adRouter.post("/removestars",header_middleware.checkAuthToken,validationMiddleware(validation.removestars),adminmethod.removestars);

// adRouter.post("/couponCardActiveDeactive",header_middleware.checkAuthToken,validationMiddleware(validation.couponCardActiveDeactive),adminmethod.couponCardActiveDeactive);
adRouter.post('/pdfgenerate',header_middleware.checkAuthToken,validationMiddleware(validation.pdfgenerate),adminmethod.pdfgenerate);
adRouter.get('/bankingDetails',header_middleware.checkAuthToken,adminmethod.bankingDetails);



module.exports = adRouter;
