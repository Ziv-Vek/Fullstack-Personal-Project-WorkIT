import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const USERS_TOKENS = {} as any;

const authMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authorizationHeader = req.headers.authorization;
  const accessToken = authorizationHeader?.split(" ")?.[1];
  try {
    const userPayload = jwt.verify(
      accessToken || "",
      process.env.ACCESS_TOKEN_SECRET as string
    );
    if (
      userPayload &&
      USERS_TOKENS[(userPayload as JwtPayload).email]?.accessTokens?.includes(
        accessToken
      )
    ) {
      req.user = userPayload;
      next();
      return;
    }
    res.status(401).send("Unauthorized token");
    return;
  } catch (err) {
    // token verify error
    res.status(401).send("Unauthorized token");
  }
};

export const addUserTokens = (
  email: string,
  accessToken: string,
  refreshToken: string
) => {
  if (!USERS_TOKENS[email]) {
    USERS_TOKENS[email] = { accessTokens: [], refreshTokens: [] };
  }
  USERS_TOKENS[email].accessTokens.push(accessToken);
  USERS_TOKENS[email].refreshTokens.push(refreshToken);
};

export const removeUserTokens = (
  email: string,
  accessToken: string,
  refreshToken?: string
) => {
  const userTokens = USERS_TOKENS[email];
  if (userTokens) {
    if (accessToken && Array.isArray(userTokens?.accessTokens)) {
      userTokens.accessTokens = userTokens.accessTokens.filter(
        (userAccessToken: string) => userAccessToken != accessToken
      );
    }

    if (refreshToken && Array.isArray(userTokens?.refreshTokens)) {
      userTokens.refreshTokens = userTokens.refreshTokens.filter(
        (userRefreshToken: string) => userRefreshToken != refreshToken
      );
    }
  }
};

export default authMiddleware;
