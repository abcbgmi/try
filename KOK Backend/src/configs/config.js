require("dotenv").config();

let CONFIG = {};

CONFIG.env = 'development';
CONFIG.port = process.env.PORT || 4000;

CONFIG.secret_key = process.env.SECRET_KEY || "";

CONFIG.auth_string = process.env.AUTH_STRING || "ASDJASDUDSUERWJASDASDJSDJASDJADS";

CONFIG.ROZERPAY_key_id = process.env.ROZERPAY_key_id || "";
CONFIG.ROZERPAY_key_secret = process.env.ROZERPAY_key_secret || "";

CONFIG.db_name = process.env.DB_NAME || "";
CONFIG.db_user = process.env.DB_USER || "root";
CONFIG.db_password = process.env.DB_PASSWORD || "";

CONFIG.required_headers = process.env.REQUIRED_HEADERS || [];

CONFIG.app_secret = process.env.APP_SECRET || "";



module.exports =  CONFIG;