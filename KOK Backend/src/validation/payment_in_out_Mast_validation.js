const joi = require("joi");	
const valid = require("./shortValidation");
			


// const paymentIn = joi.object({
//   payments: joi.array().items(
//     joi.object({
//       order_id: valid.numberMin(1).required(),
//       user_id:  valid.numberMin(1).required(),
//       payment_account: valid.string.required(),
//       payment_type: valid.string.required(),   
//       // payment_in: valid.precisionMin(0,2).required(),
//       // payment_out: valid.precisionMin(0,2).required(),
//       payment_in: joi.number().precision(2).min(0).when('payment_out', {
//         is: joi.exist(),
//         then: joi.number().valid(0).required(),
//         otherwise: joi.number().required()
//       }),
//       payment_out: joi.number().precision(2).min(0).when('payment_in', {
//         is: joi.exist(),
//         then: joi.number().valid(0).required(),
//         otherwise: joi.number().required()
//       }),
//       payment_total: valid.precisionMin(0,2).required(),
//       // payment_status: joi.string().trim().required().valid('Paid', 'Pending', 'Failed') // Adjust as per your application's payment status options
//     })
//   ).min(1).required()    
// }).unknown(true);

const placeOrder = joi.object({
  user_id: valid.numberMin(1).required(),
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
  }),
  payment_type: valid.stringMin(1).required(),
  payment_in: valid.precisionMin(0,2).required(),
  // payment_out: valid.precisionMin(0,2).required(),
  // payment_total: valid.precisionMin(0,2).required(),
}).unknown(true);
    

module.exports = {
  placeOrder,
};
