const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];
  if (!token) {
    res.status(400);
    return res.send("Missing token");
  }

  try {
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (error) {
    res.status(401);
    return res.send(error.message);
  }
};

module.exports = validateToken;
