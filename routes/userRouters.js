const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();

router.get("/users/:id", validateToken(), getUser);
router.put("/users/:id", validateToken(), updateUser);
router.delete("/users/:id", validateToken(), deleteUser);
