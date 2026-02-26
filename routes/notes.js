import { Router } from 'express';
import {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
} from '../models/note.js';
import { Post } from '../models/index.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(listNotes());
});

router.get('/:id', (req, res, next) => {
  try {
    const id = Number(req.params.id);
    res.json(getNote(id));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: 'Title and content are required'
    });
  }

  try {
    const note = await Post.create({
      title: title,
      content: content,
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    const id = Number(req.params.id);
    deleteNote(id);
    res.json({ result: 'success' });
  } catch (error) {
    next(error);
  }
});

export default router;