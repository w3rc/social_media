import { Request, Response } from "express";
import { Types } from "mongoose";
import { IPost } from "./domain/post.interface";
import { extractSub } from "../util/jwtUtil";
import postModel from './domain/post'

export const createPost = async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization?.split("Bearer")[1];
    if (!accessToken) {
        res.status(401).send("Unauthorized");
    } else {

        const post: IPost = {
            _id: new Types.ObjectId(),
            title: req.body.title,
            content: req.body.content,
            author: extractSub(accessToken)
        }

        await postModel.create(post);
    }
};

export const getPostById = async (req: Request, res: Response) => {
    const postId = req.params.id;

    return await postModel.findById(postId);
};
