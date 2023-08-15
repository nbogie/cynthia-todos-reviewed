import faker from "faker";

export interface Todo {
  description: string;
  creationDate: Date;
  dueDate: Date;
  completed: boolean;
}

export interface TodoWithId extends Todo {
  id: number;
}

const db: TodoWithId[] = [];

/** Variable to keep incrementing id of todo tasks */
let idCounter = 0;

/**
 * Adds in some dummy todo tasks to the database
 *
 * @param n - the number of todo tasks to generate
 * @returns the created todo tasks
 */
export const addDummyTodoTasks = (n: number): TodoWithId[] => {
  const createdTodos: TodoWithId[] = [];
  for (let count = 0; count < n; count++) {
    const createdTodo = addTodo({
      description: faker.lorem.words(3),
      creationDate: faker.date.recent(5),
      dueDate: faker.date.soon(10),
      completed: faker.datatype.boolean(),
    });
    createdTodos.push(createdTodo);
  }
  return createdTodos;
};

/**
 * Adds in a single todo to the database
 *
 * @param data - the todo data to insert in
 * @returns the todo added (with a newly created id)
 */
export const addTodo = (data: Todo): TodoWithId => {
  const newEntry: TodoWithId = {
    id: ++idCounter,
    ...data,
  };
  db.push(newEntry);
  return newEntry;
};

/**
 * Deletes a todo task with the given id
 *
 * @param id - the id of the todo task to delete
 * @returns the deleted todo task (if originally located),
 *  otherwise the string `"not found"`
 */
export const deleteTodoTaskById = (id: number): TodoWithId | "not found" => {
  const idxToDeleteAt = findIndexOfTodoTaskById(id);
  if (typeof idxToDeleteAt === "number") {
    const TodoTaskToDelete = getTodoTaskById(id);
    db.splice(idxToDeleteAt, 1); // .splice can delete from an array
    return TodoTaskToDelete;
  } else {
    return "not found";
  }
};

/**
 * Finds the index of a todo task with a given id
 *
 * @param id - the id of the todo task to locate the index of
 * @returns the index of the matching todo task,
 *  otherwise the string `"not found"`
 */
const findIndexOfTodoTaskById = (id: number): number | "not found" => {
  const matchingIdx = db.findIndex((entry) => entry.id === id);
  // .findIndex returns -1 if not located
  if (matchingIdx !== -1) {
    return matchingIdx;
  } else {
    return "not found";
  }
};

/**
 * Find all todo task
 * @returns all todo task from the database
 */
export const getAllTodoTasks = (): TodoWithId[] => {
  return db;
};

/**
 * Locates a todo task by a given id
 *
 * @param id - the id of the todo task to locate
 * @returns the located todo task (if found),
 *  otherwise the string `"not found"`
 */
export const getTodoTaskById = (id: number): TodoWithId | "not found" => {
  const maybeEntry = db.find((entry) => entry.id === id);
  if (maybeEntry) {
    return maybeEntry;
  } else {
    return "not found";
  }
};

/**
 * Applies a partial update to a todo task for a given id
 *  based on the passed data
 *
 * @param id - the id of the todo task to update
 * @param newData - the new data to overwrite
 * @returns the updated todo task (if one is located),
 *  otherwise the string `"not found"`
 */
export const updateTodoTaskById = (
  id: number,
  newData: Partial<Todo>
): TodoWithId | "not found" => {
  const idxOfEntry = findIndexOfTodoTaskById(id);
  // type guard against "not found"
  if (typeof idxOfEntry === "number") {
    return Object.assign(db[idxOfEntry], newData);
  } else {
    return "not found";
  }
};
