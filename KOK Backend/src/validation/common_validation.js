const db = require("../configs/db");
const user = db.user; 


const isUserExistWithEmail = async(email) => {
    const findall =
        await user.findOne({
            where: {
                user_email: email,
            }
        })
    if (findall) {
        return false;
    } else {
        return true;
    }
}


module.exports = {
    isUserExistWithEmail
}