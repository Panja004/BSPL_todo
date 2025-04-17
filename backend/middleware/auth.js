const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Token is not valid" });
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = auth;
