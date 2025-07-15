import AWS from "aws-sdk";
import {
  constructDailyQuestionUrl,
  fetchDailyQuestion,
} from "./leetcode-client.js";
import * as S3_CONSTANT from "./s3-constant.js";

const s3 = new AWS.S3();

export const handler = async () => {
  console.log("import-job running");

  const potdData = await getPotdData();

  const putObjectRequest = {
    Bucket: S3_CONSTANT.BUCKET_NAME,
    Key: S3_CONSTANT.POTD_FILE_NAME,
    Body: JSON.stringify(potdData),
  };

  try {
    const result = await s3.putObject(putObjectRequest).promise();
    console.log(`import-job success. ETag = ${result.ETag}`);
  } catch (e) {
    console.error(
      `Failed to upload POTD data into S3. data = ${JSON.stringify(potdData)}`,
      e,
    );
  }
};

async function getPotdData() {
  const dailyQuestion = await fetchDailyQuestion(true);

  const { link, date } = dailyQuestion.data.activeDailyCodingChallengeQuestion;

  if (!link) {
    console.error(
      `Failed to retrieve daily question from Leetcode. link=${link}, response=${JSON.stringify(dailyQuestion)}`,
    );
    throw new Error("Failed to retrieve daily question from Leetcode");
  }
  const dailyQuestionUrl = constructDailyQuestionUrl(link, date);

  return {
    link,
    date,
    url: dailyQuestionUrl,
  };
}
