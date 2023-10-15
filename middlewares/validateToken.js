const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  console.log(token);

  console.log(token);

  if (!token) {
    res.status(400);
    return res.send("Missing token");
  }

  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

  req.user = decodedToken;

  next();
};

module.exports = {
  validateToken,
};
