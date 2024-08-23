const express = require('express');
const validationMiddleware = require('../middleware/validation_middleware');
const header_middleware = require('../middleware/header_middleware');
const filemiddleware = require("../utils/file_upload_function");
const validation = require('../validation/admin_validation');
const orddervalidation = require('../validation/orderMast_validation');

const ordervalidation = require('../validation/orderMast_validation');
const paymentvalidation = require('../validation/payment_in_out_Mast_validation');
const odRouter = express.Router();
const uploadImages = require("../utils/file_upload_function");
const otherMast = require('../controller/other_Mast');
const orderMast = require('../controller/order_Mast');
const paymentMast = require('../controller/payment_in_out_Mast');


///// get all product
odRouter.post('/productGet',validationMiddleware(validation.productFill),otherMast.productGet);
odRouter.post("/productFillByCategory",validationMiddleware(validation.productFillByCategory),otherMast.productFillByCategory);

///// get all category
odRouter.get('/categoryFill',otherMast.categoryFill);

//// get all charms
// odRouter.post('/charmGet',header_middleware.checkAuthToken, validationMiddleware(validation.charmFill),otherMast.charmGet);

//// get all couponcard
odRouter.post('/couponCardFill',validationMiddleware(validation.couponCardFill),otherMast.couponCardFill);

//// add in cart
odRouter.post('/addToCart',validationMiddleware(orddervalidation.addToCart),header_middleware.checkAuthToken,orderMast.addToCart);
odRouter.post('/CartGet',header_middleware.checkAuthToken,validationMiddleware(ordervalidation.CartGet),orderMast.CartGet);
odRouter.post('/CartProductDelete',header_middleware.checkAuthToken,validationMiddleware(ordervalidation.CartProductDelete),orderMast.CartProductDelete);
odRouter.get('/getCartCount',header_middleware.checkAuthToken,orderMast.getCartCount);

//////order manage
odRouter.post('/addToOrder',header_middleware.checkAuthToken,orderMast.addToOrder);
odRouter.post('/OrderGet',header_middleware.checkAuthToken,validationMiddleware(ordervalidation.OrderGet),orderMast.OrderGet);
odRouter.post('/pdfgenerate',header_middleware.checkAuthToken,validationMiddleware(ordervalidation.pdfgenerate),orderMast.pdfgenerate);
odRouter.post('/myOrderGet',header_middleware.checkAuthToken,validationMiddleware(ordervalidation.OrderGet),orderMast.myOrderGet);



////pay now 
odRouter.post('/paynow',header_middleware.checkAuthToken,validationMiddleware(ordervalidation.paynow),orderMast.paynow);
odRouter.post('/orderUpdate',header_middleware.checkAuthToken,validationMiddleware(ordervalidation.orderUpdate),orderMast.orderUpdate);



///// get all user address
odRouter.get('/userAddressFill',header_middleware.checkAuthToken,orderMast.userAddressFill);
odRouter.post('/addAddress',header_middleware.checkAuthToken,validationMiddleware(ordervalidation.addAddress),orderMast.addAddress);
odRouter.post('/userAddressRemove',header_middleware.checkAuthToken,validationMiddleware(ordervalidation.userAddressRemove),orderMast.userAddressRemove);


/////// image get home page
odRouter.get('/headerimagesFill',otherMast.headerimagesFill);
odRouter.get('/headerimageoneFill',otherMast.headerimageoneFill);
odRouter.get('/headerimagetwoFill',otherMast.headerimagetwoFill);
odRouter.get('/footerimageFill',otherMast.footerimageFill);
odRouter.post('/footerContactPage',validationMiddleware(ordervalidation.footerContactPage),otherMast.footerContactPage);
odRouter.get('/subscriptionimageFill',otherMast.subscriptionimageFill);
odRouter.post('/subscriptionEmail',validationMiddleware(ordervalidation.subscriptionEmail),otherMast.subscriptionEmail);






////// get all testimonialsFill
odRouter.get('/testimonialsFill',otherMast.testimonialsFill);








//// goToCheckOut
// odRouter.post('/goToCheckOut',header_middleware.checkAuthToken,validationMiddleware(ordervalidation.goToCheckOut),orderMast.goToCheckOut);





//// use gift code on order
odRouter.post('/applyCodeOnOrder',header_middleware.checkAuthToken,validationMiddleware(ordervalidation.applyCodeOnOrder),orderMast.applyCodeOnOrder);

///// add single couple data
// odRouter.post('/updateSingeCouple',header_middleware.checkAuthToken,validationMiddleware(ordervalidation.updateSingeCouple),orderMast.updateSingeCouple);

//// best sale product list
odRouter.post('/getBestSeller',validationMiddleware(validation.productFill),otherMast.getBestSeller);

//// Top Viwe product list
odRouter.post('/getTopView',validationMiddleware(validation.productFill),otherMast.getTopView);

//// add review on product
odRouter.post('/reviewInsUp',header_middleware.checkAuthToken, validationMiddleware(validation.reviewInsUp),otherMast.reviewInsUp);









///// payment COD   
odRouter.post('/placeOrder',header_middleware.checkAuthToken,validationMiddleware(paymentvalidation.placeOrder),paymentMast.placeOrder);
 



module.exports = odRouter 




