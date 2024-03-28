import express from "express";
import axios from "axios";
import { FolderModel } from "./folderModel";
import bodyParser from "body-parser";
import { addFolderToWorkspace } from "../workspace/workspaceControl";
import { FieldDataType } from "../taskFields/taskFieldModel";
import { toCapitalize } from "../../utils/utils";
import { log } from "console";
import { TaskModel } from "../tasks/taskModel";
import { UserModel } from "../users/userModel";
import { WorkspaceModel } from "../workspace/workspaceModel";

export const createFirstFolder = async (name: string, workspace: string) => {
  try {
    if (!name || !workspace) {
      return { status: 400, message: "Bad request. Missing information." };
    }

    const dateNow = new Date();

    const resultFolder = await FolderModel.create({
      name,
      workspace: workspace,
      creationTime: dateNow,
    });

    console.log(`New ${name} Folder created successfully`);

    return {
      status: 201,
      message: `Folder created successfully`,
      resultFolder,
    };
  } catch (error) {
    return { status: 500, message: `internal error` };
  }
};

/** Add a root folder to the workspace. Root folder's position will be the last one in order
 * @param name The name of the root folder
 * @param workspaceId The id of the workspace
 * @returns JSON of the resulted root folder
 */
export const createRootFolder = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name, workspaceId } = req.body;
    if (!name || !workspaceId) {
      res.status(400).send("Bad request");
      return;
    }

    const folder = await FolderModel.create({
      name,
      workspace: workspaceId,
      creationTime: new Date(),
    });

    const spaceRes = await addFolderToWorkspace(
      workspaceId,
      folder._id.toString(),
      name
    );

    console.log(`New ${name} Folder created successfully`);
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).render("internal-error");
  }
};

/** Returns the folder by given folderId */
export const getFolder = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { folderId } = req.body;

    if (!folderId) {
      res.status(400).send("Bad request - missing information");
      return;
    }

    const folder = await FolderModel.findById(folderId);

    if (!folder) {
      res.status(404).send("Requested folder not found.");
      return;
    }

    res.status(200).json(folder);
  } catch (error) {
    res.status(500).send("internal error!");
    //TODO: handle this better...
  }
};

export const addField = async (req: express.Request, res: express.Response) => {
  console.log("reached here");

  try {
    const { folderId, fieldType } = req.body;
    let { name } = req.body;

    if (!folderId || !fieldType) {
      res.status(400).send("Bad request - missing information");
      return;
    }

    const targetType = Object.values(FieldDataType).find(
      (localType) => localType == fieldType
    );

    switch (fieldType) {
      case FieldDataType.String:
        name = "Text";
        break;
      case FieldDataType.Number:
        name = "Number";
        break;
      case FieldDataType.Date:
        name = "Date";
        break;

      default:
        name = "New Field";
        break;
    }

    if (targetType) {
      const folder = await FolderModel.findByIdAndUpdate(
        folderId,
        {
          $push: {
            fields: {
              fieldType: fieldType,
              name,
              nextNode: null,
              isHead: false,
            },
          },
        },
        { new: true }
      );

      res.status(201).json(folder?.fields);
      return;
    }

    /* Object.values(FieldDataType).forEach(async (localType) => {
      if (localType == fieldType) {
        const folder = await FolderModel.findByIdAndUpdate(folderId, {
          $push: {
            fields: {
              type: fieldType,
              name,
              nextNode: null,
              isHead: false,
            },
          },
        });

        res.status(201).send("field created successfuly");
        return;
      }
    }); */

    res.status(401).send("Requested field type not allowed");
  } catch (error) {
    res.status(500).send("internal-error");
  }
};

export const updateFieldName = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { folderId, fieldId, name } = req.body;

    if (!folderId || !fieldId || !name) {
      res.status(400).send("Bad request - missing information");
      return;
    }

    const folder = await FolderModel.findOneAndUpdate(
      {
        _id: folderId,
        "fields._id": fieldId,
      },
      {
        $set: {
          "fields.$.name": name,
        },
      },
      { new: true }
    );

    if (!folder) {
      res.status(404).send("no folder found");
    }

    res.status(200).json(folder?.fields);
  } catch (error) {
    res.status(500).send("internal-error");
  }
};

export const addTask = async (req: express.Request, res: express.Response) => {
  try {
    const { folderId } = req.body;

    if (!folderId) {
      res.status(400).send("Bad request - missing information");
      return;
    }

    let activeWorkspaceRef = await UserModel.findById(req.user.userId)
      .then((user) => user?.workspaces.find((workspace) => workspace.isActive))
      .catch((err) => console.log(err));

    if (!activeWorkspaceRef) {
      res.status(400).send("Active folder not found");
      return;
    }

    let activeWorkspace = await WorkspaceModel.findById(
      activeWorkspaceRef.workspaceId?.toString()
    );

    let isFolderValid = activeWorkspace?.rootFolders.find(
      (folder) => folder.folderId?.toString() == folderId
    )
      ? true
      : false;

    if (!isFolderValid) {
      res.status(403).send("Client not allowed to change folder");
    }

    const folder = await FolderModel.findById(folderId);

    if (!folder) {
      console.log("folder not found");

      res.status(404).send("No folder found");
      return;
    }

    for (let i = 0; i < folder.tasks.length; i++) {
      (folder.tasks[i].order as number) += 1;
    }

    const firstFieldId = folder.fields[0]._id?.toString();

    const now = new Date();

    const newTask = folder.tasks.create({
      order: 0,
      fieldsData: new Map([[firstFieldId, "New Task"]]),
      creationDate: now,
    });

    folder.tasks.push(newTask);

    await folder.save();

    res.status(201).json(folder.tasks);
  } catch (error) {
    res.status(500).send("internal-error");
  }
};

export const updateCellValue = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { value, taskId, fieldId, folderId } = req.body;

    if (!value || !taskId || !fieldId || !folderId) {
      res.status(400).send("Bad request - missing information");
      return;
    }

    const fieldPath = `tasks.$.fieldsData.${fieldId}`;

    const result = await FolderModel.findOneAndUpdate(
      { _id: folderId, "tasks._id": taskId },
      { $set: { [fieldPath]: value } },
      { new: true }
    );

    if (!result) {
      return res.status(404).send("No matching folder or folder data found");
      return;
    }

    res.status(200).json(result.tasks);
  } catch (error) {
    res.status(500).send("internal-error");
  }
};

export const deleteTask = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { bodyPayload } = req.body;
    const taskId = bodyPayload["taskId"];
    const folderId = bodyPayload["folderId"];

    if (!taskId || !folderId) {
      res.status(400).send("Bad request - missing information");
      return;
    }

    const folder = await FolderModel.findByIdAndUpdate(
      folderId,
      {
        $pull: { tasks: { _id: taskId } },
      },
      { new: true }
    );

    if (!folder) {
      return res.status(404).send("No matching folder or task data found");
      return;
    }

    res.status(200).json(folder.tasks);
  } catch (error) {
    res.status(500).send("internal-error");
  }
};

export const deleteField = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { bodyPayload } = req.body;
    const fieldId = bodyPayload["fieldId"];
    const folderId = bodyPayload["folderId"];

    if (!fieldId || !folderId) {
      res.status(400).send("Bad request - missing information");
      return;
    }

    const folder = await FolderModel.findByIdAndUpdate(
      folderId,
      {
        $pull: { fields: { _id: fieldId } },
      },
      { new: true }
    );

    if (!folder) {
      return res.status(404).send("No matching folder or task data found");
      return;
    }

    res.status(200).json(folder.fields);
  } catch (error) {
    res.status(500).send("internal-error");
  }
};
