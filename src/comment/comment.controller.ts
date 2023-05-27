import { Request, Response } from "express";
import { extractSubClaim } from "../util/jwtUtil";
import CreateCommentInput from "./dto/createComment.input";
import {
  createComment as createCommentService,
  getCommentsByPost as getCommentsByPostService,
  upvoteComment as upvoteCommentService,
  downvoteComment as downvoteCommentService,
} from "./comment.service";

export const createComment = async (req: Request, res: Response) => {
  const createCommentInput: CreateCommentInput = new CreateCommentInput(
    req.body.content,
    req.body.parent_id,
  );
  const post_id = req.query.post_id;
  if (!post_id) {
    res.status(400).send("Invalid Post ID");
  }
  const comment = await createCommentService(
    createCommentInput,
    post_id as string,
    extractSubClaim(req),
  );
  res.status(201).send(comment);
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const comments = await getCommentsByPostService(postId);
  res.status(200).send(comments);
};

export const upvoteComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  if (await upvoteCommentService(commentId, extractSubClaim(req))) {
    res.status(200).send(true);
  } else {
    res.status(500).send({ message: "Could not upvote comment" });
  }
};

export const downvoteComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  if (await downvoteCommentService(commentId, extractSubClaim(req))) {
    res.status(200).send(true);
  } else {
    res.status(500).send({ message: "Could not downvote comment" });
  }
};
