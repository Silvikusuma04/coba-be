import dotenv from "dotenv";
dotenv.config(); // HARUS PALING ATAS, sebelum import lain

import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 8080;

async function start() {
  console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "✓" : "✗");
  
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI missing in .env");
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET missing in .env");
    process.exit(1);
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
}

start();