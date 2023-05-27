import { Request, Response } from "express";
import { extractSubClaim } from "../util/jwtUtil";
import CreatePostInput from "./dto/createPost.input";
import {
  createPost as createPostService,
  getPostById as getPostByIdService,
} from "./post.service";

export const createPost = async (req: Request, res: Response) => {
  const createPostInput = new CreatePostInput(req.body.title, req.body.content);
  const createdPost = await createPostService(
    createPostInput,
    extractSubClaim(req),
  );

  res.status(201).send(createdPost);
};

export const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.id;

  const post = await getPostByIdService(postId);
  res.status(200).send(post);
};
