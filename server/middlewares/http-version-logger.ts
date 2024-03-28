import express from "express";

export function httpVersionLogger(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log("Request http version: " + req.httpVersion);
  next();
}

//TODO: remove this file or use it....
