import mongoose, { Schema } from "mongoose";
import { IComment } from "./comment.interface";

const commentSchema = new Schema<IComment & Document>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  parent: { type: String, required: true },
  upvotes: { type: [String], default: [] },
  downvotes: { type: [String], default: [] }
});

const commentModel = mongoose.model<IComment & Document>("Comment", commentSchema);

export default commentModel;
