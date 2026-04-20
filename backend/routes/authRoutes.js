const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authmiddleware");

// @desc    Register a new user
// 1. POST /api/auth/register
router.post("/register", authController.registerUser);
// 2. POST /api/auth/login
router.post("/login", authController.loginUser);
// 3. POST /api/auth/logout
router.post("/logout", protect, authController.logout);

module.exports = router;