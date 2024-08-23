const joi = require("joi");	
const valid = require("./shortValidation");
const product = require("../models/product");
			

// const addToCart = joi.object({
//   order_id: joi.number().integer().required(),
//   product_id: joi.number().integer().min(1).required(),
//   user_id: joi.number().integer().min(1).required(),
//   SubData: joi.object({
//       orderTrn_id: joi.number().integer().required(),
//       product_one_name: joi.string().min(1).max(50).required(),
//       product_two_name: joi.string().min(1).max(50).required(),
//       product_one_charm: joi.number().integer().min(1).required(),
//       product_two_charm: joi.number().integer().min(1).required(),
//       product_one_color: joi.string().min(1).max(50).required(),
//       product_two_color: joi.string().min(1).max(50).required()
//   }).required()
// }).unknown(true);


const addToCart = joi.object({
  mycart_id: valid.integer.required(),
  product_id: valid.numberMin(1).required(),
  user_id: valid.numberMin(1).required(),
}).unknown(true);


const addAddress = joi.object({
  user_first_name: valid.stringMinMax(3,50).required(),
  user_last_name: valid.stringMinMax(3,50).required(),
  user_mobile_no: valid.mobilenumber,
  user_address : valid.stringMinMax(0,100).required(),
  user_pincode: valid.pincode,
  user_country: valid.country.required(),
  user_state: valid.state.required()
}).unknown(true);

const userAddressRemove = joi.object({
  user_adress_id: valid.numberMin(1).required()
}).unknown(true);

const addToOrder = joi.object({
  order_id : valid.integer.required(),
  user_id: valid.numberMin(1).required(),
  order_total: valid.precisionMin(0,2).required(),
  user_first_name: valid.stringMinMax(0,50).required(),
  user_last_name: valid.stringMinMax(0,50).required(),
  user_mobile_no: valid.mobilenumber,
  user_address : valid.stringMinMax(0,100).required(),
  user_pincode: valid.pincode,
  user_country: valid.country.required(),
  user_state: valid.state.required(),
  payment_type : valid.stringMinMax(0,50).required(),
  SubData: joi.array().items(
     joi.object({
      orderTrn_id : valid.integer.required(),
      product_id: valid.numberMin(1).required(),
      mycart_id: valid.numberMin(1).required(),
      product_quantity : valid.numberMin(1).required(),
      product_price : valid.precisionMin(0,2).required(),
      Product_GST : valid.precisionMin(0,2).required(),
      Product_tax : valid.precisionMin(0,2).required(),
      order_coupon_code : valid.numberMin(0,6).required(),
  }).required().unknown(true)
).required()
}).unknown(true);




// SubData: Joi.array().items(
//   Joi.object({
//     orderTrn_id: valid.integer.required(),
//     product_id: valid.numberMin(1).required(),
//     mycart_id: valid.numberMin(1).required(),
//     product_quantity: valid.numberMin(1).required(),
//     product_price: valid.precisionMin(0, 2).required(),
//     Product_GST: valid.precisionMin(0, 2).required(),
//     Product_tax: valid.precisionMin(0, 2).required(),
//     order_coupon_code: valid.integer.required()
//   })
// ).required()



const OrderGet = joi
  .object({
    order_id: valid.integer.required(),
  }).unknown(true);

  const pdfgenerate = joi
  .object({
    order_id: valid.numberMin(1).required(),
  }).unknown(true);

