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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       200:
 *         description: Successful response
 *         contents:
 *           application/json:
 *             schema:
 *               type: object
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
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: string
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
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
router.post("/comment", authMiddleware, createComment);

/**
 * @swagger
 * /post/:id/comments:
 *   get:
 *     summary: Get Comments By Post
 *     description: Get Comments By Post
 *     tags: [Comment] 
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
router.get("/post/:id/comments", authMiddleware, getCommentsByPost);

/**
 * @swagger
 * /comment/:id/upvote:
 *   post:
 *     summary: Upvote a comment
 *     description: Upvote a comment
 *     tags: [Comment] 
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
router.post("/comment/:id/upvote", authMiddleware, upvoteComment);

/**
 * @swagger
 * /comment/:id/downvote:
 *   post:
 *     summary: Downvote a comment
 *     description: Downvote a comment
 *     tags: [Comment] 
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
router.post("/comment/:id/downvote", authMiddleware, downvoteComment);

export default router;
