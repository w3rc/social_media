import { Request } from "express";
import jwt from "jsonwebtoken";

export const getToken = (req: Request) =>
  req.headers.authorization?.split("Bearer ")[1];

export const extractSubClaim = (req: Request): string => {
  const token = getToken(req);
  if (!token) {
    throw Error("Unauthorized");
  }
  const decodedJWT = jwt.decode(token);
  const subject = decodedJWT?.sub as string;
  if (!subject) {
    throw Error("Invalid sub claim");
  }
  return subject;
};
