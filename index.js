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

// index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import notesRouter from './routes/notes.js';
import usersRouter from './routes/users.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/notes', notesRouter);
app.use('/users', usersRouter);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 8080;
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
}
start();