import commentModel from "./domain/comment";
import {
  createComment,
  getCommentsByPost,
  upvoteComment,
  downvoteComment,
} from "./comment.service";
import { IComment } from "./domain/comment.interface";
import CreateCommentInput from "./dto/createComment.input";
import { Types } from "mongoose";

jest.mock("./domain/comment");

describe("Comment Service", () => {
  describe("createComment", () => {
    it("should create a new comment", async () => {
      const createCommentInput: CreateCommentInput = new CreateCommentInput(
        "Test comment",
        "123",
      );

      const post_id = "456";
      const author = "user123";

      const expectedComment: IComment = {
        _id: new Types.ObjectId(),
        content: createCommentInput.content,
        author: author,
        upvotes: [],
        downvotes: [],
        post_id: post_id,
        parent_id: createCommentInput.parent_id,
        created_at: expect.any(String),
      };

      (commentModel.create as jest.Mock).mockResolvedValueOnce(expectedComment);

      const createdComment = await createComment(
        createCommentInput,
        post_id,
        author,
      );

      expect(createdComment).toEqual(expectedComment);
    });
  });

  describe("getCommentsByPost", () => {
    it("should get comments by post ID", async () => {
      const postId = "123";

      const expectedComments: IComment[] = [
        {
          _id: new Types.ObjectId(),
          content: "Test comment 1",
          post_id: postId,
          upvotes: [],
          downvotes: [],
          author: "johndoe",
          created_at: "2023-05-27T05:32:34.148Z",
        },
        {
          _id: new Types.ObjectId(),
          content: "Test comment 2",
          post_id: postId,
          upvotes: [],
          downvotes: [],
          author: "janedoe",
          created_at: "2023-05-27T05:32:34.148Z",
        },
      ];

      (commentModel.aggregate as jest.Mock).mockResolvedValueOnce(
        expectedComments,
      );

      const comments = await getCommentsByPost(postId, false);

      expect(comments).toEqual(expectedComments);
    });
  });

  describe("upvoteComment", () => {
    it("should upvote a comment", async () => {
      const commentId = "123";
      const upvoter = "user123";

      (commentModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
        upvotes: [upvoter],
      });

      const result = await upvoteComment(commentId, upvoter);

      expect(result).toBe(true);
    });

    it("should return false if upvoting fails", async () => {
      const commentId = "123";
      const upvoter = "user123";

      (commentModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);

      const result = await upvoteComment(commentId, upvoter);

      expect(result).toBe(false);
    });
  });

  describe("downvoteComment", () => {
    it("should downvote a comment", async () => {
      const commentId = "123";
      const downvoter = "user123";

      (commentModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
        downvotes: [downvoter],
      });

      const result = await downvoteComment(commentId, downvoter);

      expect(result).toBe(true);
    });

    it("should return false if downvoting fails", async () => {
      const commentId = "123";
      const downvoter = "user123";

      (commentModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);

      const result = await downvoteComment(commentId, downvoter);

      expect(result).toBe(false);
    });
  });
});
