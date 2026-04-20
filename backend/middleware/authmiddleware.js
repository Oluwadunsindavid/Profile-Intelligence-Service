const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Extract the token from the string "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // 3. Verify the token using your Secret Key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user in the DB and attach them to the 'req' object
      // We use .select("-password") so we don't carry the hash around
      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      // If the token is invalid (expired/tempered), we set user to null
      req.user = null;
      return next();
    }
  }

  // 5. If no token is provided, they are a Guest
  req.user = null;
  next();
};

module.exports = { protect };
