import { Request, Response } from "express";
import {
  createComment,
  getCommentsByPost,
  upvoteComment,
  downvoteComment,
} from "./comment.controller";
import { extractSubClaim } from "../util/jwtUtil";
import {
  createComment as createCommentService,
  getCommentsByPost as getCommentsByPostService,
  upvoteComment as upvoteCommentService,
  downvoteComment as downvoteCommentService,
} from "./comment.service";

jest.mock("../util/jwtUtil");
jest.mock("./comment.service");

describe("Comment Controller", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;
  });

  describe("createComment", () => {
    it("should create a new comment", async () => {
      req.body = {
        content: "Test comment",
        parent_id: "123",
      };
      req.query = {
        post_id: "456",
      };

      const createdComment = {
        id: "789",
        content: "Test comment",
        parent_id: "123",
      };
      (createCommentService as jest.Mock).mockResolvedValueOnce(createdComment);
      (extractSubClaim as jest.Mock).mockReturnValueOnce("userId123");

      await createComment(req, res);

      // Check the response
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(createdComment);
    });

    it("should return 400 if validation fails", async () => {
      req.body = {
        content: "",
        parent_id: "123",
      };
      req.query = {
        post_id: "456",
      };

      await createComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect((res.json as any).mock.calls[0][0]).toHaveProperty("error");
    });

    it("should return 400 if post_id is missing", async () => {
      req.body = {
        content: "Test comment",
        parent_id: "123",
      };
      req.query = {};

      await createComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid Post ID");
    });
  });

  describe("getCommentsByPost", () => {
    it("should get comments by post ID", async () => {
      req.params.id = "123";

      const comments = [{ id: "456", content: "Test comment" }];
      (getCommentsByPostService as jest.Mock).mockResolvedValueOnce(comments);

      await getCommentsByPost(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(comments);
    });
  });

  describe("upvoteComment", () => {
    it("should upvote a comment", async () => {
      req.params.id = "123";

      (upvoteCommentService as jest.Mock).mockResolvedValueOnce(true);
      (extractSubClaim as jest.Mock).mockReturnValueOnce("userId123");

      await upvoteComment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(true);
    });

    it("should return 500 if upvoting fails", async () => {
      req.params.id = "123";

      (upvoteCommentService as jest.Mock).mockResolvedValueOnce(false);
      (extractSubClaim as jest.Mock).mockReturnValueOnce("userId123");

      await upvoteComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Could not upvote comment",
      });
    });
  });

  describe("downvoteComment", () => {
    it("should downvote a comment", async () => {
      req.params.id = "123";

      (downvoteCommentService as jest.Mock).mockResolvedValueOnce(true);
      (extractSubClaim as jest.Mock).mockReturnValueOnce("userId123");

      await downvoteComment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(true);
    });

    it("should return 500 if downvoting fails", async () => {
      req.params.id = "123";

      (downvoteCommentService as jest.Mock).mockResolvedValueOnce(false);
      (extractSubClaim as jest.Mock).mockReturnValueOnce("userId123");

      await downvoteComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Could not downvote comment",
      });
    });
  });
});
