import mongoose from "mongoose";
import consola from "consola";

export const connectDatabase = async () => {
  try {
    const MONGO_URI =
      process.env.MONGO_URI ?? "mongodb://localhost:27017/insnyk";
    await mongoose.connect(MONGO_URI);
    consola.info("Successfully connected to database");
  } catch (err) {
    consola.error(`Failed to connect to database: ${err}`);
    throw err;
  }
};
