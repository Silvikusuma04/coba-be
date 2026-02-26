import { Router } from 'express';
import { Post } from '../models/index.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const notes = await Post.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const note = await Post.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
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
    const note = await Post.create({ title, content });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;