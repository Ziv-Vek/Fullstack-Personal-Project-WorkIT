//#region Imports

// Setup and middlewares:
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import authMiddleware, {
  USERS_TOKENS,
  addUserTokens,
  removeUserTokens,
} from "./middlewares/auth-middleware";
import { userAgentParser } from "./middlewares/ua-parser";
import { rateLimitMiddleware } from "./middlewares/rate-limit";
import { httpVersionLogger } from "./middlewares/http-version-logger";
import bodyParser from "body-parser";
//import { signupUser } from "./entities/users/userControl";
import axios, { Axios } from "axios";
import * as dotenv from "dotenv";

// Models:
import { UserModel } from "./entities/users/userModel";

// Direct services and APIs:
import { createFirstWorkspace } from "./entities/workspace/workspaceControl";
import { createFirstFolder } from "./entities/folders/folderControl";
import { getGlobalConfig } from "./controllers/globalConfigController";
import { signupUser } from "./entities/users/userControl";

// Routes:
import userRouter from "./entities/users/userRoute";
import workspaceRouter from "./entities/workspace/workspaceRoute";
import folderRouter from "./entities/folders/folderRoute";
//#endregion Imports

//#region MongoDB config and connectivity
require("dotenv").config();
const app = express();
const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const expirationTime = `${
  Number(process.env.EXPIRATION_TIME_IN_MS) || 30000
}ms`;
//const expirationTimeInHours = Number(process.env.EXPIRATION_TIME_IN_HOURS) || 1;

//TODO: change expiration time in hours in .env back to 1

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB is connected!");
  })
  .catch((err) => console.error(err));
//#endregion

//#region Server setup:
app.use(httpVersionLogger);
app.use(userAgentParser);
//app.use(cors);

const corsOptions: cors.CorsOptions = {
  origin: "*",
};
const corsMiddleware = cors(corsOptions);
app.use(corsMiddleware);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("./views/assets"));
app.use("/images/", express.static("./assets/images"));

app.use(function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log("Got request in the server to endpoint: " + req.path);

  res.on("finish", function () {
    console.log("Response was sent successfully");
  });

  next();
});

//#endregion

//#region APIs and services
/* 
app.get("/", function (req, res) {
  const isMyFeatureEnabled = process.env.ENABLE_CONSOLE_LOG_FEATURE;
  if (isMyFeatureEnabled) {
    console.log("feature is enabled!");
  }
  res.send("Hello World!");
}); */

app.use("/api", authMiddleware);
app.use("/api/user", userRouter);
app.use("/api/workspace", workspaceRouter);
app.use("/api/folder", folderRouter);
//app.get("/global-config", authMiddleware, getGlobalConfig);
//#endregion

//#region User registration and login
app.put("/signup", async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, password } = req.body;

    //Request's validity body check
    if (!name || !email || !password) {
      res.status(400).send("Insufficient data from user to signup.");
      return;
    }

    const saltRounds = 10;

    console.log(name + email + password);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const device = req.headers["user-agent"];

    const now = new Date();

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      company: "",
      devices: [device],
      signupDate: now,
      lastLoginDate: [now],
    });

    res.status(201).send("Signed Up Successfully");
  } catch (err) {
    //TODO: add render('internal-error') page instead of the send...

    console.log("failed here");

    res.status(500).render("internal-error");
  }
});

