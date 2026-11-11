import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

// Generate JWT
export const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRE,
    }
  );
};

// Verify JWT
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// Decode JWT without verification (optional)
export const decodeToken = (token) => {
  return jwt.decode(token);
};