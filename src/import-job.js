import { getPotdData } from "./leetcode-client.js";
import { uploadPotdData } from "./s3-client.js";

export const handler = async () => {
  console.log("import-job running");

  const potdData = await getPotdData();

  await uploadPotdData(potdData);

  console.log("import-job complete");
};
