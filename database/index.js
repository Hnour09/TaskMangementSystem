const mongoose = require("mongoose");
const logger = require("../logger");

const connectDatabase = () => {
  mongoose
    .connect("mongodb://localhost:27017/test")
    .then(() => logger.info("Connected to database"))
    .catch((err) => console.log(err));
};

module.exports = connectDatabase;
