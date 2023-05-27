import express from "express";
import { createPost, getPostById } from "./post/post.controller";
import {
  createComment,
  downvoteComment,
  getCommentsByPost,
  upvoteComment,
} from "./comment/comment.controller";
import { login, register } from "./user/user.controller";
import { authMiddleware } from "./decorator/authDecorator";

const router = express.Router();

// Ping
router.get("/", (_, res) => res.send("API is up and running!"));

// Login/Signup
router.post("/login", login);
router.post("/register", register);

// Posts
router.post("/post", authMiddleware, createPost);
router.get("/post", authMiddleware, getPostById);

// Comments in post
router.get("/post/:id/comments", authMiddleware, getCommentsByPost);
router.post("/comment/:id/upvote", authMiddleware, upvoteComment);
router.post("/comment/:id/downvote", authMiddleware, downvoteComment);
router.post("/comment", authMiddleware, createComment);

export default router;
