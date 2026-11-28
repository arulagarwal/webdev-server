import model from "./model";
export default function EnrollmentsDao() {
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  }
  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments
      .map((enrollment) => enrollment.user)
      .filter((user) => user);
  }
  function findEnrollmentsForUser(userId) {
    return model.find({ user: userId });
  }
  function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }
  function enrollUserInCourse(userId, courseId) {
    return model.create({
      user: userId,
      course: courseId,
      _id: `${userId}-${courseId}`,
    });
  }
  function unenrollUserFromCourse(user, course) {
    return model.deleteOne({ user, course });
  }
  return {
    findCoursesForUser,
    findUsersForCourse,
    findEnrollmentsForUser,
    unenrollAllUsersFromCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
  };
}