/* async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, password } = req.body;
    const device = req.headers["user-agent"];
    const location = req.headers["location"];
    const now = new Date();

    //Request's validity body check
    if (!name || !email || !password) {
      res.status(400).send("Insufficient data from user to signup.");
      return;
    }

    //Create user in DB
    const user = await UserModel.create({
      name,
      email,
      password,
      company: null,
      devices: [device],
      locations: [location],
      signupDate: now,
      lastLoginDate: [now],
      workspaces: null,
      lastActiveWorkspace: null,
    });

    console.log(`New user was creater. User name: ${name}, id: ${user._id}`);

    const firstWorkspaceData = {
      name: "My First Workspace",
      ownerId: user._id,
    };

    const spaceCreationResponse = await createFirstWorkspace(
      "My First Workspace",
      user._id.toString()
    );

    if (spaceCreationResponse.status == 201) {
      console.log(`space details: ${spaceCreationResponse.resultSpace?._id}`);

      const spaceId = spaceCreationResponse.resultSpace?._id.toString();
      const spaceName = spaceCreationResponse.resultSpace?.name?.toString();

      console.log(typeof spaceId);

      await UserModel.findByIdAndUpdate(user._id, {
        lastActiveWorkspace: spaceId,
        $push: {
          workspaces: {
            workspaceId: spaceId,
            name: spaceName,
          },
        },
      }).exec();

      /* await UserModel.findByIdAndUpdate(
        user._id,
        {
          $push: {
            workspaces: {
              workspaceId: spaceId,
              name: spaceName,
            },
          },
          lastActiveWorkspace: spaceId,
        },
        { new: false }
      ).exec();
      
    }
    

    const folderCreationResponse =
      spaceCreationResponse.status == 201
         await createFirstFolder(
            "My First Folder",
            spaceCreationResponse.resultSpace!._id.toString()
          )
        : "";

    await UserModel.findByIdAndUpdate(user._id, {
      lastActiveWorkspace: spaceCreationResponse.resultSpace?._id,
    });

    // send("User signup successful").
    res.status(201).json({
      userId: user._id,
      workspaceData: spaceCreationResponse?.resultSpace,
      folderData: folderCreationResponse,
    });
  } catch (error) {
    //TODO: add render('internal-error') page instead of the send...
    res.status(500).send("Signup failed");
  }
});
 */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send("Bad Request - missing email or password");
      return;
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      const isValidPassword = await bcrypt.compare(
        password,
        user.password as string
      );

      if (isValidPassword) {
        const payload = {
          userId: user._id.toString(),
          name: user.name,
          email,
          devices: user.devices,
          iat: Math.floor(Date.now() / 1000),
        };

        const accessToken = jwt.sign(
          payload,
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: expirationTime }
        );
        const refreshToken = jwt.sign(
          payload,
          process.env.REFRESH_TOKEN_SECRET as string
        );
        addUserTokens(email, accessToken, refreshToken);
        res.json({ accessToken, refreshToken });
        return;
      } else {
        res.status(401).send("Bad email and password combination");
      }
    } else {
      res.status(401).send("Bad email and password combination");
    }
  } catch (err) {
    res.status(500).render("internal-error");
  }
});

app.post("/logout", authMiddleware, async (req, res) => {
  try {
    const userPayload = req.user;
    const { refreshToken } = req.body;
    const authorizationHeader = req.headers.authorization;
    const accessToken = authorizationHeader?.split(" ")[1] as string;
    removeUserTokens(userPayload.email, accessToken, refreshToken);
    res.send("OK");
  } catch (err) {
    res.status(500).render("internal-error");
  }
});

app.get("/token", async (req, res) => {
  try {
    const { oldAccessToken } = req.body;
    const authorizationHeader = req.headers.authorization;
    const refreshToken = authorizationHeader?.split(" ")[1];
    if (!refreshToken) {
      res.status(400).send("Bad Request - missing refresh token");
      return;
    }
    try {
      let userPayload = jwt.verify(
        refreshToken || "",
        process.env.REFRESH_TOKEN_SECRET || ""
      );
      if (
        userPayload &&
        USERS_TOKENS[
          (userPayload as JwtPayload).email
        ]?.refreshTokens?.includes(refreshToken)
      ) {
        (userPayload as JwtPayload).iat = Math.floor(Date.now() / 1000);
        const accessToken = jwt.sign(
          userPayload,
          process.env.ACCESS_TOKEN_SECRET || "",
          { expiresIn: expirationTime }
        );
        removeUserTokens((userPayload as JwtPayload).email, oldAccessToken);
        res.json({ accessToken });
        return;
      }
      res.status(410).send("gone refresh token");
      return;
    } catch (err) {
      res.status(401).send("unauthorized refresh token");
      return;
    }
  } catch (err) {
    console.log("failed at token");

    res.status(500).render("internal-error");
  }
});
//#endregion

app.use("*", (req, res) => {
  res.status(404).render("not-found");
});

app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
});
