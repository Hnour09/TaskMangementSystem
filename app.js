const express = require("express");
const mongoose = require("mongoose");
const logger = require("./logger");
const User = require("./models/user");
const Task = require("./models/task");
const jwt = require("jsonwebtoken");
const { validateToken } = require("./middlewares/validateToken");
const validateRole = require("./middlewares/validateRole");
const RateLimiter = require("express-rate-limit");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
require("dotenv").config();
const app = express();
const authenticationRoute = require("./routes/aurhenticationRoute");
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
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Task Managment System",
    },
  },
  apis: ["./app.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const rateLimitMiddleware = RateLimiter({
  windowMs: 60 * 1000,
  max: 5,
  message: "You have exceeded your 5 requests per minute limit.",
  headers: true,
});

// app.use(rateLimitMiddleware);

/**
 * @swagger
 * /auth/signUp:
 *    post:
 *     description: sign up Admin or Regular User
 *     responces:
 *      201:Success
 *
 */
// app.post("/auth/signup", async (req, res) => {
//   try {
//     const body = req.body;

//     const { userName, role } = body;
//     // before creating account check if user name exist
//     logger.info("Creating account");

//     await User.create(body);
//     const token = jwt.sign({ userName, role }, "lkshfdka%^@$%#y33%^$%^490");

//     logger.info("Account created successfully");

//     res.status(201);
//     res.send({ token });
//   } catch (error) {
//     logger.error(error?.message);
//     res.status(500);
//     res.send("Failed to create account");
//   }
// });

// app.post("/auth/signin", async (req, res) => {
//   try {
//     const { userName } = req.body;

//     logger.info("Checking account ");

//     const user = await User.findOne({ userName });

//     const token = jwt.sign(
//       { userName: user.userName, role: user.role },
//       process.env.SECRET_KEY
//     );

//     logger.info("Logged in successfully");

//     res.status(200);
//     res.send({ token });
//   } catch (error) {
//     logger.error(error?.message);
//     res.status(500);
//     res.send("Failed to log in");
//   }
// });
app.use("/auth", authenticationRoute);

// app.get("/users/:id", validateToken, async (req, res) => {
//   try {
//     const { id } = req.params;

//     logger.info(`Checking for user with id account ${id}`);

//     const user = await User.findById({ _id: id });

//     logger.info("User Found");

//     res.status(200);
//     res.send({ user });
//   } catch (error) {
//     logger.error(error?.message);
//     res.status(500);
//     res.send("Failed to fetched user");
//   }
// });

// app.put("/users/:id", validateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const body = req.body;

//     logger.info(`Checking for user with id account ${id}`);

//     const user = await User.findByIdAndUpdate({ _id: id }, body, { new: true });

//     logger.info("updated ");

//     res.status(200);
//     res.send({ user });
//   } catch (error) {
//     logger.error(error?.message);
//     res.status(500);
//     res.send("Failed to update user");
//   }
// });

// app.delete("/users/:id", validateToken, async (req, res) => {
//   try {
//     const { id } = req.params;

//     logger.info(`Checking for user with id ${id}`);

//     const user = await User.findByIdAndDelete({ _id: id });

//     logger.info("Deleted ");

//     res.status(200);
//     res.send("user deleted");
//   } catch (error) {
//     logger.error(error?.message);
//     res.status(500);
//     res.send("Failed to delete user");
//   }
// });

// app.get("/tasks/:id", validateToken, validateRole, async (req, res) => {
//   try {
//     const { id } = req.params;

//     logger.info(`Checking for task with id ${id}`);

//     const task = await Task.findById({ _id: id });

//     logger.info("task Found");

//     res.status(200);
//     res.send({ task });
//   } catch (error) {
//     logger.error(error?.message);
//     res.status(500);
//     res.send("Failed to fetch task");
//   }
// });

// app.get("/tasks/:id", validateToken, validateRole, async (req, res) => {
//   try {
//     const { id } = req.params;

//     logger.info(`Checking for task with id ${id}`);

//     const task = await Task.findById({ _id: id });

//     logger.info("task Found");

//     res.status(200);
//     res.send({ task });
//   } catch (error) {
//     logger.error(error?.message);
//     res.status(500);
//     res.send("Failed to fetch task");
//   }
// });

// app.post("/tasks", validateToken, validateRole, async (req, res) => {
//   try {
//     const body = req.body;
//     const { userName: createdBy } = req.user;
//     const data = { ...body, createdBy };

//     // before creating account check if user name exist
//     logger.info("Creating task");

//     await Task.create(data);
//     // const token = jwt.sign({ userName, role }, "lkshfdka%^@$%#y33%^$%^490");

//     logger.info("Task created successfully");

//     res.status(201);
//     res.send("Task created");
//   } catch (error) {
//     logger.error(error?.message);
//     res.status(500);
//     res.send("Failed to create task");
//   }
// });

// app.put("/tasks/:id", validateToken, validateRole, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const body = req.body;
//     // before creating account check if user name exist
//     logger.info("Updating task");

//     const updatedTask = await Task.findByIdAndUpdate({ _id: id }, body, {
//       new: true,
//     });

//     // Check if the task was successfully updated
//     if (!updatedTask) {
//       logger.info("Task not found or failed to update");
//       res.status(404).send("Task not found or failed to update");
//       return;
//     }

//     logger.info("Task Updated successfully");

//     // Assuming you want to send back the updated task
//     res
//       .status(200)
//       .json({ message: "Task updated successfully", data: updatedTask });
//   } catch (error) {
//     logger.error(error?.message);
//     res.status(500).send("Failed to update task");
//   }
// });

// app.delete("/tasks/:id", validateToken, validateRole, async (req, res) => {
//   try {
//     const { id } = req.params;

//     logger.info("Deleting task");

//     // Check if the task exist

//     await Task.findByIdAndDelete({ _id: id });

//     logger.info("Task Deleted successfully");

//     // Assuming you want to send back the updated task
//     res.status(200).send("Task deleted");
//   } catch (error) {
//     logger.error(error?.message);
//     res.status(500).send("Failed to delete task");
//   }
// });

// app.get("/tasks", validateToken, validateRole, async (req, res) => {
//   try {
//     const { createdBy } = req.query;

//     logger.info("Fetching tasks");

//     const tasks = await Task.find({ createdBy });

//     logger.info("tasks fetched");

//     res.status(200);
//     res.json({ tasks });
//   } catch (error) {
//     res.status(500);
//     res.send("Failed to fetch tasks");
//   }
// });
app.listen(4000, () => logger.info("Server is running on port 4000 . . ."));
