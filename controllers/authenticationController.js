const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../logger");
const User = require("../models/user");

const signUp = async (req, res) => {
  try {
    const body = req.body;

    const { userName, role } = body;
    // before creating account check if user name exist
    logger.info("Creating account");

    const createdUser = await User.create(body);
    const token = jwt.sign({ userName, role }, "lkshfdka%^@$%#y33%^$%^490");

    logger.info("Account created successfully");

    res.status(201);
    res.send({
      userId: createdUser._id,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    logger.error(error?.message);
    res.status(500);
    res.send("Failed to create account");
  }
};

const signIn = async (req, res) => {
  try {
    const { userName } = req.body;

    logger.info("Checking account ");

    const user = await User.findOne({ userName });

    const token = jwt.sign(
      { userName: user.userName, role: user.role },
      process.env.SECRET_KEY
    );

    logger.info("Logged in successfully");

    res.status(200);
    res.send({ userId: user._id, token });
  } catch (error) {
    logger.error(error?.message);
    res.status(500);
    res.send("Failed to log in");
  }
};
module.exports = { signUp, signIn };
