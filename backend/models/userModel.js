const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please add a valid email address"],
    required: [true, "Please add an email"],
    unique: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please add a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false, // This ensures that by default, we don't send the password back in API responses
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// --- ENCRYPTION LOGIC ---
// This runs BEFORE the user is saved to the DB
userSchema.pre("save", async function (next) {
  // Only hash the password if it's being modified (or is new)
  if (!this.isModified("password")) {
    return ;
  }

  // Generate a "salt" (random strings to make the hash unique)
  const salt = await bcrypt.genSalt(10);
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
});

// --- HELPER METHOD ---
// We add a method to the user object to check if a password matches
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
