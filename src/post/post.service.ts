import { Types } from "mongoose";
import { IPost } from "./domain/post.interface";
import postModel from "./domain/post";
import CreatePostInput from "./dto/createPost.input";

export const createPost = async (
  createPostInput: CreatePostInput,
  author: string,
): Promise<IPost> => {
  const post: IPost = {
    _id: new Types.ObjectId(),
    title: createPostInput.title,
    content: createPostInput.content,
    author,
    created_at: new Date().toISOString(),
  };

  return await postModel.create(post);
};

export const getPostById = async (postId: string): Promise<IPost> => {
  const post = await postModel.findById(postId);
  if (!post) {
    throw new Error("Post does not exist");
  }
  return post;
};
