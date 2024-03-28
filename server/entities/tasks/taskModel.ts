import mongoose, { Schema, model } from "mongoose";
import { FieldDataType } from "../taskFields/taskFieldModel";

export const taskSchema = new Schema({
  order: Number,
  fieldsData: {
    type: Map,
    of: Schema.Types.Mixed,
  },
  creationDate: Date,
});

export const TaskModel = model("Task", taskSchema);
