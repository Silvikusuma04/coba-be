// routes/notes.js
import { Router } from "express";
import { Post } from "../models/index.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// GET all notes for logged-in user
router.get("/", async (req, res) => {
  try {
    const notes = await Post.find({ author: req.user.email }).sort({ createdAt: -1 });
    return res.json(notes);
  } catch (err) {
    console.error("Get notes error:", err);
    return res.status(500).json({ message: err?.message || "Server error getting notes" });
  }
});

// GET by id (only if author matches)
router.get("/:id", async (req, res) => {
  try {
    const note = await Post.findOne({ _id: req.params.id, author: req.user.email });
    if (!note) return res.status(404).json({ message: "Note not found" });
    return res.json(note);
  } catch (err) {
    console.error("Get note by id error:", err);
    return res.status(500).json({ message: err?.message || "Server error" });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Title and content required" });
    const note = await Post.create({ title: title.trim(), content, author: req.user.email });
    return res.status(201).json(note);
  } catch (err) {
    console.error("Create note error:", err);
    return res.status(500).json({ message: err?.message || "Server error creating note" });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const updated = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user.email },
      { ...(title && { title: title.trim() }), ...(content && { content }) },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Note not found" });
    return res.json(updated);
  } catch (err) {
    console.error("Update note error:", err);
    return res.status(500).json({ message: err?.message || "Server error updating note" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.email });
    if (!deleted) return res.status(404).json({ message: "Note not found" });
    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete note error:", err);
    return res.status(500).json({ message: err?.message || "Server error deleting note" });
  }
});

export default router;