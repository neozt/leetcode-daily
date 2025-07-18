import { PotdDetails } from "../types/potd.models";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const DAILY_QUESTION_TABLE_NAME = process.env.DAILY_QUESTION_TABLE_NAME;

const dynamodbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamodbClient);

export async function storePotdData(potd: PotdDetails) {
  const tableName = DAILY_QUESTION_TABLE_NAME;

  const command = new PutCommand({
    TableName: DAILY_QUESTION_TABLE_NAME,
    Item: potd,
  });

  const response = await docClient.send(command);
  console.log(`Successfully saved into ${tableName}: ${JSON.stringify(potd)}`);
  return response;
}

export async function retrievePotdData(
  date: string,
): Promise<PotdDetails | undefined> {
  const command = new GetCommand({
    TableName: DAILY_QUESTION_TABLE_NAME,
    Key: {
      date: date,
    },
  });

  const result = await docClient.send(command);

  return result.Item as PotdDetails | undefined;
}
