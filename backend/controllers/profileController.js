const axios = require("axios");
const { uuidv7 } = require("uuidv7");
const Profile = require("../models/profileModel");
const getAgeGroup = require("../utils/getAgeGroup");
const getPrimaryCountry = require("../utils/getPrimaryCountry");

exports.createProfile = async (req, res) => {
  try {
    const { name } = req.body;

    // A. Validation
    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ status: "error", message: "Missing or empty name" });
    }

    // B. AUTHENTICATED CHECK: Prevent duplicate searches for the SAME user
    if (req.user) {
      // remove later
      console.log("Authenticated User ID:", req.user._id); // Add this line to check if req.user is correctly populated
      const existingProfile = await Profile.findOne({
        name: name.toLowerCase(),
        user: req.user._id,
      });

      if (existingProfile) {
        return res.status(200).json({
          status: "success",
          message: "Profile already exists in your history",
          data: existingProfile,
        });
      }
    }

    // C. Parallel API Calls
    const [gRes, aRes, nRes] = await Promise.all([
      axios.get(`https://api.genderize.io?name=${name}`),
      axios.get(`https://api.agify.io?name=${name}`),
      axios.get(`https://api.nationalize.io?name=${name}`),
    ]);

    // D. Edge Case Handling
    if (!gRes.data.gender || gRes.data.count === 0) {
      return res.status(404).json({
        status: "error",
        message: `No data found for the name: ${name}`,
      });
    }

    if (aRes.data.age === null) {
      return res.status(502).json({
        status: "error",
        message: "Agify returned an invalid response",
      });
    }

    const primaryCountry = getPrimaryCountry(nRes.data.country);
    if (!primaryCountry) {
      return res.status(502).json({
        status: "error",
        message: "Nationalize returned an invalid response",
      });
    }

    // E. Assembly
    const newProfileData = {
      _id: uuidv7(),
      name: name.toLowerCase(),
      gender: gRes.data.gender,
      gender_probability: gRes.data.probability,
      sample_size: gRes.data.count,
      age: aRes.data.age,
      age_group: getAgeGroup(aRes.data.age),
      country_id: primaryCountry.country_id,
      country_probability: primaryCountry.probability,
      // LINK TO USER ID IF LOGGED IN
      user: req.user ? req.user._id : null,
      created_at: new Date().toISOString(),
    };

    // F. THE "GUEST VS USER" FORK
    if (req.user) {
      // Logged in: SAVE to database
      const profile = await Profile.create(newProfileData);
      return res.status(201).json({ status: "success", data: profile });
    } else {
      // Guest: Just return the object without saving
      return res.status(200).json({ status: "success", data: newProfileData });
    }
  } catch (error) {
    // CRITICAL: Log this so you can see it in Railway Dashboard
    console.error("CRASH IN CREATE_PROFILE:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findById(id);

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }

    // Optional: Security check to ensure user can only GET their own profiles
    if (
      profile.user &&
      (!req.user || profile.user.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to view this profile",
      });
    }

    return res.status(200).json({ status: "success", data: profile });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getProfiles = async (req, res) => {
  try {
    // 1. PRIVACY LOCK: If not logged in, return empty data
    if (!req.user) {
      return res.status(200).json({ status: "success", count: 0, data: [] });
    }

    const { gender, country_id, age_group } = req.query;

    // 2. Build Filter: ONLY fetch profiles belonging to the logged-in user
    const filter = { user: req.user._id };

    if (gender) filter.gender = gender.toLowerCase();
    if (country_id) filter.country_id = country_id.toUpperCase();
    if (age_group) filter.age_group = age_group.toLowerCase();

    // 3. Execute Find
    const profiles = await Profile.find(filter).sort({ created_at: -1 });

    return res.status(200).json({
      status: "success",
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findById(id);

    if (!profile) {
      return res
        .status(404)
        .json({ status: "error", message: "Profile not found" });
    }

    // Security Check: Only the owner can delete
    if (!req.user || profile.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this profile",
      });
    }

    await Profile.findByIdAndDelete(id);
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};
