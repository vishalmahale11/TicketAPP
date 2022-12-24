const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = async function (req, res, next) {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    res.send("Please Login");
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user_id = decoded.user_id;
  if (decoded) {
    req.body.user_id = user_id;
    next();
  } else {
    res.send("Login Failed");
  }
};

module.exports = { authentication };
