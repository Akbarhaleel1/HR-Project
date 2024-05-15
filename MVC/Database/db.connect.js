const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/mydatabase")
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch(() => {
    console.log("connection failed");
  });

module.exports = mongoose;
