const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    _id: { type: String }, // Your UUID v7
    name: { type: String, required: true, lowercase: true }, // unique: true REMOVED
    gender: { type: String },
    gender_probability: { type: Number },
    sample_size: { type: Number },
    age: Number,
    age_group: { type: String },
    country_id: { type: String },
    country_probability: { type: Number },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { _id: false },
);// Disable the automatic _id field since we're using a custom one, UUID v7

// --- THE LOGIC UPGRADE ---
// This creates a unique constraint for the combination of user and name.
// It allows different users to search the same name, but prevents
// the SAME user from saving the SAME name multiple times.
profileSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Profile", profileSchema);