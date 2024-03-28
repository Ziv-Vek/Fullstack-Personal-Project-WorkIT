import mongoose, { Schema, model } from "mongoose";
import { TaskModel, taskSchema } from "../tasks/taskModel";
import { FieldDataType, taskFieldSchema } from "../taskFields/taskFieldModel";

const ChildFolderDataSchema = new Schema({
  parentFolderId: { type: Schema.Types.ObjectId, ref: "FolderModel" },
  positionWithinParent: {
    type: Number,
    required: true,
  },
  name: String,
});

const folderSchema = new Schema({
  name: String,
  description: String,
  childrenFolders: [ChildFolderDataSchema],
  parentFolder: { type: Schema.Types.ObjectId, ref: "FolderModel" },
  workspace: { type: Schema.Types.ObjectId, ref: "WorkspaceModel" },
  tasks: [taskSchema],
  fields: {
    type: [taskFieldSchema],
    default: [
      {
        fieldType: FieldDataType.String,
        name: "Task",
        nextNode: null,
        isHead: false,
      },
    ],
    required: true,
  },
  creationTime: Date,
});

export const FolderModel = model("Folder", folderSchema);
