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

export const getCommentsByPost = async (
  postId: string,
  shouldSortDescByVote: boolean,
) => {
  const comments: IComment[] = await commentModel.aggregate([
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
        maxDepth: 0,
        depthField: "depth",
      },
    },
  ]);
  return createGetCommentsByPostOutput(comments, shouldSortDescByVote);
};

const createGetCommentsByPostOutput = (
  comments: IComment[],
  shouldSortDescByVote: boolean,
) => {
  const commentMap: Record<string, IComment> = {};

  comments.forEach((comment) => {
    commentMap[comment._id.toString()] = comment;
  });

  comments.forEach((comment) => {
    if (comment.parent_id && comment.parent_id in commentMap) {
      const parentComment = commentMap[comment.parent_id];
      if (!parentComment.subcomments) {
        parentComment.subcomments = [];
      }
      parentComment.subcomments.push(comment);
    }
  });
  const mainComments = comments.filter((comment) => !comment.parent_id);

  if (shouldSortDescByVote) {
    const sortSubcomments = (comment: IComment) => {
      comment.subcomments?.sort((a, b) => b.upvotes.length - a.upvotes.length);
      comment.subcomments?.forEach(sortSubcomments);
    };
    mainComments.forEach(sortSubcomments);
  }

  return mainComments;
};

export const upvoteComment = async (
  commentId: string,
  upvoter: string,
): Promise<boolean> => {
  const comment = await commentModel.findByIdAndUpdate(
    commentId,
    { $addToSet: { upvotes: upvoter } },
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
    { $addToSet: { downvotes: downvoter } },
    { new: true },
  );
  if (comment?.downvotes.includes(downvoter)) {
    return true;
  }
  return false;
};
