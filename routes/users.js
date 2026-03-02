// routes/users.js
import { Router } from "express";
import { User } from "../models/index.js";
import jwt from "jsonwebtoken";
import validator from "validator";

const router = Router();

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const username = req.body.username ?? req.body.userName ?? req.body.name;
    const email = req.body.email;
    const password = req.body.password ?? req.body.Password;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message: "Password must be 8+ chars, include uppercase & special character"
      });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    return res.status(201).json({ id: user._id, username: user.username, email: user.email });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: err?.message || "Server error during register" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password ?? req.body.Password;
    if (!email || !password) return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET missing");
      return res.status(500).json({ message: "Server misconfiguration: JWT secret missing" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });

    return res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: err?.message || "Server error during login" });
  }
});

export default router;