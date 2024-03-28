import express from "express";
import axios from "axios";
const router = express.Router();

import {
  createWorkspace,
  getWorkspaceById,
  addWorkspace,
  getWorkspacesList,
  getActiveWorkspace,
} from "./workspaceControl";

router
  .put("/create", createWorkspace)
  .post("/get-workspace", getWorkspaceById)
  .post("/add-workspace", addWorkspace)
  .get("/get-active-workspace", getActiveWorkspace);

export default router;
