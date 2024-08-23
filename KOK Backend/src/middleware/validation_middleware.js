
const Joi = require('joi'); 

const validationMiddleware = (validation) => { 
  return (req, res, next) => { 
    
  const {value,error} = validation.validate(req.body);
  const valid = error == null; 
  
  if (valid) { 
    req.body = value;
    next(); 
  } else { 
    const { details } = error; 
    const message = details.map(i => i.message).join(',').replace(/"/g, '');;
    console.log("error", message); 
   res.status(422).json({ status: 0, msg: message }) } 
  } 
} 



module.exports = validationMiddleware
