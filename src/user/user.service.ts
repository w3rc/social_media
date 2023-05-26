import userModel from "./domain/user";
import { IUser } from "./domain/user.inteface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Types } from "mongoose";
import consola from "consola";

export const register = async (req: Request, res: Response) => {
  const user: IUser = {
    _id: new Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  consola.log(user);

  const existingUser = await userModel.findOne({ email: user.email });

  if (existingUser) {
    return res.status(400).send("User already exists!");
  }

  user.password = await generateHashedPassword(user.password);
  consola.log(user);

  await userModel.create(user);

  return res.status(200).send({ accessToken: generateAccessToken(user) });
};

export const login = async (req: Request, res: Response) => {
  let user: IUser = {
    email: req.body.email,
    password: req.body.password,
  };

  if (!user.email) {
    return res.status(400).send({ error: "Please enter an email" });
  }

  if (!user.password) {
    return res.status(400).send({ error: "Please enter a password" });
  }

  const userData = await userModel.findOne({ email: user.email });

  if (!userData) {
    return res
      .status(404)
      .send({ message: "The user you are trying to login does not exist" });
  } else {
    user = {
      ...user,
      _id: userData._id,
      name: userData.name,
    };
  }

  if (!checkIfPasswordMatches) {
    return res.status(400).send({ message: "Invalid password" });
  }

  return res.status(200).send({ accessToken: generateAccessToken(user) });
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
    issuer: `http://${process.env.API_URL ?? "localhost"}:${
      process.env.PORT ?? 4000
    }`,
  });
};

const checkIfPasswordMatches = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
