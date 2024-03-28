import { Schema, model } from "mongoose";

const testSchema = new Schema({
  testString: { type: String },
});

export const TestModel = model("testModel", testSchema);
