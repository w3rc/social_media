import { Request, Response } from "express";
import { register, login } from "./user.controller";
import { registerUser as registerUserService, loginUser as loginUserService } from "./user.service";

jest.mock("./user.service");

describe("User Controller", () => {
    let req: Request;
    let res: Response;

    beforeEach(() => {
        req = {
            body: {},
        } as Request;
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        } as unknown as Response;
    });

    describe("register", () => {
        it("should register a new user", async () => {
            req.body = {
                name: "John Doe",
                email: "johndoe@example.com",
                password: "password123",
            };

            const accessToken = "mockAccessToken";
            (registerUserService as jest.Mock).mockResolvedValueOnce(accessToken);

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ accessToken });           
        });

        it("should return 400 if validation fails", async () => {
            req.body = {
                name: "John Doe",
                email: "johndoe@example.com",
                password: "",
            };

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalled();
            expect((res.json as any).mock.calls[0][0]).toHaveProperty("error");
        });
    });

    describe("login", () => {
        it("should login a user", async () => {
            req.body = {
                email: "johndoe@example.com",
                password: "password123",
            };

            const accessToken = "mockAccessToken";
            (loginUserService  as jest.Mock).mockResolvedValueOnce(accessToken);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ accessToken });
        });

        it("should return 400 if validation fails", async () => {
            req.body = {
                email: "johndoe@example.com",
                password: "",
            };

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalled();
            expect((res.json as any).mock.calls[0][0]).toHaveProperty("error");
        });
    });
});