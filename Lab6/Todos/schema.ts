import mongoose from "mongoose";
const todoSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    completed: { type: Boolean, default: false },
  },
  { collection: "todos" },
);
export default todoSchema;
