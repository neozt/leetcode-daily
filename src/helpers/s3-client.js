import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import NodeCache from "node-cache";

import * as S3_CONSTANT from "../constants/s3-constant.js";

const s3Client = new S3Client();

const POTD_CACHE_KEY = "POTD_CACHE_KEY";
const POTD_CACHE_TTL_SECONDS = 60;

const cache = new NodeCache();

export async function storePotdData(potdData) {
  const putObjectRequest = {
    Bucket: S3_CONSTANT.BUCKET_NAME,
    Key: S3_CONSTANT.POTD_FILE_NAME,
    Body: JSON.stringify(potdData),
  };

  try {
    console.log(`Uploading to S3: ${JSON.stringify(putObjectRequest)}`);
    const result = await s3Client.send(new PutObjectCommand(putObjectRequest));
    console.log(`Successfully uploaded to S3: ETag=${result.ETag}`);
  } catch (e) {
    console.error(
      `Failed to upload POTD data into S3. data = ${JSON.stringify(potdData)}`,
      e,
    );

    throw new Error("Unable to upload POTD data");
  }
}

export async function retrievePotdData() {
  const cachedResponse = cache.get(POTD_CACHE_KEY);
  if (cachedResponse) {
    return cachedResponse;
  }

  const result = await s3Client.send(
    new GetObjectCommand({
      Bucket: S3_CONSTANT.BUCKET_NAME,
      Key: S3_CONSTANT.POTD_FILE_NAME,
    }),
  );
  const potd = await JSON.parse(await result.Body.transformToString("utf-8"));

  if (potd) {
    cache.set(POTD_CACHE_KEY, potd, POTD_CACHE_TTL_SECONDS);
  }

  return potd;
}
