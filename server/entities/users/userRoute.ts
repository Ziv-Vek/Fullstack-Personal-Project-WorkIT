import express from "express";
import axios from "axios";
const router = express.Router();
import {
  addWorkspaceToUser,
  getWorkspaceById,
  setActiveWorkspace,
} from "./userControl";

//router.put("/signup", signupUser);

router
  .post("/get-workspace-by-id", getWorkspaceById)
  .post("/add-workspace", addWorkspaceToUser);

export default router;
