import { Types } from "mongoose";

export interface IPost {
  _id: Types.ObjectId;
  title: string;
  content: string;
  author: string;
  created_at: string;
}
