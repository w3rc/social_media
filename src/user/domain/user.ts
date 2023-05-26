import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.inteface";

class User implements IUser {
    constructor(public name: string) { }
}

const userSchema = new Schema<User & Document>({
    name: { type: String, required: true },
});

const UserModel = mongoose.model<User & Document>('User', userSchema);

export default UserModel;