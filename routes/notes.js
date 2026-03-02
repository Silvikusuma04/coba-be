// routes/notes.js
import { Router } from "express";
import { Post } from "../models/index.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET all — publik
router.get("/", async (req, res, next) => {
  try {
    const notes = await Post.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

// GET by id — publik
router.get("/:id", async (req, res, next) => {
  try {
    const note = await Post.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (error) {
    next(error);
  }
});

// CREATE — butuh auth
router.post("/", requireAuth, async (req, res, next) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).json({ message: "Title, content, and author are required" });
  }
  try {
    const note = await Post.create({
      title: title.trim(),
      content,
      author: author.trim(),
    });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

// UPDATE (by id) — butuh auth
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const { title, content, author } = req.body;
    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title: title.trim() }),
        ...(content && { content }),
        ...(author && { author: author.trim() }),
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Note not found" });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE by id — butuh auth
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;