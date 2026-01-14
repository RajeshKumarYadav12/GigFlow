import jwt from "jsonwebtoken";

/**
 * Generate JWT token
 * @param {string} userId - User ID to encode in token
 * @returns {string} JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_COOKIE_EXPIRE || 7}d`,
  });
};

/**
 * Set JWT token as HttpOnly cookie in response
 * @param {object} res - Express response object
 * @param {string} token - JWT token to set
 */
export const setTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true, // Prevent XSS attacks
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // CSRF protection
    maxAge: (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000, // Convert days to milliseconds
  };

  res.cookie("token", token, cookieOptions);
};

/**
 * Clear JWT token cookie
 * @param {object} res - Express response object
 */
export const clearTokenCookie = (res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};
