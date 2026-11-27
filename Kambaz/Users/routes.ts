import UsersDao from "./dao";
export default function UserRoutes(app, db) {
  const dao = UsersDao();
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  const signout = async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };
  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };
  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = await dao.findUserById(userId);
    if (req.session["currentUser"]?._id === userId) {
      req.session["currentUser"] = currentUser;
    }
    res.json(currentUser);
  };
  const findUsersForCourse = async (req, res) => {
    const users = await dao.findAllUsers();
    const { enrollments } = db;
    res.json(
      users.filter((user) =>
        enrollments.some(
          (enrollment) =>
            enrollment.user === user._id && enrollment.course === req.params.cid,
        ),
      ),
    );
  };
  const createUser = async (req, res) => {
    res.json(await dao.createUser(req.body));
  };
  const deleteUser = async (req, res) => {
    await dao.deleteUser(req.params.userId);
    res.sendStatus(200);
  };
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.get("/api/users/profile", profile);
  app.put("/api/users/:userId", updateUser);
  app.get("/api/courses/:cid/users", findUsersForCourse);
  app.post("/api/users", createUser);
  app.delete("/api/users/:userId", deleteUser);
}
