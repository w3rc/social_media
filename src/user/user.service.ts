import userModel from "./domain/user";
import { IUser } from "./domain/user.inteface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import LoginUserInput from "./dto/loginUser.input";
import RegisterUserInput from "./dto/registerUser.input";

export const registerUser = async (registerUserInput: RegisterUserInput): Promise<string> => {
  const user: IUser = {
    _id: new Types.ObjectId(),
    name: registerUserInput.name,
    email: registerUserInput.email,
    password: registerUserInput.password,
  };

  const existingUser = await userModel.findOne({ email: user.email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  user.password = await generateHashedPassword(user.password);
  await userModel.create(user);

  return generateAccessToken(user);
};

export const loginUser = async (loginUserInput: LoginUserInput): Promise<string> => {
  let user: IUser = {
    email: loginUserInput.email,
    password: loginUserInput.password,
  };

  const userData = await userModel.findOne({ email: user.email });

  if (!userData) {
    throw new Error("The user you are trying to login does not exist");
  } else {
    user = {
      ...user,
      _id: userData._id,
      name: userData.name,
    };
  }

  if (!checkIfPasswordMatches) {
    throw Error("Invalid Password")
  }

  return generateAccessToken(user);
};

const generateHashedPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const generateAccessToken = (user: IUser) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw Error("Something went wrong!");
  }

  return jwt.sign({ name: user.name, email: user.email }, JWT_SECRET, {
    expiresIn: 86400,
    subject: user._id?.toString(),
    issuer: `http://${process.env.API_URL ?? "localhost"}:${process.env.PORT ?? 4000
      }`,
  });
};

const checkIfPasswordMatches = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
