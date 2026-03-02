import { Router } from "express";
import { Post } from "../models/index.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Semua notes wajib login
router.use(requireAuth);

// GET ALL
router.get("/", async (req, res, next) => {
  try {
    const notes = await Post.find({ author: req.user.email })
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

// GET BY ID
router.get("/:id", async (req, res, next) => {
  try {
    const note = await Post.findOne({
      _id: req.params.id,
      author: req.user.email
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
});

// CREATE
router.post("/", async (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content required"
    });
  }

  try {
    const note = await Post.create({
      title: title.trim(),
      content,
      author: req.user.email
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

// UPDATE
router.put("/:id", async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const updated = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.email },
      {
        ...(title && { title: title.trim() }),
        ...(content && { content })
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user.email
    });

    if (!deleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;