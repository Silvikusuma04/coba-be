// import express from "express";
// const app = express();

// app.use((req, res, next) => {
//   const authorized = true;

//   if (!authorized) {
//     return res.status(401).send("Yah Error");
//   }

//   next();
// });


// app.get("/silvi", (req, res) => {
//   res.send("ini Silvi Lagi Haloo");
// });

// app.get("/:greeting", (req, res) => {
//   const { greeting } = req.params;
//   res.send(greeting);
// });

// app.use((err, req, res, next) => {
//   res.send("Error Occurred");
// });
 
// app.listen(8080);

//notes berhasil deploy
// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import notesRouter from './routes/notes.js';
// import  cors from 'cors';


// dotenv.config();

// const app = express();

// app.use(cors(
//   {origin : '*'
//   }
// ));

// app.use(express.json());
// app.use('/notes', notesRouter);

// await mongoose.connect(process.env.MONGO_URI);
// console.log('Database connected');

// app.listen(8080, () => {
//   console.log('Server running on port 8080');
// });

// app.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import notesRouter from "./routes/notes.js";
import usersRouter from "./routes/users.js";
import emailRouter from "./routes/email.js"; // optional test route

dotenv.config();

const app = express();

/* ==============================
   BASIC MIDDLEWARE
============================== */

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

app.use(express.json());

/* ==============================
   DATABASE CONNECTION (CACHED)
   Safe for Vercel / Serverless
============================== */

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log("MongoDB connected");
        return mongooseInstance;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Ensure DB connected before handling request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    return res.status(500).json({
      message: "Database connection failed",
    });
  }
});

/* ==============================
   ROUTES
============================== */

app.use("/notes", notesRouter);
app.use("/users", usersRouter);
app.use("/email", emailRouter); // optional, for SMTP testing

/* ==============================
   HEALTH CHECK (Optional)
============================== */

app.get("/", (req, res) => {
  res.json({
    status: "API running",
    timestamp: new Date(),
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(500).json({
    message: err?.message || "Internal Server Error",
  });
});

export default app;