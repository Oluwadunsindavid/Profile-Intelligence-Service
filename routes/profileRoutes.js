const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// 1. POST /api/profiles
router.post("/profiles", profileController.createProfile);

// 2. GET /api/profiles
router.get("/profiles", profileController.getProfiles);

// 3. GET /api/profiles/:id
router.get("/profiles/:id", profileController.getProfileById);

// 4. DELETE /api/profiles/:id
router.delete("/profiles/:id", profileController.deleteProfile);

module.exports = router;
