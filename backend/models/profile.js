const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    _id: { type: String }, // We will store the UUID v7 here
    name: { type: String, unique: true, required: true, lowercase: true },
    gender: { type: String },
    gender_probability: { type: Number },
    sample_size: { type: Number }, //this was renamed from "count"
    age: Number,
    age_group: { type: String },
    country_id: { type: String },
    country_probability: { type: Number },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { _id: false },
); // Disable the automatic _id field since we're using a custom one, UUID v7

module.exports = mongoose.model("Profile", profileSchema);
