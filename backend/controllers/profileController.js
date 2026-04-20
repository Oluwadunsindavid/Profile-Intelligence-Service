// const axios = require("axios");
// const { uuidv7 } = require("uuidv7"); // This looks for the 'uuidv7' package// Logic to check if the name already exists in the database, and if so, return the existing profile instead of creating a new one. This is important to prevent duplicates and ensure that each name corresponds to a unique profile.
// const Profile = require("../models/profileModel");
// const getAgeGroup = require("../utils/getAgeGroup");
// const getPrimaryCountry = require("../utils/getPrimaryCountry");

// exports.createProfile = async (req, res) => {
//   try {
//     const { name } = req.body;
//     // A. Validation: Check if name exists
//     if (!name || typeof name !== "string") {
//       return res
//         .status(400)
//         .json({ status: "error", message: "Missing or empty name" });
//     }
//     // --- NEW LOGIC: AUTHENTICATED CHECK ---
//     // 1. If a user is logged in, check if THIS specific user already searched this name
//     if (req.user) {
//       const existingProfile = await Profile.findOne({
//         name: name.toLowerCase(),
//         user: req.user._id,
//       });

//       if (existingProfile) {
//         return res.status(200).json({
//           status: "success",
//           message: "Profile already exists in your history",
//           data: existingProfile,
//         });
//       }
//     }
//     // C. Parallel API Calls (Phase 4 "Experts Interview")
//     // We wrap these in one Promise.all to save time!
//     const [gRes, aRes, nRes] = await Promise.all([
//       axios.get(`https://api.genderize.io?name=${name}`),
//       axios.get(`https://api.agify.io?name=${name}`),
//       axios.get(`https://api.nationalize.io?name=${name}`),
//     ]);
//     // D. Edge Case Handling (The 502 Rules)
//     // HNG REQUIREMENT: If any of the APIs return an invalid response (like missing data or zero count), we must return a 502 with a specific error message. This is crucial for the grading script to recognize that we handled the edge case correctly.
//     // if (!gRes.data.gender || gRes.data.count === 0) {
//     //   return res.status(502).json({
//     //     status: "error",
//     //     message: "Genderize returned an invalid response",
//     //   });
//     // }
//     if (!gRes.data.gender || gRes.data.count === 0) {
//       return res.status(404).json({
//         // Changed to 404
//         status: "error",
//         message: `No data found for the name: ${name}`,
//       });
//     }
//     if (aRes.data.age === null) {
//       return res.status(502).json({
//         status: "error",
//         message: "Agify returned an invalid response",
//       });
//     }
//     const primaryCountry = getPrimaryCountry(nRes.data.country);
//     if (!primaryCountry) {
//       return res.status(502).json({
//         status: "error",
//         message: "Nationalize returned an invalid response",
//       });
//     }

//     // E. Assembly (Phase 4 "Final Assembly")
//     const newProfileData = {
//       _id: uuidv7(),
//       name: name.toLowerCase(),
//       gender: gRes.data.gender,
//       gender_probability: gRes.data.probability,
//       sample_size: gRes.data.count, // Renaming count to sample_size
//       age: aRes.data.age,
//       age_group: getAgeGroup(aRes.data.age),
//       country_id: primaryCountry.country_id,
//       country_probability: primaryCountry.probability,
//       // Link to user if they are logged in
//       user: req.user ? req.user._id : null,
//       created_at: new Date().toISOString(),
//     };

//     // --- THE "GUEST VS USER" FORK ---
//     if (req.user) {
//       // If logged in: SAVE to database
//       const profile = await Profile.create(newProfileData);
//       return res.status(201).json({ status: "success", data: profile });
//     } else {
//       // If guest: DO NOT SAVE, just return the object
//       return res.status(200).json({ status: "success", data: newProfileData });
//     }

//     // const profile = await Profile.create(newProfileData);

//     // // F. Success Response (Must be 201)
//     // return res.status(201).json({
//     //   status: "success",
//     //   data: profile,
//     // });
//   } catch (error) {
//     // If the error was from Axios (like a 429 rate limit or 500), handle it
//     return res.status(500).json({ status: "error", message: error.message });
//   }
// };

// // How would you write a GET request that uses the id from the URL to find a profile in MongoDB? Keep in mind, if it's not found, you must return a 404 with the specific error message structure from the brief.
// exports.getProfileById = async (req, res) => {
//   try {
//     const { id } = req.params; // Extract the id from the URL parameters
//     const profile = await Profile.findById(id); // Use Mongoose to find the profile by its _id (which is the UUID v7)
//     if (!profile) {
//       return res.status(404).json({
//         status: "error",
//         message: "Profile not found",
//       });
//     }
//     return res.status(200).json({
//       status: "success",
//       data: profile,
//     });
//   } catch (error) {
//     return res.status(500).json({ status: "error", message: error.message });
//   }
// };

// /*
// Your Task:
// Write the getProfiles function. Here is the structure you should follow:

// Extract query params: Get gender, country_id, and age_group from req.query.

// Build a filter object: Only add these to your Mongoose .find() query if they are actually provided by the user.

// Execute the find: Query the database.

// Format the response: The brief requires a specific structure:

// JSON
// {
//   "status": "success",
//   "count": 2, // Total number of profiles found
//   "data": [...]
// }
// A Pro-Tip on Case-Insensitivity:
// Since we stored our data in lowercase (or specific codes like "NG"), when a user searches for gender=MALE, you should convert their query to lowercase before searching the database. For country_id, it's usually uppercase (like "NG").

// Write the filter-building logic for this.
//  */

// exports.getProfiles = async (req, res) => {
//   try {
//     // --- PRIVACY LOCK ---
//     // If not logged in, guests see NO history (or we could return a 401)
//     if (!req.user) {
//       return res.status(200).json({ status: "success", count: 0, data: [] });
//     }

//     const { gender, country_id, age_group } = req.query;

//     // Only fetch profiles belonging to the logged-in user
//     const filter = {};
//     if (gender) filter.gender = gender.toLowerCase();
//     if (country_id) filter.country_id = country_id.toUpperCase();
//     if (age_group) filter.age_group = age_group.toLowerCase();

//     // 1. Find the profiles using the filter
//     const profiles = await Profile.find(filter).sort({ created_at: -1 });

//     // 2. Return the success response with the count
//     return res.status(200).json({
//       status: "success",
//       count: profiles.length,
//       data: profiles,
//     });
//   } catch (error) {
//     return res.status(500).json({ status: "error", message: error.message });
//   }
// };

// // Task: Write the deleteProfile function.

// // Hint: 204 No Content means you do not send a JSON body back. You just send the status.
// //
// // Logic: Find the profile and delete it. If it doesn't exist, you should still return a 404 (to be consistent with the GET route).
// exports.deleteProfile = async (req, res) => {
//   try {
//     const { id } = req.params; // Extract the id from the URL parameters
//     const profile = await Profile.findById(id); // Use Mongoose to find the profile by its _id (which is the UUID v7)
//     if (!profile) {
//       return res.status(404).json({
//         status: "error",
//         message: "Profile not found",
//       });
//     }
//     await Profile.findByIdAndDelete(id); // If the profile exists, delete it
//     return res.sendStatus(204); // 204 No Content means the deletion was successful, and we don't send any body back
//     // return res.status(200).json({
//     //   status: "success",
//     //   message: "Profile deleted successfully",
//     // });
//   } catch (error) {
//     return res.status(500).json({ status: "error", message: error.message });
//   }
// };
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
