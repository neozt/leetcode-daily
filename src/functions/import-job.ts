import { getPotdData } from "../helpers/leetcode-client.js";
import { Handler } from "aws-lambda";
import { storePotdData } from "../helpers/dynamodb-client";

export const handler: Handler = async () => {
  console.log("import-job running");

  const potdData = await getPotdData();

  await storePotdData(potdData);

  console.log("import-job complete");

  return "Success";
};
