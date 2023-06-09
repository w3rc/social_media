import { Types } from "mongoose";

export interface IComment {
  _id: Types.ObjectId;
  post_id: string;
  parent_id?: string;
  upvotes: Array<string>;
  downvotes: Array<string>;
  content: string;
  author: string;
  subcomments?: Array<IComment>;
  created_at: string;
}
