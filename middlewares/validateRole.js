const jwt = require("jsonwebtoken");

const validateRole = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];

  const { role } = jwt.verify(token, process.env.SECRET_KEY);

  if (role !== "admin") {
    res.status(401);
    return res.send("Not authorized");
  }
  next();
};
module.exports = validateRole;
