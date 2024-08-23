const joi = require("joi");

const valid = {
  ////login validation

  email: joi
    .string()
    .trim()
    .email(
      { minDomainSegments: 2, tlds: { allow: ["com", "net"] } },
      { allowFullyQualified: 1 }
    ),

  password: joi
    .string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      "any.required": "Password is required.",
    }),

  mobilenumber: joi
    .string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Mobile number must be exactly 10 digits long and contain only numbers.",
      "any.required": "Mobile number is required.",
    }).allow(""),

  pincode: joi
    .string()
    .pattern(/^[0-9]{4,6}$/)
    .message("Pin code must be numeric and between 4 to 6 digits in length")
    .allow("")
    .required()
    .messages({
      "any.required": "Pin code is required.",
    }),

  country: joi
    .string()
    .trim()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z\s]+$/)
    .message("Country name must contain only letters and spaces").allow(""),

  state: joi
    .string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z\s]+$/)
    .message("State name must contain only letters and spaces").allow(""),

  couponCode: joi
    .number()
    .integer()
    .min(100000)
    .max(999999)
    .required()
    .messages({
      "number.base": "Order coupon code must be a number",
      "number.integer": "Order coupon code must be an integer",
      "number.min": "Order coupon code must be at least 6-digit number",
      "number.max": "Order coupon code must be at most 6-digit number",
      "any.required": "Order coupon code is required",
      "any.only": "Order coupon code must be a 6-digit number",
    }),

  string: joi.string().trim(),
  stringMin: (min) => joi.string().trim().min(min),
  stringMax: (max) => joi.string().trim().max(max),
  stringMinMax: (min, max) => joi.string().trim().min(min).max(max),

  integer: joi.number().integer(),
  numberMin: (min) => joi.number().integer().min(min),
  numberMax: (max) => joi.number().integer().max(max),
  numberMinMax: (min, max) => joi.number().integer().min(min).max(max),

  // joi.number().min(1).max().precision(2).required()
  precisionMin: (min, pri) => joi.number().min(min).precision(pri),
  precisionMax: (max, pri) => joi.number().max(max).precision(pri),
  precisionMinMax: (min, max, pri) =>
    joi.number().min(min).max(max).precision(pri),
};

module.exports = valid;
