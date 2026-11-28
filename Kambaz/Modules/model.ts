import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.model("ModuleModel", schema, "modules");
export default model;
