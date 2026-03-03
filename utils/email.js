// utils/email.js
import nodemailer from "nodemailer";

let transporter = null;

export async function createTransporter() {
  if (transporter) return transporter;

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP config missing in environment variables");
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true" || SMTP_SECURE === true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  // Verifikasi koneksi sekarang, agar kesalahan diketahui saat start
  await transporter.verify();
  return transporter;
}

/**
 * sendEmail({ to, subject, html, text })
 */
export async function sendEmail({ to, subject, html, text }) {
  const tr = await createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const info = await tr.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return info;
}