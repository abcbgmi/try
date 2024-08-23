const express = require("express");
const bodyparser = require("body-parser");
const app = express();
app.use(express.json());
var cors = require('cors');

const CONFIG = require('./configs/config');
require("./configs/db")
const path = require("path")

app.use('/src/images', express.static(path.join(__dirname, 'images')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(cors({
    origin: '*'
 }));
 
app.get("/home", (req, res) => {
    res.status(200).send({ status: 1, msg: "welcome to home page chat app"});
});

app.use("/", require("./routes/routes").allRoutes)

app.listen(CONFIG.port, () => {
    console.log(`server start on localhost:${CONFIG.port}`)
});

app.use('*', (req, res, next) => {
    res.status(404).json({
       status: 0,
       message: `Can't find ${req.originalUrl} on this server!`
    });
 });