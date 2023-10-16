const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../logger");
const User = require("../models/user");

const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info(`Checking for user with id account ${id}`);

    const user = await User.findById({ _id: id });

    logger.info("User Found");

    res.status(200);
    res.send({ user });
  } catch (error) {
    logger.error(error?.message);
    res.status(500);
    res.send("Failed to fetched user");
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    logger.info(`Checking for user with id account ${id}`);

    const user = await User.findByIdAndUpdate({ _id: id }, body, { new: true });

    logger.info("updated user ");

    res.status(200);
    res.send({ user });
  } catch (error) {
    logger.error(error?.message);
    res.status(500);
    res.send("Failed to update user");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info(`Checking for user with id ${id}`);

    await User.findByIdAndDelete({ _id: id });

    logger.info("Deleted ");

    res.status(200);
    res.send("user deleted");
  } catch (error) {
    logger.error(error?.message);
    res.status(500);
    res.send("Failed to delete user");
  }
};
module.exports = { getUser, updateUser, deleteUser };
