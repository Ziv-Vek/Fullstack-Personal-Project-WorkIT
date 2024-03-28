import { WorkspaceModel } from "../workspace/workspaceModel";
import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import { UserType } from "../../models/userType";
import { addWorkspaceToUser, setActiveWorkspace } from "../users/userControl";
import { UserModel } from "../users/userModel";

export const createFirstWorkspace = async (name: string, ownerId: string) => {
  try {
    if (!name || !ownerId) {
      throw new Error("Bad request: name or ownerId is missing");
      return { status: 400, message: "Bad request. Missing information." };
    }

    const dateNow = new Date();

    const resultSpace = await WorkspaceModel.create({
      name,
      members: {
        userId: ownerId,
        userType: UserType.Owner,
      },
      rootFolders: null,
      owner: ownerId,
      creationTime: dateNow,
    });

    await resultSpace.save();

    console.log(`First Workspace created successfully`);

    return {
      status: 201,
      message: `Workspace created successfully`,
      resultSpace,
    };
  } catch (error) {
    console.log("first workspace not created!");
    console.log(error);

    return { status: 500, message: `internal error` };
  }
};

export const createWorkspace = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("create workspace called");

  try {
    const { name, ownerId } = req.body;
    if (!name || !ownerId) {
      res.status(400).send("Bad request");
      return;
    }

    const dateNow = new Date();

    await WorkspaceModel.create({
      name,
      owner: ownerId,
      creationTime: dateNow,
    });

    console.log(`New ${name} Workspace created successfully`);
    res.status(201).send("Workspace created successfully");
  } catch (error) {
    res.status(500).render("internal-error");
  }
};

export const getWorkspaceRootFolders = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { workspaceId } = req.body;

    if (!workspaceId) {
      res.status(400).send("Bad request");
      return;
    }

    const folders = WorkspaceModel.findById(workspaceId)
      .populate("rootFolders")
      .exec();

    res.send({ folders });
  } catch (error) {
    res.status(500).send("Internal error");
  }
};

export const getWorkspaceById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    console.log("get workspace called");

    const { workspaceId } = req.body;

    if (!workspaceId) {
      res.status(400).send("Bad request");
      return;
    }

    const workspace = WorkspaceModel.findById(workspaceId);

    console.log(JSON.stringify(workspace));

    if (!workspace) {
      res.status(404).send("Data not found");
      return;
    }

    res.status(200).json(workspace);
  } catch (error) {
    res.status(500).render("internal-error");
  }
};

export const addWorkspace = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId, name } = req.body;

    if (!userId || !name) {
      res.status(400).send("Missing information to create workspace");
      return;
    }

    const workspace = await WorkspaceModel.create({
      name,
      members: [
        {
          userId,
          userType: UserType.Owner,
        },
      ],
      owner: userId,
      rootFolders: [],
      creationTime: new Date(),
    });

    req.body.workspaceId = workspace._id;
    req.body.name = name;
    req.body.isInternal = true;
    req.body.isActive = true;

    const updatedUser = await addWorkspaceToUser(req, res);

    res.status(201).json({ workspace });
  } catch (error) {
    //TODO: handle the error better. maybe try again later.
    res.status(500).send("internal error");
  }
};

/** Will add a root folder to the workspace model */
export const addFolderToWorkspace = async (
  workspaceId: string,
  folderId: string,
  folderName: string
): Promise<any> => {
  try {
    if (!workspaceId || !folderId || !folderName) {
      console.log("missing data in addFolderToWorkspace");
      return Promise.reject();
    }

    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
      console.log("no workspace found");
      return Promise.reject();
    }

    const newPos = workspace.rootFolders.length;

    workspace.rootFolders.push({
      positionWithinParent: newPos,
      folderId,
      name: folderName,
    });

    await workspace.save();

    return Promise.resolve();
  } catch (error) {
    console.log(error);
    return Promise.reject();
  }
};

/** Get the list of workspaces the user is related to.
 * @returns An array of objects with the following:
 * @returnedVariables workspaceId, workspaceName, isActive bool, the entire activeWorkspace
 */
export const getWorkspacesList = async (
  req: express.Request,
  res: express.Response
) => {
  console.log(req.headers);

  console.log(req.user);

  // console.log(const authorizationHeader = req.headers.authorization;);

  /* workspaces: user.workspaces,
          activeWorkspace:
            user.workspaces
              .find((space) => space.isActive == true)
              ?.workspaceId?.toString() ?? null, */
};

/** Gets the user's current active workspace
 * @param userId Target user's id
 * @return JSON of the currently active workspace. Null if no active workspace is found
 */
export const getActiveWorkspace = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if (!req.user.userId) {
      res.status(400).send("Bad request");
      return;
    }

    const user = await UserModel.findById(req.user.userId);

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    if (user.workspaces.length == 0) {
      res.status(200).send("User does not have a workspace");
      return;
    }

    let activeWorkspaceAtUser = user.workspaces.find(
      (workspace) => workspace.isActive
    );

    if (!activeWorkspaceAtUser) {
      console.log("No workspace is defined for the user");

      activeWorkspaceAtUser = user.workspaces[0];

      user.workspaces[0].isActive = true;

      await user.save().catch((err) => console.log(err));
    }

    const activeWorkspace = await WorkspaceModel.findById(
      activeWorkspaceAtUser.workspaceId
    );

    if (!activeWorkspace) {
      console.log("Workspace not found in DB");
      res.status(404).send("Workspace not found");
      return;
    }

    res.status(200).json(activeWorkspace);
  } catch {
    res.status(500).render("internal-error");
    return;
  }
};
