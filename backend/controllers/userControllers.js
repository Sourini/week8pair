const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "3d",
  });
};

const signupUser = async (req, res) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    profilePicture,
    gender,
    dateOfBirth,
    role,
    address,
  } = req.body;
  try {
    if (
      !name ||
      !email ||
      !password ||
      !phoneNumber ||
      !profilePicture ||
      !gender ||
      !dateOfBirth ||
      !role ||
      !address
    ) {
      res.status(400);
      throw new Error("Please add all fields");
    }
    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      profilePicture,
      gender,
      dateOfBirth,
      role,
      address,
    });

    if (user) {
      const token = generateToken(user.id);
      res.status(201).json({ email, token });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user.id);
      res.status(200).json({ email, token });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
};