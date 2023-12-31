const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../logger");
const Task = require("../models/task");

const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info(`Checking for task with id ${id}`);

    const task = await Task.findById({ _id: id });

    logger.info("task Found");

    res.status(200);
    res.send({ task });
  } catch (error) {
    logger.error(error?.message);
    res.status(500);
    res.send("Failed to fetch task");
  }
};
const createTask = async (req, res) => {
  try {
    const body = req.body;
    const { userName: createdBy } = req.user;
    const data = { ...body, createdBy };

    logger.info("Creating task");

    const createdTask = await Task.create(data);
    logger.info("Task created successfully");

    res.status(201).json({ taskId: createdTask._id, message: "Task created" });
  } catch (error) {
    logger.error(error?.message);
    res.status(500);
    res.send("Failed to create task");
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    logger.info("Updating task");

    const updatedTask = await Task.findByIdAndUpdate({ _id: id }, body, {
      new: true,
    });

    logger.info("Task Updated successfully");
    res.status(200).json({ taskId: updatedTask._id, message: "Task updated" });
  } catch (error) {
    logger.error(error?.message);
    res.status(500).send("Failed to update task");
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info("Deleting task");

    // Check if the task exist

    await Task.findByIdAndDelete({ _id: id });

    logger.info("Task Deleted successfully");

    res.status(200).send("Task deleted");
  } catch (error) {
    logger.error(error?.message);
    res.status(500).send("Failed to delete task");
  }
};

const getTasksCreatedByAdmin = async (req, res) => {
  try {
    const { createdBy } = req.query;
    const tasks = await Task.find({ createdBy });

    if (tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "No tasks found for this admin." });
    }

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tasks." });
  }
};
module.exports = {
  getTask,
  createTask,
  updateTask,
  getTasksCreatedByAdmin,
  deleteTask,
};
