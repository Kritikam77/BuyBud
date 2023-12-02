const mongoose = require("mongoose");
const express = require("express");
const app = require("./app.js");


// console.log(process.env.PORT);
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));


// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
