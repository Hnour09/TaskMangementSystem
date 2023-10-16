const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../logger");
const Task = require("../models/task");

const getTasks = async (req, res) => {
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

    // before creating account check if user name exist
    logger.info("Creating task");

    await Task.create(data);
    // const token = jwt.sign({ userName, role }, "lkshfdka%^@$%#y33%^$%^490");

    logger.info("Task created successfully");

    res.status(201);
    res.send("Task created");
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
    // before creating account check if user name exist
    logger.info("Updating task");

    const updatedTask = await Task.findByIdAndUpdate({ _id: id }, body, {
      new: true,
    });

    // Check if the task was successfully updated
    if (!updatedTask) {
      logger.info("Task not found or failed to update");
      res.status(404).send("Task not found or failed to update");
      return;
    }

    logger.info("Task Updated successfully");

    // Assuming you want to send back the updated task
    res
      .status(200)
      .json({ message: "Task updated successfully", data: updatedTask });
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

    // Assuming you want to send back the updated task
    res.status(200).send("Task deleted");
  } catch (error) {
    logger.error(error?.message);
    res.status(500).send("Failed to delete task");
  }
};

const getTasksCreatedByAdmin = async (req, res) => {
  try {
    const { createdBy } = req.query;

    logger.info("Fetching tasks");

    const tasks = await Task.find({ createdBy });

    logger.info("tasks fetched");

    res.status(200);
    res.json({ tasks });
  } catch (error) {
    res.status(500);
    res.send("Failed to fetch tasks");
  }
};
module.exports = { getTasks, createTask, updateTask, getTasksCreatedByAdmin };
