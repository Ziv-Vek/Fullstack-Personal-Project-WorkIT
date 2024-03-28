import express from "express";
import axios from "axios";
import { TestModel } from "../models/testModel";

const router = express.Router();

const createTestString = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("creating test");

  const { testString } = req.body;

  await TestModel.create({
    testString,
  });
};

router.post("/create", createTestString);

export default router;
