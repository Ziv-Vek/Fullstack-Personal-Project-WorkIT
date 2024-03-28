import mongoose, { Schema, model } from "mongoose";
import { WorkspaceModel } from "../workspace/workspaceModel";

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  company: String,
  devices: [String],
  locations: [String],
  signupDate: Date,
  lastLoginDate: [Date],
  workspaces: [
    {
      workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
      name: String,
      isActive: Boolean,
    },
  ],
});

export const UserModel = model("User", userSchema);
