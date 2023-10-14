const validateToken = (req, res, next) => {
  const { authorization: token } = req.headers;

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
