import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import "../types/express.d.ts";

import consola from "consola";
import { connectDatabase } from "./config/database/mongodb_config";
import dotenv from "dotenv";

const app = express();
app.use(bodyParser.json());

const { PORT = 4000, API_URL } = process.env;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", API_URL ?? "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  next();
});

async function bootstrap() {
  try {
    dotenv.config();
    await connectDatabase();
    app.use("/api/v1", routes);

    app.listen(PORT, () => {
      consola.success(`🚀 App is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    consola.error(err);
  }
}
bootstrap();
