import { Client } from "pg";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Todo from "./ToDoInterface";
import filePath from "./filePath";
import getErrorMessage from "./utils/getErrorMessage";
import getEnvVarOrFail from "./utils/getEnvVarOrFail";

dotenv.config();
const client = new Client({
  connectionString: getEnvVarOrFail("DATABASE_URL"),
});
async function connectToDB() {
  await client.connect();
}

connectToDB();

const app = express();
app.use(express.json());
app.use(cors());

const PORT_NUMBER = process.env.PORT ?? 4000;

// API info page
app.get("/", (req, res) => {
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});

// GET /todos
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await client.query("SELECT * from todo");
    res.status(200).json(allTodos.rows);
  } catch (error) {
    console.error(getErrorMessage(error));
  }
});

// POST /todos
app.post<{}, {}, Todo>("/todos", async (req, res) => {
  try {
    const { description, creationDate, completed } = req.body;
    const sqlQuery =
      "insert into todo(description, creation_date, completed) values($1,$2,$3) returning *";
    const values = [description, creationDate, completed];
    const newToDo = await client.query(sqlQuery, values);

    res.status(201).json(newToDo.rows[0]);
  } catch (error) {
    console.error(getErrorMessage(error));
  }
});

// GET /todos/:id
app.get<{ id: string }>("/todos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sqlQuery = "select * from todo where todo_id = $1;";
    const idValue = [id];
    const todo = await client.query(sqlQuery, idValue);
    if (todo.rows.length === 0) {
      res.status(404).json(`The todo task with id ${id} not found`);
    } else {
      res.status(200).json(todo.rows[0]);
    }
  } catch (error) {
    console.error(getErrorMessage(error));
    res
      .status(500)
      .json(
        "Oops something went wrong. Please refresh this page or try again later."
      );
  }
});

// DELETE /todos/:id
app.delete<{ id: string }>("/todos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sqlQuery = "delete from todo where todo_id = $1 returning *";
    const values = [id];
    const deleteTodo = await client.query(sqlQuery, values);
    res.status(200).json({
      message: "The following todo has been deleted",
      deleted: deleteTodo.rows[0],
    });
  } catch (error) {
    console.error(getErrorMessage(error));
    res
      .status(500)
      .json(
        "Oops something went wrong. Please refresh this page or try again later."
      );
  }
});

// PATCH /todos/:id
app.patch<{ id: string }, {}, Partial<Todo>>("/todos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { description, completed } = req.body;
    const columnUpdates: string[] = [];
    const updateValues: (string | boolean | Date | number)[] = [id];

    description !== undefined &&
      columnUpdates.push(`description = $${updateValues.push(description)}`);
    completed !== undefined &&
      columnUpdates.push(`completed = $${updateValues.push(completed)}`);

    const sqlQuery = `update todo set ${columnUpdates.join(
      ","
    )} where todo_id = $1 returning *`;

    const updateTodo = await client.query(sqlQuery, updateValues);
    res.status(200).json({
      message: "The following todo has been updated",
      updated: updateTodo.rows[0],
    });
  } catch (error) {
    console.error(getErrorMessage(error));
    res
      .status(500)
      .json(
        "Oops something went wrong. Please refresh this page or try again later."
      );
  }
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
