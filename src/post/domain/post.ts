import mongoose, { Schema } from "mongoose";
import { IPost } from "./post.interface";

const postSchema = new Schema<IPost & Document>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
});

const UserModel = mongoose.model<IPost & Document>("Post", postSchema);

export default UserModel;
