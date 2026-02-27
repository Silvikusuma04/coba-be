import { Router } from 'express';
import { Post } from '../models/index.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const notes = await Post.find();
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

router.put('/title/:title', async (req, res, next) => {
  try {
    const updated = await Post.findOneAndUpdate(
      { title: req.params.title.trim() },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete('/title/:title', async (req, res, next) => {
  try {
    const deleted = await Post.findOneAndDelete({
      title: req.params.title.trim()
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ✅ GET BY ID (paling bawah karena wildcard)
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
    const note = await Post.create({
      title: title.trim(),
      content
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

export default router;