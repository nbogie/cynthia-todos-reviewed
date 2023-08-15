import { Client } from "pg";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  addDummyTodoTasks,
  addTodo,
  getAllTodoTasks,
  getTodoTaskById,
  Todo,
  updateTodoTaskById,
} from "./db";
import filePath from "./filePath";
import getErrorMessage from "./utils/getErrorMessage";

addDummyTodoTasks(20);

const client = new Client({ database: "tododb" });
client.connect();

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT_NUMBER = process.env.PORT ?? 4000;

// API info page
app.get("/", (req, res) => {
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});

// GET /todos
app.get("/todos", async (req, res) => {
  const dbResponse = await client.query("SELECT * from todo");
  res.status(200).json(dbResponse.rows);
});

// POST /todos
app.post<{}, {}, Todo>("/todos", async (req, res) => {
  try {
    const { task, creationDate, dueDate, completed } = req.body;
    const sqlQuery =
      "insert into todo(task, creation_date,due_date, completed) values($1,$2,$3,$4) returning *";
    const values = [task, creationDate, dueDate, completed];
    const newToDo = await client.query(sqlQuery, values);

    res.status(201).json(newToDo.rows[0]);
  } catch (error) {
    console.error(getErrorMessage(error));
  }
});

// GET /todos/:id
app.get<{ id: string }>("/todos/:id", (req, res) => {
  const matchingSignature = getTodoTaskById(parseInt(req.params.id));
  if (matchingSignature === "not found") {
    res.status(404).json(matchingSignature);
  } else {
    res.status(200).json(matchingSignature);
  }
});

// DELETE /todos/:id
app.delete<{ id: string }>("/todos/:id", (req, res) => {
  const matchingSignature = getTodoTaskById(parseInt(req.params.id));
  if (matchingSignature === "not found") {
    res.status(404).json(matchingSignature);
  } else {
    res.status(200).json(matchingSignature);
  }
});

// PATCH /todos/:id
app.patch<{ id: string }, {}, Partial<Todo>>("/todos/:id", (req, res) => {
  const matchingSignature = updateTodoTaskById(
    parseInt(req.params.id),
    req.body
  );
  if (matchingSignature === "not found") {
    res.status(404).json(matchingSignature);
  } else {
    res.status(200).json(matchingSignature);
  }
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
