import commentModel from "./domain/comment";
import { IComment } from "./domain/comment.interface";
import { Types } from "mongoose";
import CreateCommentInput from "./dto/createComment.input";

export const createComment = async (
  createCommentInput: CreateCommentInput,
  post_id: string,
  author: string,
): Promise<IComment> => {

  const comment: IComment = {
    _id: new Types.ObjectId(),
    content: createCommentInput.content,
    author: author,
    upvotes: [],
    downvotes: [],
    post_id: post_id,
    parent_id: createCommentInput.parent_id,
    created_at: new Date().toISOString(),
  };

  return await commentModel.create(comment);
};

export const getCommentsByPost = async (postId: string) => {
  return await commentModel.aggregate([
    {
      $match: {
        post_id: postId,
      },
    },
    {
      $graphLookup: {
        from: "comments",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "parent_id",
        as: "subcomments",
        maxDepth: 99,
        depthField: "depth",
      },
    },
    {
      $sort: {
        created_at: -1,
      },
    },
  ]);
};

export const upvoteComment = async (
  commentId: string,
  upvoter: string,
): Promise<boolean> => {
  const comment = await commentModel.findByIdAndUpdate(
    commentId,
    { $set: { $push: { upvotes: upvoter } } },
    { new: true },
  );
  if (comment?.upvotes.includes(upvoter)) {
    return true;
  }
  return false;
};

export const downvoteComment = async (
  commentId: string,
  downvoter: string,
): Promise<boolean> => {
  const comment = await commentModel.findByIdAndUpdate(
    commentId,
    { $set: { $push: { downvotes: downvoter } } },
    { new: true },
  );
  if (comment?.downvotes.includes(downvoter)) {
    return true;
  }
  return false;
};
