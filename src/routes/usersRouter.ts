import express from "express";

const usersRouter = express.Router();

// GET /users
usersRouter.get("/", async (req, res) => {
  res.json([{ id: 1, name: "only-me!" }]);
});

export { usersRouter };
