import TodosDao from "./dao";
export default function TodoRoutes(app) {
  const dao = TodosDao();
  const findTodos = async (req, res) => {
    const todos =
      req.query.completed === "true"
        ? await dao.findCompletedTodos()
        : await dao.findAllTodos();
    res.json(todos);
  };
  const findTodoById = async (req, res) => {
    const todo = await dao.findTodoById(req.params.id);
    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }
    res.json(todo);
  };
  const createTodo = async (req, res) => {
    const todo = await dao.createTodo({ title: req.body.title });
    res.json(todo);
  };
  const updateTodo = async (req, res) => {
    const { _id, ...updates } = req.body;
    await dao.updateTodo(req.params.id, updates);
    const todo = await dao.findTodoById(req.params.id);
    res.json(todo);
  };
  const deleteTodo = async (req, res) => {
    await dao.deleteTodo(req.params.id);
    res.sendStatus(200);
  };
  app.get("/api/lab6/todos", findTodos);
  app.get("/api/lab6/todos/:id", findTodoById);
  app.post("/api/lab6/todos", createTodo);
  app.put("/api/lab6/todos/:id", updateTodo);
  app.delete("/api/lab6/todos/:id", deleteTodo);
}
