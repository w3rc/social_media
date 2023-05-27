import { Request, Response } from "express";
import { createPost, getPostById } from "./post.controller";
import { createPost as createPostService, getPostById as getPostByIdService } from "./post.service";
import { extractSubClaim } from "../util/jwtUtil";

jest.mock("../util/jwtUtil");
jest.mock("./post.service");

describe("Post Controller", () => {
    let req: Request;
    let res: Response;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        } as Request;
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        } as unknown as Response;
    });

    describe("createPost", () => {
        it("should create a new post", async () => {
            req.body = {
                title: "Test Post",
                content: "This is a test post",
              };

              const createdPost = { id: "123", title: "Test Post", content: "This is a test post" };
              (createPostService as jest.Mock).mockResolvedValueOnce(createdPost);
              (extractSubClaim as jest.Mock).mockReturnValueOnce("userId123");
        
              await createPost(req, res);
        
              expect(res.status).toHaveBeenCalledWith(201);
              expect(res.send).toHaveBeenCalledWith(createdPost);        
        });

        it("should return 400 if validation fails", async () => {
            req.body = {
              title: "Test Post",
              content: "",
            };
      
            await createPost(req, res);
      
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalled();
            expect((res.json as any).mock.calls[0][0]).toHaveProperty("error");
          });
    });

    describe("getPostById", () => {
        it("should get a post by ID", async () => {
            req.params.id = "123";
      
            const post = { id: "123", title: "Test Post", content: "This is a test post" };
            (getPostByIdService as jest.Mock).mockResolvedValueOnce(post);
      
            await getPostById(req, res);
      
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(post);
          });
    });
});