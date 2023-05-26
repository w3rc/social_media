import jwt from "jsonwebtoken";

export const extractSub = (token: string): string => {
    const decodedJWT = jwt.decode(token);
    const subject = decodedJWT?.sub as string;
    if (!subject) {
        throw Error("Unauthorized");
    }
    return subject;
}