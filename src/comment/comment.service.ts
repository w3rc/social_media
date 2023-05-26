import { Request, Response } from "express";
import commentModel from "./domain/comment";
import { extractSub } from "../util/jwtUtil";
import { IComment } from "./domain/comment.interface";
import { Types } from "mongoose";

export const createComment = async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization?.split("Bearer")[1];
    if (!accessToken) {
        res.status(401).send("Unauthorized");
    } else {

        const comment: IComment = {
            _id: new Types.ObjectId(),
            content: req.body.content,
            author: extractSub(accessToken),
            upvotes: [],
            downvotes: [],
            parent: {
                type: req.body.parent.type,
                id: req.body.parent.id
            }
        }

        await commentModel.create(comment);
    }
};

export const getCommentsByPost = async (req: Request, res: Response) => {

    const postId = req.params.id;
    await commentModel.find({ "parent.type": "post", "parent.id": postId }).sort({});
};

export const upvoteComment = async (req: Request, res: Response) => {
    const commentId = req.params.id;
    const accessToken = req.headers.authorization?.split("Bearer")[1];
    if (!accessToken) {
        res.status(401).send("Unauthorized");
    } else {
        const upvoter = extractSub(accessToken);
        await commentModel.findByIdAndUpdate(commentId, { $set: { $push: { upvotes: upvoter } } });
    }
};

export const downvoteComment = async (req: Request, res: Response) => {
    const commentId = req.params.id;
    const accessToken = req.headers.authorization?.split("Bearer")[1];
    if (!accessToken) {
        res.status(401).send("Unauthorized");
    } else {
        const downvoter = extractSub(accessToken);
        await commentModel.findByIdAndUpdate(commentId, { $set: { $push: { downvotes: downvoter } } });
    }
};
