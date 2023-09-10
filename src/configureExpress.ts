import cors from "cors";
import express, { Express } from "express";
import morgan from "morgan";
import { todosRouter } from "./routes/todosRouter";
import { usersRouter } from "./routes/usersRouter";

export function configureExpress(app: Express) {
  //general middleware
  app.use(express.json());
  app.use(cors());
  app.use(morgan("tiny"));

  // top-level info page for the API.
  app.get("/", (req, res) => {
    res.send("try /todos or /users");
  });

  //our grouped routers
  app.use("/todos", todosRouter);
  app.use("/users", usersRouter);
}
