// routes/users.js
import { Router } from "express";
import { User } from "../models/index.js";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const router = Router();

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// REGISTER
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "username, email, password required" });

    if (!validator.isEmail(email)) return res.status(400).json({ message: "Format email tidak valid" });

    if (!PASSWORD_REGEX.test(password))
      return res.status(400).json({
        message: "Password minimal 8 karakter, mengandung 1 huruf besar dan 1 karakter spesial",
      });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email sudah terdaftar" });

    const user = await User.create({ username, email, password });
    res.status(201).json({ id: user._id, username: user.username, email: user.email });
  } catch (err) {
    next(err);
  }
});

// LOGIN — sekarang return token + user
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email dan password diperlukan" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Kredensial salah" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Kredensial salah" });

    const payload = { id: user._id, email: user.email, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    next(err);
  }
});

// FORGOT / RESET (sama seperti sebelumnya)
router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Tidak ada akun dengan email tersebut" });

    const resetToken = user.generatePasswordReset();
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || "no-reply@example.com",
        to: user.email,
        subject: "Password reset",
        html: `<p>Gunakan link ini untuk reset password (1 jam): <a href="${resetUrl}">${resetUrl}</a></p>`,
      });

      return res.json({ message: "Jika akun ada, email reset dikirim" });
    } else {
      return res.json({ message: "Reset token generated (dev)", resetUrl });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/reset-password/:token", async (req, res, next) => {
  try {
    const token = req.params.token;
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "password required" });

    if (!PASSWORD_REGEX.test(password))
      return res.status(400).json({
        message: "Password minimal 8 karakter, mengandung 1 huruf besar dan 1 karakter spesial",
      });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa" });

    user.password = password; // akan di-hash oleh pre save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password berhasil di-reset" });
  } catch (err) {
    next(err);
  }
});

export default router;