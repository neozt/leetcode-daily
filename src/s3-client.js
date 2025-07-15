import AWS from "aws-sdk";

import * as S3_CONSTANT from "./s3-constant.js";

const s3 = new AWS.S3();

export async function uploadPotdData(potdData) {
  const putObjectRequest = {
    Bucket: S3_CONSTANT.BUCKET_NAME,
    Key: S3_CONSTANT.POTD_FILE_NAME,
    Body: JSON.stringify(potdData),
  };

  try {
    console.log(`Uploading to S3: ${JSON.stringify(putObjectRequest)}`);
    const result = await s3.putObject(putObjectRequest).promise();
    console.log(`Successfully uploaded to S3: ETag=${result.ETag}`);
  } catch (e) {
    console.error(
      `Failed to upload POTD data into S3. data = ${JSON.stringify(potdData)}`,
      e,
    );

    throw new Error("Unable to upload POTD data");
  }
}
