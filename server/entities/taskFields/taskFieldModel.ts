import mongoose, { Schema, model } from "mongoose";

enum TaskPriority {
  Low = "Low",
  Normal = "Normal",
  High = "High",
  Urgent = "Urgent",
}

enum TaskStatus {
  NotStarted = "Not Started",
  Open = "Open",
  Done = "Done",
  Cancelled = "Cancelled",
}

export enum FieldDataType {
  String = "String",
  Number = "Number",
  Date = "Date",
}

export const taskFieldSchema = new Schema({
  fieldType: { type: String, enum: Object.values(FieldDataType) },
  name: String,
  nextNode: { type: Schema.Types.ObjectId, ref: "TaskField" },
  isHead: Boolean,
});

export const TaskFieldModel = model("TaskField", taskFieldSchema);
