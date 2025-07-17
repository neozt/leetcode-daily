import { Potd, PotdEntity } from "../types/potd.models";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const DAILY_QUESTION_TABLE_NAME = process.env.DAILY_QUESTION_TABLE_NAME;

const dynamoDBClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

export async function storePotdData(potdData: Potd) {
  const tableName = DAILY_QUESTION_TABLE_NAME;

  const dbItem: PotdEntity = {
    type: "LINK",
    date: potdData.date,
    link: potdData.link,
    url: potdData.url,
  };

  const command = new PutCommand({
    TableName: DAILY_QUESTION_TABLE_NAME,
    Item: dbItem,
  });

  const response = await docClient.send(command);
  console.log(
    `Successfully saved into ${tableName}: ${JSON.stringify(dbItem)}`,
  );
  return response;
}

export async function retrievePotdData(): Promise<Potd | null> {
  const command = new QueryCommand({
    TableName: DAILY_QUESTION_TABLE_NAME,
    KeyConditionExpression: "#t = :typeVal",
    ExpressionAttributeNames: {
      "#t": "type",
    },
    ExpressionAttributeValues: {
      ":typeVal": "LINK",
    },
    ScanIndexForward: false, // sort descending to get latest date on top
    Limit: 1,
  });
  const result = await docClient.send(command);

  const latestQuestion = result.Items?.[0] as PotdEntity | undefined;
  if (!latestQuestion) {
    return null;
  }

  return {
    date: latestQuestion.date,
    link: latestQuestion.link,
    url: latestQuestion.url,
  };
}
