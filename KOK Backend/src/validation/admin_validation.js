const joi = require("joi");	
const valid = require("./shortValidation.js")

////// admin register
const register = joi.object({
  user_first_name: valid.stringMinMax(3,50).required(),
  user_last_name: valid.stringMinMax(3,50).required(),
  user_email: valid.email.required(),
  user_password: valid.password,
  user_mobile_no: valid.mobilenumber,
});

const login = joi.object({
  user_email: valid.email.required(),
  user_password: valid.password,
  });
 


///// product data
const productInsUp = joi.object({ 
  product_id: valid.integer.required(),
  product_name: valid.stringMinMax(3,1e9).required(),   
  product_description: valid.stringMinMax(0,1e9).required(),
  product_quantity : valid.integer.required(),
  product_price: valid.precisionMin(1,2).required(),
  GST: valid.precisionMin(0,2).required(),  
  Product_tax: valid.precisionMin(0,2).required(),
  product_discount: valid.precisionMin(0,2).required(),
  // product_modify_object: productModifyObjectSchema.required(),
  // product_discount_price: valid.precisionMin(0,2).required(),
  product_video: valid.stringMin(0).required(),
  shipping_charge: valid.precisionMin(0,2).required(),
  product_category: valid.numberMin(1).required(),
}).unknown(true);



// "{"bag name":"Text",
//   "bag colors":[{"id":4,"color":"SDEEDF"}],
//   "bag charm":[{"id":1,"charmName":"QUEEN"},
//   {"id":3,"charmName":"KING"},    
// {"id":4,"charmName":"ABC"}]}"

// "{\"bag name\":\"Text\",\"bag colors\":[{\"id\":4,\"color\":\"RED\"},{\"id\":6,\"color\":\"WHITE\"}],\"bag charm\":[{\"id\": 1,\"charmName\":\"QUEEN\"},{\"id\":3,\"charmName\":\"KING\"},{\"id\":4,\"charmName\":\"ABC\"}]}"


const productFill = joi.object({ 
  product_id: valid.integer.required(),
  }).unknown(true);



const productFillByCategory = joi.object({
  category: valid.numberMin(1).required(),
  product_id: valid.integer.required()
}).unknown(true);


  const productDelete = joi
  .object({
    product_id: valid.numberMin(1).required(),
  }).unknown(true);


  const productActiveDeactive = joi.object({
  product_id: valid.numberMin(1).required(),
  status: valid.numberMinMax(0,1).required()
}).unknown(true);





///// charm data
const charmInsUp = joi.object({
  charm_id: valid.integer.required(),
  charm_name: valid.stringMinMax(2,50).required(),
  charm_description: valid.stringMinMax(0,1e9).required(),
  charm_price: valid.precisionMin(0,2)
}).unknown(true);


const charmFill = joi
.object({
  charm_id: valid.integer.required(), 
}).unknown(true);


const charmDelete = joi
.object({
  charm_id: valid.numberMin(1).required(),
}).unknown(true);

const charmActiveDeactive = joi
.object({
  charm_id: valid.numberMin(1).required(),
  status: valid.numberMinMax(0,1).required()
}).unknown(true);




/////// order data
const orderStatusInsUp = joi.object({
  status_id: valid.integer.required(),
  status_name: valid.stringMinMax(2,50).required(),
}).unknown(true);


const orderStatusFill = joi
.object({
  status_id: valid.integer.required(), 
}).unknown(true);


const orderStatusDelete = joi
.object({
  status_id: valid.numberMin(1).required(),
}).unknown(true);




////// colors data
const colorInsUp = joi.object({
  color_id: valid.integer.required(),
  color_name: valid.stringMinMax(2,50).required(),
}).unknown(true);

const colorFill = joi
.object({
  color_id: valid.integer.required(), 
}).unknown(true);

const colorDelete = joi
.object({
  color_id: valid.numberMin(1).required(),
}).unknown(true);

const colorActiveDeactive = joi
.object({
  color_id: valid.numberMin(1).required(),
  status: valid.numberMinMax(0,1).required()
}).unknown(true);






///// giftcard data
const couponCardInsUp = joi.object({
  couponCard_id: valid.integer.required(),
  couponCard_name: valid.stringMinMax(2,50).required(),
  couponCard_image: valid.stringMin(0).required(),
  discount_Amt: valid.precisionMin(0,2).required(),
  discount_per: valid.precisionMin(0,2).required(),
  product_id : valid.numberMin(1).required(),
}).unknown(true);


