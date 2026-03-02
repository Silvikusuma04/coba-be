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