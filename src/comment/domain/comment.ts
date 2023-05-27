import mongoose, { Schema } from "mongoose";
import { IComment } from "./comment.interface";

const commentSchema = new Schema<IComment & Document>({
  content: { type: String, required: true },
  author: { type: String, required: true },
  post_id: { type: String, required: true },
  parent_id: { type: String, required: false },
  upvotes: { type: [String], default: [] },
  downvotes: { type: [String], default: [] },
  created_at: { type: String },
});

const commentModel = mongoose.model<IComment & Document>(
  "Comment",
  commentSchema,
);

export default commentModel;