const couponCardFill = joi
.object({
  couponCard_id: valid.integer.required(), 
}).unknown(true);


const couponCardDelete = joi
.object({
  couponCard_id: valid.numberMin(1).required(), 
}).unknown(true);


const couponCardActiveDeactive = joi
.object({
  couponCard_id: valid.numberMin(1).required(),
  status: valid.numberMinMax(0,1).required()
}).unknown(true);



///// category data
const categoryInsupd = joi.object({
  category_id: valid.integer.required(),
  category_name: valid.stringMin(1).required(),
  // category_image: valid.stringMin(0).required(),
  // category_banner_image: valid.stringMin(0).required(),  
}).unknown(true);


const categoryDelete = joi.object({
  category_id: valid.numberMin(1).required()
}).unknown(true);

const categoryActiveDeactive = joi
.object({
  category_id: valid.numberMin(1).required(),
  status: valid.numberMinMax(0,1).required()
}).unknown(true);





///// review data
const reviewInsUp = joi.object({
  review_id : valid.integer.required(),
  product_id: valid.numberMin(1).required(),
  user_id: valid.numberMin(1).required(),
  rating : valid.numberMinMax(0,5).required(),
  review_text : valid.stringMinMax(0,1e9).required()
}).unknown(true);


///// comment handle
const commentremove = joi.object({ 
  review_id: valid.numberMin(1).required(),
}).unknown(true);

const addtestimonials = joi.object({ 
  review_id: valid.numberMin(1).required(),
  status: valid.numberMinMax(0,1).required()
}).unknown(true);


///// stars && product manage for sale 
const addstars = joi.object({ 
  review_id : valid.integer.required(),
  product_id: valid.numberMin(1).required(),
  user_id: valid.numberMin(1).required(),
  rating : valid.numberMinMax(0,5).required(),
  review_text : valid.stringMinMax(0,1e9).required()
}).unknown(true);

const removestars = joi.object({ 
  review_id : valid.integer.required(),
}).unknown(true);



///// manage bestseller
const addbestseller = joi
.object({
  product_id: valid.numberMin(1).required(),
  status : valid.numberMinMax(0,1).required()
}).unknown(true);

const getBestSaller = joi
.object({
  product_id: valid.integer.required(),
}).unknown(true);


///// manage bestseller
const addTopView = joi
.object({
  product_id: valid.numberMin(1).required(),
  status : valid.numberMinMax(0,1).required()
}).unknown(true);

const getTopView = joi
.object({
  product_id: valid.integer.required(),
}).unknown(true);

///////get all topBuyers
const getopBuyers = joi
.object({
  user_id: valid.integer.required()
}).unknown(true);








///////get all orders and manage
const getorderlist = joi
.object({
  order_id: valid.integer.required()
}).unknown(true);

const updateorderSatatus = joi
.object({
  order_id: valid.integer.required(),
  status_id: valid.numberMin(1).required()
}).unknown(true);

const dashboarddetails = joi
.object({
  status_id: valid.integer.required(),
  filter: valid.stringMin(0).required()
}).unknown(true);




/////pdf 

const pdfgenerate = joi
.object({
  order_id: valid.numberMin(1).required(),
}).unknown(true);




  

const getOrdersByuserId = joi
.object({
  user_id: valid.numberMin(1).required()
});

const updateAllOrderStatus = joi
.object({
  user_id: valid.numberMin(1).required(),
  order_status: valid.numberMin(1).required(), 
});

const updateOneOrderStatus = joi
.object({
  user_id: valid.numberMin(1).required(),
  order_id: valid.numberMin(1).required(),
  order_status: valid.numberMin(1).required(), 
});

module.exports = {
  register,
  login,
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
  couponCardInsUp,
  couponCardFill,
  couponCardDelete,
  couponCardActiveDeactive,
  getOrdersByuserId,
  updateAllOrderStatus,
  updateOneOrderStatus,
  categoryInsupd,
  categoryDelete,
  categoryActiveDeactive,
  reviewInsUp,
  colorInsUp,
  colorFill,
  colorDelete,
  colorActiveDeactive,
  commentremove,
  addtestimonials,
  addstars,
  removestars,
  getorderlist,
  updateorderSatatus,
  dashboarddetails,
  addbestseller,
  getBestSaller,
  addTopView,
  getTopView,
  getopBuyers,
  pdfgenerate
};
