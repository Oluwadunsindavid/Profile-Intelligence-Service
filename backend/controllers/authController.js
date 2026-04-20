const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Helper function to create the Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token lasts for 30 days
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ status: "error", message: "User already exists" });
    }

    // 2. Create the user
    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id), // Send token immediately after signup
        },
      });
    }
    // Inside registerUser catch block
  } catch (error) {
    console.log("REGISTRATION ERROR:", error); // Check your terminal for this!
    res.status(500).json({
      status: "error",
      message: error.message, // This will tell you if it's a validation or duplicate error
    });
  }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ status: "error", message: "Unable to create user" });
//   }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email (we need to explicitly select the password because of our model config)
    const user = await User.findOne({ email }).select("+password");

    // 2. Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        status: "success",
        message: "User authenticated successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    } else {
      res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// backend/controllers/authController.js

exports.logout = (req, res) => {
  // If you were using cookies, you would clear them here:
  // res.clearCookie('token');
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};
