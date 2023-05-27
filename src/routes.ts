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

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register User
 *     description: Register User
 *     tags: [User]
 *     requestBody:
 *        required: true,
 *        content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/RegisterUserInput'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post("/register", register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login
 *     description: Login
 *     tags: [User]
 *     requestBody:
 *        required: true,
 *        content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/LoginUserInput'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post("/login", login);

// Posts

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a Post
 *     description: Create a Post
 *     tags: [Post]
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Access token
 *         required: true
 *         type: string
 *         default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2ODUxNzAyMTEsImV4cCI6MTY4NTI1NjYxMSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwIiwic3ViIjoiNjQ3MTg5M2M5ZGQzOTZiMjIzOTE3MmQ3In0.rBdBHui7vmct3e-7fqHP7BJoZ43FeRRuQ-XwQmxTAlg
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   default: 647172d3ccee3046f8f12975
 *                 title:
 *                   type: string
 *                   default: Test post
 *                 content:
 *                   type: string
 *                   default: Test content
 *                 author:
 *                   type: string
 *                   default: 647172d3ccee3046f8f12975
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               properties:
 *                 error:
 *                   type: string
 *                   default: Invalid input
 */
router.post("/post", authMiddleware, createPost);

/**
 * @swagger
 * /post/:id:
 *   get:
 *     summary: Get a Post by ID
 *     description: Get a Post by ID
 *     tags: [Post]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Post ID
 *         required: true
 *         schema:
 *           type: string
 *           default: 647172d3ccee3046f8f12975
 *       - name: Authorization
 *         in: header
 *         description: Access token
 *         required: true
 *         type: string
 *         default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2ODUxNzAyMTEsImV4cCI6MTY4NTI1NjYxMSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwIiwic3ViIjoiNjQ3MTg5M2M5ZGQzOTZiMjIzOTE3MmQ3In0.rBdBHui7vmct3e-7fqHP7BJoZ43FeRRuQ-XwQmxTAlg
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   default: 647172d3ccee3046f8f12975
 *                 title:
 *                   type: string
 *                   default: Test post
 *                 content:
 *                   type: string
 *                   default: Test content
 *                 author:
 *                   type: string
 *                   default: 647172d3ccee3046f8f12975
 */
router.get("/post/:id", authMiddleware, getPostById);

// Comments in post

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Create a comment
 *     description: Create a comment
 *     tags: [Comment]
 *     parameters:
 *       - name: postId
 *         in: query
 *         description: Post ID
 *         required: true
 *         schema:
 *           type: string
 *           default: 647172d3ccee3046f8f12975
 *       - name: Authorization
 *         in: header
 *         description: Access token
 *         required: true
 *         type: string
 *         default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2ODUxNzAyMTEsImV4cCI6MTY4NTI1NjYxMSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwIiwic3ViIjoiNjQ3MTg5M2M5ZGQzOTZiMjIzOTE3MmQ3In0.rBdBHui7vmct3e-7fqHP7BJoZ43FeRRuQ-XwQmxTAlg
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   default: 647172d3ccee3046f8f12975
 *                 content:
 *                   type: string
 *                   default: Test content
 *                 author:
 *                   type: string
 *                   default: 647172d3ccee3046f8f12975
 */
router.post("/comment", authMiddleware, createComment);

/**
 * @swagger
 * /post/:id/comments:
 *   get:
 *     summary: Get Comments By Post
 *     description: Get Comments By Post
 *     tags: [Comment]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Post ID
 *         required: true
 *         schema:
 *           type: string
 *           default: 647172d3ccee3046f8f12975
 *       - name: sortDescByVote
 *         in: query
 *         description: sortDescByVote
 *         required: false
 *         schema:
 *           type: boolean
 *           default: true
 *       - name: Authorization
 *         in: header
 *         description: Access token
 *         required: true
 *         type: string
 *         default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2ODUxNzAyMTEsImV4cCI6MTY4NTI1NjYxMSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwIiwic3ViIjoiNjQ3MTg5M2M5ZGQzOTZiMjIzOTE3MmQ3In0.rBdBHui7vmct3e-7fqHP7BJoZ43FeRRuQ-XwQmxTAlg
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               properties:
 *                 id:
 *                   type: string
 *                   default: 647172d3ccee3046f8f12975
 *                 title:
 *                   type: string
 *                   default: Test post
 *                 content:
 *                   type: string
 *                   default: Test content
 *                 author:
 *                   type: string
 *                   default: 647172d3ccee3046f8f12975
 */
router.get("/post/:id/comments", authMiddleware, getCommentsByPost);

/**
 * @swagger
 * /comment/:id/upvote:
 *   post:
 *     summary: Upvote a comment
 *     description: Upvote a comment
 *     tags: [Comment]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Comment ID
 *         required: true
 *         schema:
 *           type: string
 *           default: 647172d3ccee3046f8f12975
 *       - name: Authorization
 *         in: header
 *         description: Access token
 *         required: true
 *         type: string
 *         default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2ODUxNzAyMTEsImV4cCI6MTY4NTI1NjYxMSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwIiwic3ViIjoiNjQ3MTg5M2M5ZGQzOTZiMjIzOTE3MmQ3In0.rBdBHui7vmct3e-7fqHP7BJoZ43FeRRuQ-XwQmxTAlg
 *     responses:
 *       200:
 *         description: Successfully upvoted
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               default: true
 */
router.post("/comment/:id/upvote", authMiddleware, upvoteComment);

/**
 * @swagger
 * /comment/:id/downvote:
 *   post:
 *     summary: Downvote a comment
 *     description: Downvote a comment
 *     tags: [Comment]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Comment ID
 *         required: true
 *         schema:
 *           type: string
 *           default: 647172d3ccee3046f8f12975
 *       - name: Authorization
 *         in: header
 *         description: Access token
 *         required: true
 *         type: string
 *         default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2ODUxNzAyMTEsImV4cCI6MTY4NTI1NjYxMSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwIiwic3ViIjoiNjQ3MTg5M2M5ZGQzOTZiMjIzOTE3MmQ3In0.rBdBHui7vmct3e-7fqHP7BJoZ43FeRRuQ-XwQmxTAlg
 *     responses:
 *       200:
 *         description: Successfully downvoted
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               default: true
 */
router.post("/comment/:id/downvote", authMiddleware, downvoteComment);

export default router;
