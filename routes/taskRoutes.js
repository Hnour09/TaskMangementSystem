const express = require("express");
const {
  getTask,
  getTasksCreatedByAdmin,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const validateRole = require("../middlewares/validateRole");
const validateToken = require("../middlewares/validateToken");
const router = express.Router();

router.post("/tasks", validateToken, validateRole, createTask);
router.get("/tasks", validateToken, validateRole, getTasksCreatedByAdmin);
router.get("/tasks/:id", validateToken, validateRole, getTask);
router.put("/tasks/:id", validateToken, validateRole, updateTask);
router.delete("/tasks/:id", validateToken, validateRole, deleteTask);

module.exports = router;
