const express = require("express");
const allRoutes = express.Router();
const aRouter = require("./auth.routes");
const adRouter = require("./admin.routes.js");
const oRouter = require("./other.routes.js");


//// user
allRoutes.use("/User",aRouter);
allRoutes.use("/User",oRouter);

//// admin 
allRoutes.use("/Admin",adRouter);

module.exports = { allRoutes }