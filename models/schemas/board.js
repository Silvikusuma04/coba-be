// models/schemas/board.js
import { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default PostSchema;