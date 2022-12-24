const express = require("express");
const cors = require("cors");
const connection = require("../config/db");
const UserModel = require("../models/UserModel");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TicketModel = require("../models/TicketModel");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8040;

app.get("/", async (req, res) => {
  try {
    const data = await TicketModel.find();
    res.send({ data });
  } catch (error) {
    console.log(error);
  }
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const isUser = await UserModel.findOne({ email });
  if (isUser) {
    res.send({ msg: "User already exists, try logging in" });
  } else {
    bcrypt.hash(password, 4, async function (err, hash) {
      if (err) {
        res.send("Something went wrong, please try again later");
      }
      const new_user = new UserModel({
        name,
        email,
        password: hash,
      });
      try {
        await new_user.save();
        res.send({ msg: "Sign up successfull" });
      } catch (err) {
        res.send({ msg: "Something went wrong, please try again" });
      }
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const hashed_password = user.password;
  const user_id = user._id;
  bcrypt.compare(password, hashed_password, function (err, result) {
    if (err) {
      res.send({ msg: "Something went wrong, try again later" });
    }
    if (result) {
      const token = jwt.sign({ user_id }, process.env.SECRET_KEY);
      res.send({ message: "Login successfull", token });
    } else {
      res.send({ msg: "Login failed" });
    }
  });
});

app.post("/create", async (req, res) => {
  const { category, title, message } = req.body;
  const date = new Date();
  const timestamps = date.getHours() + "" + ":" + date.getMinutes();
  const new_Ticket = new TicketModel({
    category,
    title,
    message,
    timestamps: timestamps,
  });

  await new_Ticket.save();
  res.send({ new_Ticket });
});

app.listen(PORT, async () => {
  try {
    await connection();
    console.log(`http://localhost:${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
