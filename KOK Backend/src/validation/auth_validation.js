const joi = require("joi");	
const valid = require("./shortValidation.js")

// const register = joi.object({
//   user_first_name: joi.string().trim().min(3).max(50).required(),
//   user_last_name: joi.string().trim().min(3).max(50).required(),
//   user_email: joi
//     .string()
//     .trim()
//     .email(
//       { minDomainSegments: 2, tlds: { allow: ["com", "net"] } },
//       { allowFullyQualified: 1 }
//     )
//     .required(),
//   user_password: joi
//     .string()
//     .pattern(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
//     )
//     .required()
//     .messages({
//       "string.pattern.base":
//         "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
//       "any.required": "Password is required.",
//     }),
//   user_confirm_password: joi
//     .string()
//     .pattern(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
//     )
//     .required()
//     .messages({
//       "string.pattern.base":
//         "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
//       "any.required": "Password is required.",
//     }),
//   user_mobile_no: joi
//     .string()
//     .pattern(/^[0-9]{10}$/)
//     .required()
//     .messages({
//       "string.pattern.base":
//         "Mobile number must be exactly 10 digits long and contain only numbers.",
//       "any.required": "Mobile number is required.",
//     }),
// });

const register = joi.object({
  user_first_name: valid.stringMinMax(3,50).required(),
  user_last_name: valid.stringMinMax(3,50).required(),
  user_email: valid.email.required(),
  user_password: valid.password,
  user_confirm_password: valid.password,
  user_mobile_no: valid.mobilenumber,
});

// const login = joi.object({
//   user_email: joi
//     .string()
//     .trim()
//     .email(
//       { minDomainSegments: 2, tlds: { allow: ["com", "net"] } },
//       { allowFullyQualified: 1 }
//     )
//     .required(),
//   user_password: joi
//     .string()
//     .pattern(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
//     )
//     .required()
//     .messages({
//       "string.pattern.base":
//         "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
//       "any.required": "Password is required.",
//     }),
// });


const login = joi.object({
  user_email: valid.email.required(),
  user_password: valid.password,
  });

// const changePassword = joi.object({
//   old_password: joi
//     .string()
//     .pattern(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
//     )
//     .required()
//     .messages({
//       "string.pattern.base":
//         "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
//       "any.required": "Password is required.",
//     }),
//   new_password: joi
//     .string()
//     .pattern(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
//     )
//     .required()
//     .messages({
//       "string.pattern.base":
//         "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
//       "any.required": "Password is required.",
//     }),
//   new_confirm_password: joi
//     .string()
//     .pattern(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
//     )
//     .required()
//     .messages({
//       "string.pattern.base":
//         "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
//       "any.required": "Password is required.",
//     }),
// });

const changePassword = joi.object({
  old_password: valid.password,
  new_password: valid.password,
  new_confirm_password: valid.password,
});

// const updateUser = joi.object({
//   user_id: joi.number().integer().min(1).required(),
//   user_first_name: joi.string().trim().min(3).max(50).required(),
//   user_last_name: joi.string().trim().min(3).max(50).required(),
//   user_mobile_no: joi
//     .string()
//     .pattern(/^[0-9]{10}$/)
//     .required()
//     .messages({
//       "string.pattern.base":
//         "Mobile number must be exactly 10 digits long and contain only numbers.",
//       "any.required": "Mobile number is required.",
//     }),
//   user_address: joi.string().trim().min(0).max(100).required(),
//   user_pincode: joi
//     .string()
//     .pattern(/^[0-9]{4,6}$/)
//     .message(
//       "Pin code must be alphanumeric and between 3 to 10 characters in length"
//     ),
//   user_country: joi
//     .string()
//     .trim()
//     .min(2)
//     .max(100)
//     .pattern(/^[a-zA-Z\s]+$/)
//     .message("Country name must contain only letters and spaces"),
//   user_state: joi
//     .string()
//     .min(2)
//     .max(100)
//     .pattern(/^[a-zA-Z\s]+$/)
//     .message("State name must contain only letters and spaces"),
//   user_profile_photo: joi.string().min(0).required(),    
// });

const updateUser = joi.object({
  user_id: valid.numberMin(1).required(),
  user_first_name: valid.stringMinMax(3,50).required(),
  user_last_name: valid.stringMinMax(3,50).required(),
  user_mobile_no: valid.mobilenumber,
  user_address: valid.stringMinMax(0,100).required(),
  user_pincode: valid.pincode,
  user_country: valid.country.required(),
  user_state: valid.state.required(),
  user_profile_photo: valid.stringMin(0).required(),    
}).unknown(true);


// const userFill = joi
//   .object({
//     user_id: joi.number().integer().min(1).required(),
//   })
//   .unknown(true);

const userFill = joi
  .object({
    user_id: valid.numberMin(1).required(),
  })
  .unknown(true);

// const removeUser = joi
//   .object({
//     user_id: joi.number().integer().min(1).required(),
//   })
//   .unknown(true);

  const removeUser = joi
  .object({
    user_id: valid.numberMin(1).required(),
  })
  .unknown(true);

// const forgotPassword = joi
//   .object({
//     user_email: joi
//       .string()
//       .trim()
//       .email(
//         { minDomainSegments: 2, tlds: { allow: ["com", "net"] } },
//         { allowFullyQualified: 1 }
//       )
//       .required(),
//   })
//   .unknown(true);

  const forgotPassword = joi
  .object({
    user_email: valid.email.required(),
  })
  .unknown(true);

// const changePasswordWithVerificationCode = joi
//   .object({
//     verify_code: joi.string().trim().min(4).max(4).required(),
//     user_email: joi
//     .string()
//     .trim()
//     .email(
//       { minDomainSegments: 2, tlds: { allow: ["com", "net"] } },
//       { allowFullyQualified: 1 }
//     )
//     .required(),
//     user_password: joi
//     .string()
//     .pattern(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
//     )
//     .required()
//     .messages({
//       "string.pattern.base":
//         "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
//       "any.required": "Password is required.",
//     }),
//   })
//   .unknown(true);


const changePasswordWithVerificationCode = joi
  .object({
    verify_code: valid.numberMinMax(4,4).required(),
    user_email: valid.email.required(),
    user_password: valid.password,
  })
  .unknown(true);

module.exports = {
  register,
  login,
  changePassword,
  updateUser,
  userFill,
  removeUser,
  forgotPassword,
  changePasswordWithVerificationCode,
};
