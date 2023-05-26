import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.inteface";

const userSchema = new Schema<IUser & Document>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model<IUser & Document>("User", userSchema);

export default UserModel;
