import cors from "cors";
import express, { Express } from "express";
import Todo from "./ToDoInterface";
import { queryAndLog } from "./db";
import { getErrorMessage } from "./utils/getErrorMessage";
import morgan from "morgan";

export function configureRoutes(app: Express): void {
  const todosRouter = express.Router();

  app.use(express.json());
  app.use(cors());
  app.use(morgan("tiny"));

  // API info page
  app.get("/", (req, res) => {
    res.send("try /todos");
  });

  app.use("/todos", todosRouter);

  // GET /todos
  todosRouter.get("/", async (req, res) => {
    try {
      const allTodos = await queryAndLog("SELECT * from todo");
      res.status(200).json(allTodos.rows);
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  });

  // POST /todos
  todosRouter.post<{}, {}, Todo>("/", async (req, res) => {
    try {
      //TODO: validate!
      const { description, completed } = req.body;

      if (description === undefined) {
        res.status(400).send("bad request - missing description");
        return;
      }

      const sqlQuery =
        "insert into todo(description, completed) values($1,$2) returning *";
      const values = [description, completed];
      const dbResult = await queryAndLog(sqlQuery, values);

      const newResult = dbResult.rows[0];
      res.status(201).json(newResult);
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  });

  // GET /todos/:id
  todosRouter.get<{ id: string }>("/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const sqlQuery = "select * from todo where todo_id = $1;";
      const idValue = [id];
      const todo = await queryAndLog(sqlQuery, idValue);
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
  todosRouter.delete<{ id: string }>("/:id", async (req, res) => {
    try {
      const id = BigInt(req.params.id);
      const sqlQuery = "delete from todo where todo_id = $1 returning *";
      const values = [id];

      console.log({ id });
      const dbResult = await queryAndLog(sqlQuery, values);
      console.log("after query");
      
      if (dbResult.rowCount === 0) {
        res.status(404).json({ message: `Couldn't find todo with id: ${id}` });
        return;
      }
      res.status(200).json({
        message: "The following todo has been deleted",
        deleted: dbResult.rows[0],
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
  todosRouter.patch<{ id: string }, {}, Partial<Todo>>(
    "/:id",
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const { description, completed } = req.body;
        const columnUpdates: string[] = [];
        const updateValues: (string | boolean | Date | number)[] = [id];

        description !== undefined &&
          columnUpdates.push(
            `description = $${updateValues.push(description)}`
          );
        completed !== undefined &&
          columnUpdates.push(`completed = $${updateValues.push(completed)}`);

        const sqlQuery = `update todo set ${columnUpdates.join(
          ","
        )} where todo_id = $1 returning *`;

        const updateTodo = await queryAndLog(sqlQuery, updateValues);
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
    }
  );
}
