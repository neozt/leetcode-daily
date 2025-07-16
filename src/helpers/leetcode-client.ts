import { DAILY_QUESTION_QUERY } from "../constants/leetcode-queries.js";
import axios from "axios";
import { ActiveDailyCodingChallengeQuestionResponse } from "../types/leetcode.models";
import { Potd } from "../types/potd.models";

const LEETCODE_API_URL =
  process.env.LEETCODE_API_URL || "https://leetcode.com/graphql";
const LEETCODE_URL = process.env.LEETCODE_URL || "https://leetcode.com";

export async function getPotdData(): Promise<Potd> {
  const dailyQuestion = await fetchDailyQuestion();

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

export async function fetchDailyQuestion() {
  return queryLeetCodeApi<ActiveDailyCodingChallengeQuestionResponse>(
    DAILY_QUESTION_QUERY,
    {},
  );
}

export function constructDailyQuestionUrl(link: string, date: string): string {
  // eg https://leetcode.com/problems/meeting-rooms-iii/?envType=daily-question&envId=2025-07-11
  return `${LEETCODE_URL}${link}?envType=daily-question&envId=${date}`;
}

async function queryLeetCodeApi<R>(
  query: string,
  variables: object,
): Promise<R> {
  let response;
  try {
    response = await axios.post(LEETCODE_API_URL, { query, variables });
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Error from LeetCode API: ${JSON.stringify(error.response.data)}`,
      );
    } else if (error.request) {
      throw new Error("No response received from LeetCode API");
    } else {
      throw new Error(`Error in setting up the request: ${error.message}`);
    }
  }

  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }
  return response.data;
}
