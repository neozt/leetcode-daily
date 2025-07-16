import { getPotdData } from "../helpers/leetcode-client.js";
import { storePotdData } from "../helpers/s3-client.js";
import { Handler } from "aws-lambda";

export const handler: Handler = async (event, context, callback) => {
  console.log("import-job running");

  const potdData = await getPotdData();

  await storePotdData(potdData);

  console.log("import-job complete");

  return "Success";
};
