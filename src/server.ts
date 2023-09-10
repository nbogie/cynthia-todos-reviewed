import express from "express";
import dotenv from "dotenv";
import { configureRoutes } from "./configureRoutes";
import { connectToDB } from "./db";

export const app = express();

configureRoutes(app);

connectToDBAndStartExpressListening();

async function connectToDBAndStartExpressListening() {
  await connectToDB();

  dotenv.config();
  const PORT_NUMBER = process.env.PORT ?? 4000;

  app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening on port ${PORT_NUMBER}!`);
  });
}
