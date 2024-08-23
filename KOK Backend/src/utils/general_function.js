var nodemailer = require('nodemailer');

const db = require("../configs/db");
const user = db.user;

const getUserFromUserToken = async (userToken) => {
    const userData =
    await user.findOne({
        where: {
          user_token: userToken,
        }
    });

    if (userData) {
      return userData;
    } else {
        return null;
    }

}

const getUserFromAuthToken = async (authToken) => {
  const userData =
  await user.findOne({
      where: {
        auth_token: authToken,
      }
  });

  if (userData) {
    return userData.dataValues;
  } else {
      return null;
  }
}

const sendEmailUsingGmail = async (email,subject,content,callback) => {

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'abcbgmiguy@gmail.com',
        pass: 'vfttskrwrtrdqwgr'
    }
  });
  
  var mailOptions = {
    from: 'WeblockInfosoft@gmail.com <custom@example.com>',
    to: email,
    subject: subject,
    text: content
  };
  transporter.sendMail(mailOptions,callback);
}


module.exports = {
    getUserFromUserToken,
    getUserFromAuthToken,
    sendEmailUsingGmail
}