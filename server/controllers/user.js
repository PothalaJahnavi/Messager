const User = require("../models/user");
const bcrypt = require("bcryptjs");
const generateToken = require("../jwt");
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
  try {
    if (!req.body.name || !req.body.password || !req.body.email) {
      res.status(400);
      throw new Error("Please Enter all the fields");
    }
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res.status(400);
      throw new Error("User Already Exists");
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10), // You can specify the number of salt rounds, for example, 10
    });

    if (newUser) {
      return res.json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: generateToken(newUser._id),
      });
    } else {
      res.status(400);
      throw new Error("Registration Failed");
    }
  } catch (err) {
    console.error(err);
    res.status(500);
    throw new Error("Internal Server Error");
  }
});
const login = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      const matchPassword = bcrypt.compareSync(
        req.body.password,
        userExists.password
      );

      if (matchPassword) {
        return res.status(200).json({
          _id: userExists._id,
          name: userExists.name,
          email: userExists.email,
          token: generateToken(userExists._id),
        });
      } else {
        res.status(400);
        throw new Error("Password Incorrect");
      }
    } else {
      res.status(400);
      throw new Error("Login Failed");
    }
  } catch (err) {
    console.error(err);
    res.status(500);
    throw new Error("Internal Server Error");
  }
};

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  return res.json(users);
});

module.exports = { register, login, allUsers };
