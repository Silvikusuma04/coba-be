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
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import notesRouter from './routes/notes.js';
import  cors from 'cors';

app.use(cors(
  {origin : '*'
  }
));

dotenv.config();

const app = express();

app.use(express.json());
app.use('/notes', notesRouter);

await mongoose.connect(process.env.MONGO_URI);
console.log('Database connected');

app.listen(8080, () => {
  console.log('Server running on port 8080');
});