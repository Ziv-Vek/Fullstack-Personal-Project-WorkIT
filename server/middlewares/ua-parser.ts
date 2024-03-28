import express from "express";
import UAParser from "ua-parser-js";
import { MiddleWareType } from "./types";

export const userAgentParser: MiddleWareType = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let userAgent = req.headers["user-agent"];
  let parser = new UAParser(userAgent);
  let parserResults = parser?.getResult();
  console.log(parserResults.browser);
  console.log(parserResults.os);

  next();
};
