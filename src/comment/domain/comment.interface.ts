import { Types } from "mongoose";

export interface IComment {
  _id: Types.ObjectId;
  parent: {
    type: "post" | "comment";
    id: string;
  };
  upvotes: Array<string>,
  downvotes: Array<string>,
  content: string;
  author: string;
}
