//auth.middleware.js
import { verifyToken } from "../utils/jwt.util.js";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || "cinbon";
    const decoded = verifyToken(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};
