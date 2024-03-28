import express from "express";
import axios from "axios";
import { UserModel } from "./userModel";
import bcrypt from "bcrypt";
import { WorkspaceModel } from "../workspace/workspaceModel";

const saltRounds = 10;

export const signupUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name, email, password } = req.body;

    //Request's validity body check
    if (!name || !email || !password) {
      res.status(400).send("Insufficient data from user to signup.");
      return;
    }

    console.log(name + email + password);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const device = req.headers["user-agent"];

    const now = new Date();

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      signupDate: now,
      lastLoginDate: [now],
      workspaces: [],
      lastActiveWorkspace: "",
    });

    await user.save();

    /* const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      signupDate: now,
      lastLoginDate: [now],
      workspaces: [],
      lastActiveWorkspace: "",
    }); */

    res.status(201).send("Signed Up Successfully");
  } catch (err) {
    //TODO: add render('internal-error') page instead of the send...

    res.status(500).render("internal-error");
  }
};

export const setActiveWorkspace = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    console.log("setting active workspace");

    //const {userId} =
    const { workspaceId, userId } = req.body;

    if (!workspaceId || !userId) {
      res.status(400).send("Bad request");
      return;
    }

    await UserModel.findByIdAndUpdate(userId, {
      lastActiveWorkspace: workspaceId,
    });
    console.log(
      "workspace set as active successfully in user, for user id: ",
      userId,
      " and workspace id: ",
      workspaceId
    );

    res.status(200).send("Active workspace updated for user");
  } catch (error) {
    res.status(500).send("internal server error");
  }
};

/** Will add a workspace to the user's workspaces field */
export const addWorkspaceToUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { workspaceId, userId, name } = req.body;

    const isInternal: boolean = req.body.isInternal ?? false;
    let isActive: boolean = req.body.isActive;

    if (!workspaceId || !userId) {
      res.status(400).send("Missing information");
    }

    if (isActive) {
      const deactivationRes = await deactivateWorkspace(userId);

      //TODO: handle this...

      /* 
      
      try {
        await UserModel.findOneAndUpdate(
          {
            _id: userId,
            "workspaces.isActive": true,
          },
          {
            $set: {
              "workspaces.$.isActive": false,
            },
          }
        );
      } catch (error) {
        //failed to update current active space
        console.log(error);
        isActive = false;
      } */
    }

    try {
      await UserModel.findByIdAndUpdate(userId, {
        $push: {
          workspaces: {
            workspaceId,
            name,
            isActive,
          },
        },
      });

      if (isInternal) {
        console.log("workspace added succesfully to user");
        return;
      } else {
        res.status(200).send("workspace added succesfully to user");
      }
    } catch (error) {
      //failed to add space to user
      console.log(error);
      if (!isInternal) {
        res.status(404).send("User not found");
      }
    }
  } catch (error) {
    // failed at function level
    res.status(500).render("internal-error");
    //TODO: handle the error better...
  }
};

/** Gets the user's workspace by its Id, and set it to be the active one
 * @param workspaceId target workspace's id to return
 * @param userId target user's id
 * @returns JSON of the workspace's data
 */
export const getWorkspaceById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { workspaceId, userId } = req.body;

    if (!workspaceId || !userId) {
      res.status(400).send("Bad request");
      return;
    }

    const workspace = WorkspaceModel.findById(workspaceId);

    console.log(JSON.stringify(workspace));

    if (!workspace) {
      res.status(404).send("Data not found");
      return;
    }

    /* if (userId) {
      await setActiveWorkspace(req, res);
    } */

    res.status(200).json(workspace);
  } catch (error) {
    res.status(500).render("internal-error");
  }
};

/** Finds the active workspace within the user's workspaces, and deactives it.
 * @returns Promise for failed or successful deactivation
 */
async function deactivateWorkspace(userId: string): Promise<any> {
  try {
    if (!userId) {
      console.log('userId not provided for "deactivateWorkspace"');
      return Promise.reject();
    }

    const res = await UserModel.findOneAndUpdate(
      {
        _id: userId,
        "workspaces.isActive": true,
      },
      {
        $set: {
          "workspaces.$.isActive": false,
        },
      }
    );

    return Promise.resolve();
  } catch (error) {
    //failed to update current active space
    console.log(error);
    return Promise.reject();
  }
}
