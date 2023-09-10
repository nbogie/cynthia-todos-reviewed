import dotenv from "dotenv";
import express from "express";
import { connectToDB } from "./db";
import { configureExpress } from "./configureExpress";

export const app = express();

configureExpress(app);

connectToDBAndStartExpressListening();

async function connectToDBAndStartExpressListening() {
  await connectToDB();

  dotenv.config();
  const PORT_NUMBER = process.env.PORT ?? 4000;

  app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening on port ${PORT_NUMBER}!`);
  });
}
