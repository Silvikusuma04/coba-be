// routes/email.js
import { Router } from "express";
import { sendEmail } from "../utils/email.js";

const router = Router();

router.post("/test", async (req, res) => {
  try {
    const { to} = req.body;
    if (!to) return res.status(400).json({ message: "to email required" });

    const info = await sendEmail({
      to,
      subject: "Test email from your app",
      text: "This is a test email. If you receive it, SMTP config is OK.",
      html: "<p>This is a test email. If you receive it, SMTP config is OK.</p>",
    });

    return res.json({ message: "Email sent", info });
  } catch (err) {
    console.error("Test email error:", err);
    return res.status(500).json({ message: err?.message || "Failed to send test email" });
  }
});

export default router;