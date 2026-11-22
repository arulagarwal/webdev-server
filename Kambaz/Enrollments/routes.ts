import EnrollmentsDao from "./dao";
export default function EnrollmentRoutes(app, db) {
  const dao = EnrollmentsDao(db);
  const resolveUserId = (req, res) => {
    let { uid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return null;
      }
      uid = currentUser._id;
    }
    return uid;
  };
  const findEnrollmentsForUser = (req, res) => {
    const userId = resolveUserId(req, res);
    if (!userId) return;
    res.json(dao.findEnrollmentsForUser(userId));
  };
  const enrollUserInCourse = (req, res) => {
    const userId = resolveUserId(req, res);
    if (!userId) return;
    const { cid } = req.params;
    const enrolled = dao
      .findEnrollmentsForUser(userId)
      .some((enrollment) => enrollment.course === cid);
    if (!enrolled) {
      dao.enrollUserInCourse(userId, cid);
    }
    res.json(dao.findEnrollmentsForUser(userId));
  };
  const unenrollUserFromCourse = (req, res) => {
    const userId = resolveUserId(req, res);
    if (!userId) return;
    dao.unenrollUserFromCourse(userId, req.params.cid);
    res.json(dao.findEnrollmentsForUser(userId));
  };
  app.get("/api/users/:uid/enrollments", findEnrollmentsForUser);
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
}
