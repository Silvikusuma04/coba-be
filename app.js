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

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import notesRouter from "./routes/notes.js";
import usersRouter from "./routes/users.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Middleware untuk memastikan koneksi sebelum route jalan
app.use(async (req, res, next) => {
  await connectDB();
  next();
});


app.use("/notes", notesRouter);
app.use("/users", usersRouter);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: err?.message || "Server error" });
});

export default app;