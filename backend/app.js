const express = require("express");
const app = express();
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const {ErrorMiddleware}=require('./middlewares/errorMiddleware')
const cookieParser = require("cookie-parser");
const cors = require("cors");

const path = require("path");


// Load environment variables from config.env file
// require("dotenv").config({ path: "./config/config.env" });
require("dotenv").config({
  path: path.resolve(__dirname, "config/config.env"),
});



// Middleware
app.use(express.json());
// app.urlencoded({ extended: true })
app.use(cookieParser());
app.use(cors());

app.use('/api',userRoutes)
app.use('/api',productRoutes)
app.use("/api", postRoutes);


//so every function call if encountered with an error goes through an errorMiddleware
app.use(ErrorMiddleware)

module.exports=app