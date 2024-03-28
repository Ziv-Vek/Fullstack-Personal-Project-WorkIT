import express from "express";
import axios from "axios";
import { UserType } from "../models/userType";

/** Get the Global Config */
export const getGlobalConfig = (
  req: express.Request,
  res: express.Response
) => {
  try {
    res.status(200).json({ UserType });
  } catch (error) {
    res.status(500).render("interal-error");
  }
};
