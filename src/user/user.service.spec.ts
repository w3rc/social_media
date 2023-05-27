import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "./domain/user";
import { registerUser, loginUser } from "./user.service";
import RegisterUserInput from "./dto/registerUser.input";
import LoginUserInput from "./dto/loginUser.input";
import dotenv from "dotenv";

dotenv.config();

jest.mock("./domain/user");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("User Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("registerUser", () => {
        it("should register a new user and return an access token", async () => {
            const registerUserInput: RegisterUserInput = new RegisterUserInput("John Doe", "john.doe@example.com", "password123");

            const user = {
                _id: expect.any(String),
                name: registerUserInput.name,
                email: registerUserInput.email,
                password: "hashed_password",
            };

            const accessToken = "access_token";

            (userModel.findOne as jest.Mock).mockResolvedValue(null);
            (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
            (bcrypt.hash as jest.Mock).mockResolvedValue(user.password);
            (userModel.create as jest.Mock).mockResolvedValue(user);
            (jwt.sign as jest.Mock).mockReturnValue(accessToken);

            const result = await registerUser(registerUserInput);

            expect(userModel.findOne).toHaveBeenCalledWith({ email: registerUserInput.email });
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(registerUserInput.password, "salt");

            expect(result).toBe(accessToken);
        });

        it("should throw an error if the user already exists", async () => {
            const registerUserInput: RegisterUserInput = new RegisterUserInput("John Doe", "john.doe@example.com", "password123");


            const existingUser = {
                _id: "user_id",
                name: registerUserInput.name,
                email: registerUserInput.email,
                password: "hashed_password",
            };

            (userModel.findOne as jest.Mock).mockResolvedValue(existingUser);

            await expect(registerUser(registerUserInput)).rejects.toThrowError(
                "User already exists"
            );

            expect(userModel.findOne).toHaveBeenCalledWith({ email: registerUserInput.email });
            expect(bcrypt.genSalt).not.toHaveBeenCalled();
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(userModel.create).not.toHaveBeenCalled();
            expect(jwt.sign).not.toHaveBeenCalled();
        });
    });

    describe("loginUser", () => {
        it("should login the user and return an access token", async () => {
            const loginUserInput: LoginUserInput = new LoginUserInput("john.doe@example.com", "password123");

            const userData = {
                _id: "user_id",
                name: "John Doe",
                email: loginUserInput.email,
                password: "hashed_password",
            };

            const accessToken = "access_token";

            (userModel.findOne as jest.Mock).mockResolvedValue(userData);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue(accessToken);

            const result = await loginUser(loginUserInput);

            expect(userModel.findOne).toHaveBeenCalledWith({ email: loginUserInput.email });
            expect(jwt.sign).toHaveBeenCalledWith(
                { name: userData.name, email: userData.email },
                process.env.JWT_SECRET,
                {
                    expiresIn: 86400,
                    subject: userData._id.toString(),
                    issuer: `http://${process.env.API_URL ?? "localhost"}:${process.env.PORT ?? 4000}`,
                }
            );
            expect(result).toBe(accessToken);
        });

        it("should throw an error if the user does not exist", async () => {
            const loginUserInput: LoginUserInput = new LoginUserInput("john.doe@example.com", "password123");


            (userModel.findOne as jest.Mock).mockResolvedValue(null);

            await expect(loginUser(loginUserInput)).rejects.toThrowError(
                "The user you are trying to login does not exist"
            );

            expect(userModel.findOne).toHaveBeenCalledWith({ email: loginUserInput.email });
            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it("should throw an error if the password is invalid", async () => {
            const loginUserInput: LoginUserInput = new LoginUserInput("john.doe@example.com", "password123");

            const userData = {
                _id: "user_id",
                name: "John Doe",
                email: loginUserInput.email,
                password: "hashed_password",
            };

            (userModel.findOne as jest.Mock).mockResolvedValue(userData);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(loginUser(loginUserInput)).rejects.toThrowError("Invalid Password");

            expect(userModel.findOne).toHaveBeenCalledWith({ email: loginUserInput.email });
            expect(bcrypt.compare).toHaveBeenCalledWith(
                loginUserInput.password,
                userData.password
            );
            expect(jwt.sign).not.toHaveBeenCalled();
        });
    });
});
