const express = require("express");
const mongoose = require("mongoose");
const logger = require("./logger");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const { validateToken } = require("./middlewares/validateToken");
const app = express();
require("dotenv").config();

mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => logger.info("Connected to database"))
  .catch((err) => console.log(err));

// For monitoring
app.use((req, res, next) => {
  logger.info(`API hit: ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

app.post("/auth/signup", async (req, res) => {
  try {
    const body = req.body;

    const { userName, role } = body;
    // before creating account check if user name exist
    logger.info("Creating account");

    await User.create(body);
    const token = jwt.sign({ userName, role }, "lkshfdka%^@$%#y33%^$%^490");

    logger.info("Account created successfully");

    res.status(201);
    res.send({ token });
  } catch (error) {
    logger.error(error?.message);
    res.status(500);
    res.send("Failed to create account");
  }
});

app.post("/auth/signin", async (req, res) => {
  try {
    const { userName } = req.body;

    logger.info("Checking account ");

    const user = await User.find({ userName });

    const token = jwt.sign(
      { userName: user.userName, role: user.role },
      process.env.SECRET_KEY
    );

    logger.info("Logged in successfully");

    res.status(200);
    res.send({ token });
  } catch (error) {
    logger.error(error?.message);
    res.status(500);
    res.send("Failed to log in");
  }
});

app.get("/users/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;

    logger.info(`Checking  for user with id account ${id}`);

    const user = await User.findById({ _id: id });

    logger.info("User Found");

    res.status(200);
    res.send({ user });
  } catch (error) {
    logger.error(error?.message);
    res.status(500);
    res.send("Failed to fetched user");
  }
});

app.listen(4000, () => logger.info("Server is running on port 4000 . . ."));
