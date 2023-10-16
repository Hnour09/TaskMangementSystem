const express = require("express");
const logger = require("./logger");
const RateLimiter = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger/swagger.yaml");
const app = express();
const authenticationRoutes = require("./routes/authenticationRoute");
const taskRoutes = require("./routes/taskRoutes");
const usersRoutes = require("./routes/userRouters");
const connectDatabase = require("./database");
require("dotenv").config();

const rateLimitMiddleware = RateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: "You have exceeded your 5 requests per minute limit.",
  headers: true,
});

connectDatabase();

app.use(rateLimitMiddleware);
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`API hit: ${req.method} ${req.url}`);
  next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/auth", authenticationRoutes);
app.use(taskRoutes);
app.use(usersRoutes);

app.listen(4000, () => logger.info("Server is running on port 4000 . . ."));
