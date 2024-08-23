const { Sequelize, DataTypes } = require("sequelize");
const CONFIG = require('./config');
const path = require('path')
const sequelize = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, {
    host: "localhost", 
    logging: false,
    dialect: 'mysql',
    port: 3306,
})

    try {
        sequelize.authenticate().then(() => {
            console.log('Connection has been established successfully.');
        });
      
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }


    
const db = {};

db.sequelize = sequelize
db.Sequelize = Sequelize

db.user = require("../models/user")(sequelize, DataTypes);
db.product = require("../models/product")(sequelize, DataTypes);
db.productImages = require("../models/productImages")(sequelize, DataTypes);
db.charm = require("../models/charm")(sequelize, DataTypes);
db.couponCard = require("../models/couponCard")(sequelize, DataTypes);
db.category = require("../models/category")(sequelize, DataTypes);
db.color = require("../models/color")(sequelize, DataTypes);
db.image = require("../models/images")(sequelize, DataTypes);
db.orderStatus = require("../models/orderStatus")(sequelize, DataTypes);
db.mycart = require("../models/mycart")(sequelize, DataTypes);
db.user_adress = require("../models/user_adress")(sequelize, DataTypes);
db.order = require("../models/order")(sequelize, DataTypes);
db.orderTrn = require("../models/orderTrn")(sequelize, DataTypes);
db.subscriptionemail = require("../models/subscriptionemail")(sequelize, DataTypes);
db.contactPage = require("../models/contactPage")(sequelize, DataTypes);
db.productReview = require("../models/productReview")(sequelize, DataTypes);







// db.product_variant = require("../models/product_variant")(sequelize, DataTypes);
// db.payment = require("../models/payment")(sequelize, DataTypes);











  





/// uncomment below line to add models to db. 
sequelize.sync({ force: false, alter: true });

module.exports = db