// middleware/auth.js
import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    return res.status(500).json({
      message: "Server misconfiguration: JWT secret missing",
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized: token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      // ignoreExpiration: true,
    });

    // const now = Math.floor(Date.now() / 1000); // detik sekarang
    // const iat = decoded.iat; // waktu token dibuat (detik)

    // const LIMIT = 3; // 3 DETIK

    // if (now - iat > LIMIT) {
    //   return res.status(401).json({
    //     message: "Unauthorized: token expired (3s test)",
    //     now,
    //     iat,
    //   });
    // }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized: invalid token",
    });
  }
};