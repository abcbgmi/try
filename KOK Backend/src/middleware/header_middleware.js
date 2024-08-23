const CONFIG = require('../configs/config');

const checkAuthToken = async (req, res, next) => {
    var token = req.headers["Auth-Token".toLowerCase()];
    // console.log(token);
    // return
    if(!token){
        // console.log("*******************");
        return res.status(401).send({ status: 0, msg: 'Auth-Token not found.' });
    }
    if(token){
        // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
           const user =  await require("../utils/general_function").getUserFromAuthToken(token);
           if(user){
            req.body.user_detail = user;
            next();
           }else{
            res.send({ status: 0, msg: `Auth-Token Expired Login First.` });    
           }
    }else{
        res.send({ status: 0, msg: `Auth-Token not found` });
    }
}


module.exports = {checkAuthToken}
