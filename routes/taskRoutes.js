const express = require("express");
const {
  getTasks,
  getTasksCreatedByAdmin,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/userController");
const router = express.Router();

router.post("/tasks", validateToken(), validateRole(), createTask);
router.get("/tasks/:id", validateToken(), validateRole(), getTasks);
router.put("/tasks/:id", validateToken(), validateRole(), updateTask);
router.get("/tasks", validateToken(), validateRole(), getTasksCreatedByAdmin);
router.delete("/tasks/:id", validateToken(), validateRole(), deleteTask);