const CartGet = joi
  .object({
    mycart_id: valid.integer.required(),
  }).unknown(true);


  // const orderDelete = joi
  // .object({
  //   order_id: joi.number().integer().min(1).required(),
  // }).unknown(true);

  const CartProductDelete = joi
  .object({
    mycart_id: valid.numberMin(1).required(),
  }).unknown(true);



  // const applyCodeOnOrder = joi
  // .object({
  //   order_id: joi.number().integer().min(1).required(),
  //   order_coupon_code: joi.number().integer().min(100000).max(999999).required() .messages({
  //     'number.base': 'Order coupon code must be a number',
  //     'number.integer': 'Order coupon code must be an integer',
  //     'number.min': 'Order coupon code must be at least 6-digit number',
  //     'number.max': 'Order coupon code must be at most 6-digit number',
  //     'any.required': 'Order coupon code is required',
  //     'any.only': 'Order coupon code must be a 6-digit number'
  //   }),
  // }).unknown(true);

  const applyCodeOnOrder = joi
  .object({
    order_id: valid.numberMin(1).required(),
    product_id : valid.numberMin(1).required(),
    // product_quantity : valid.numberMin(1).required(),
    order_coupon_code: valid.couponCode,
  }).unknown(true);



  const updateSingeCouple = joi
  .object({
    product_id: valid.numberMin(1).required(),
    product_type: valid.stringMin(1).required(),
  }).unknown(true);

  const goToCheckOut = joi
  .object({
    user_id: valid.numberMin(1).required(),
    order_sub_total : valid.precisionMin(1,2).required(),
    order_total_gst : valid.precisionMin(0,2).required(),
    order_total_tax : valid.precisionMin(0,2).required(),
    order_shipping : valid.precisionMin(0,2).required(),
    order_discount : valid.precisionMin(0,2).required(),
    order_total_Amt : valid.precisionMin(1,2).required(),
    order_ids: joi.string()
    .custom((value, helpers) => {
      try {
        // Parse the string to a JSON array
        const parsedArray = JSON.parse(value);

        // Check if the parsed value is an array
        if (!Array.isArray(parsedArray)) {
          return helpers.message('Input is not an array');
        }

        // Check if all elements in the array are non-negative numbers
        for (const item of parsedArray) {
          if (typeof item !== 'number' || item <= 0) {
            return helpers.message('All elements in the array must be positive numbers greater than 0');
          }
        }

        return value; // Return the value if it's valid
      } catch (e) {
        return helpers.message('Invalid JSON format');
      }
    }, 'Array of non-negative numbers validation')
    .messages({
      'string.base': 'Input must be a string',
      'any.required': 'Input is required',
    })
  }).unknown(true);



  /////// subscreiption email add validation
  const subscriptionEmail = joi
  .object({
    user_email: valid.email.required(),
  }).unknown(true);

    /////// footer image contact page
    const footerContactPage = joi
    .object({
      user_first_name: valid.stringMinMax(3,50).required(),
      user_last_name: valid.stringMinMax(3,50).required(),
      user_email: valid.email.required(),
      user_mobile_no: valid.mobilenumber,
      msg: valid.stringMinMax(1,1e9).required(),
    }).unknown(true);


    /////// paynow
    const paynow = joi
    .object({
      order_total: valid.precisionMin(1,2).required(),
      currency: valid.stringMinMax(3,50).required(),
    }).unknown(true);

    const orderUpdate = joi
    .object({
      order_id: valid.numberMin(1).required(), 
      payment_id: valid.stringMinMax(1,50).required(),
      user_first_name: valid.stringMinMax(3,50).required(),
      user_last_name: valid.stringMinMax(3,50).required(),
      user_mobile_no: valid.mobilenumber,
      user_pincode: valid.pincode,
      user_country: valid.country.required(),
      user_state: valid.state.required(),
      order_total: valid.precisionMin(1,2).required(),
      user_address: valid.stringMinMax(1,100).required(),
      // payment_type: valid.stringMinMax(1,20).required(),
    }).unknown(true);


module.exports = {
  addToCart,
  CartGet,
  addAddress,
  userAddressRemove,
  addToOrder,
  OrderGet,
  CartProductDelete,
  applyCodeOnOrder,
  updateSingeCouple,
  goToCheckOut,
  pdfgenerate,
  subscriptionEmail,
  footerContactPage,
  paynow,
  orderUpdate
};
