import mongoose, { Schema, model } from "mongoose";
import { UserType } from "../../models/userType";

const workspaceSchema = new Schema({
  name: String,
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userType: { type: String, enum: Object.values(UserType), required: true },
    },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rootFolders: [
    {
      positionWithinParent: { type: Number },
      folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
      },
      name: { type: String },
    },
  ],
  creationTime: { type: Date, immutable: true },
});

export const WorkspaceModel = model("Workspace", workspaceSchema);
