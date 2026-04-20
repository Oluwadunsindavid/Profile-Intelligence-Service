const express = require("express");
const router = express.Router();
const {
  createProfile,
  getProfiles,
  getProfileById,
  deleteProfile,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authmiddleware");

// This applies 'protect' to every route below it. 
// Because our 'protect' is "smart," it won't block guests; 
// it just checks if a user exists. If they do, it attaches them to req.user. If not, req.user is null.
router.use(protect);

// 1. POST /api/profiles
router.post("/", createProfile);

// 2. GET /api/profiles
router.get("/", getProfiles);

// 3. GET /api/profiles/:id
router.get("/:id", getProfileById);

// 4. DELETE /api/profiles/:id
router.delete("/:id", deleteProfile);

module.exports = router;
