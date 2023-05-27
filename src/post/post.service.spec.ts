import { Types } from "mongoose";
import { IPost } from "./domain/post.interface";
import postModel from "./domain/post";
import { createPost, getPostById } from "./post.service";
import CreatePostInput from "./dto/createPost.input";

jest.mock("./domain/post");

describe("Post Service", () => {
  describe("createPost", () => {
    it("should create a new post", async () => {
      const createPostInput: CreatePostInput = new CreatePostInput("Test Post", "This is a test post");
      const author = "user123";

      const expectedPost: IPost = {
        _id: new Types.ObjectId(),
        title: createPostInput.title,
        content: createPostInput.content,
        author: author,
        created_at: expect.any(String),
      };

      (postModel.create as jest.Mock).mockResolvedValueOnce(expectedPost);

      const createdPost = await createPost(createPostInput, author);

      expect(createdPost).toEqual(expectedPost);
    });
  });

  describe("getPostById", () => {
    it("should get a post by ID", async () => {
      const postId = new Types.ObjectId();

      const expectedPost: IPost = {
        _id: postId,
        title: "Test Post",
        content: "This is a test post",
        author: "user123",
        created_at: expect.any(String),
      };

      (postModel.findById as jest.Mock).mockResolvedValueOnce(expectedPost);

      const post = await getPostById(postId.toString());

      expect(post).toEqual(expectedPost);
    });

    it("should throw an error if post does not exist", async () => {
      const postId = "123";

      (postModel.findById as jest.Mock).mockResolvedValueOnce(null);

      await expect(getPostById(postId)).rejects.toThrow("Post does not exist");
    });
  });
});
