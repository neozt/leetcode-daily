import { getPotdData } from "./leetcode-client.js";
import { storePotdData } from "./s3-client.js";

export const handler = async () => {
  console.log("import-job running");

  const potdData = await getPotdData();

  await storePotdData(potdData);

  console.log("import-job complete");
};
