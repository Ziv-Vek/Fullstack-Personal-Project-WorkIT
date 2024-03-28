import express from "express";
import axios from "axios";
const router = express.Router();

import {
  createRootFolder,
  getFolder,
  addTask,
  addField,
  updateFieldName,
  updateCellValue,
  deleteTask,
  deleteField,
} from "./folderControl";

router
  .post("/add-root-folder", createRootFolder)
  .post("/get-folder", getFolder)
  .post("/add-task", addTask)
  .post("/add-field", addField)
  .patch("/update-field-name", updateFieldName)
  .patch("/update-cell-value", updateCellValue)
  .delete("/delete-task", deleteTask)
  .delete("/delete-field", deleteField);

export default router;
