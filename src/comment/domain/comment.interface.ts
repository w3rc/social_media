import { Types } from "mongoose";

export interface IPost {
  _id: Types.ObjectId;
  parent: {
    type: "post" | "comment";
    id: string;
  };
  content: string;
  author: string;
}
