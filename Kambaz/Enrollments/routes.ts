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
  const findEnrollmentsForUser = async (req, res) => {
    const userId = resolveUserId(req, res);
    if (!userId) return;
    const enrollments = await dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  };
  const enrollUserInCourse = async (req, res) => {
    const userId = resolveUserId(req, res);
    if (!userId) return;
    const { cid } = req.params;
    const existing = await dao.findEnrollmentsForUser(userId);
    const enrolled = existing.some((enrollment) => enrollment.course === cid);
    if (!enrolled) {
      await dao.enrollUserInCourse(userId, cid);
    }
    const enrollments = await dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  };
  const unenrollUserFromCourse = async (req, res) => {
    const userId = resolveUserId(req, res);
    if (!userId) return;
    await dao.unenrollUserFromCourse(userId, req.params.cid);
    const enrollments = await dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  };
  app.get("/api/users/:uid/enrollments", findEnrollmentsForUser);
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
}
