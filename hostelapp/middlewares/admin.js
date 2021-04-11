const jwt = require("jsonwebtoken");

function checkAdminToken(req, res, next) {
  const token = req.header("x-admin-auth-token");
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Provide token",
    });
  }
  try {
    const decoded = jwt.verify(token, "12345");
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid token",
    });
  }
}

module.exports = checkAdminToken;
