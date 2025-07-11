import { DAILY_QUESTION_QUERY } from "./leetcode-queries.js";
import axios from "axios";
import NodeCache from "node-cache";

const LEETCODE_API_URL =
  process.env.LEETCODE_API_URL || "https://leetcode.com/graphql";
const LEETCODE_URL = process.env.LEETCODE_URL || "https://leetcode.com";

const DAILY_QUESTION_CACHE_KEY = "DAILY_QUESTION_CACHE_KEY";
const DAILY_QUESTION_CACHE_TTL_SECONDS = 5 * 60;

const cache = new NodeCache();

export async function fetchDailyQuestion() {
  const cachedResponse = cache.get(DAILY_QUESTION_CACHE_KEY);
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = queryLeetCodeApi(DAILY_QUESTION_QUERY, {});
  if (response) {
    cache.set(
      DAILY_QUESTION_CACHE_KEY,
      response,
      DAILY_QUESTION_CACHE_TTL_SECONDS,
    );
  }
  return response;
}

export function constructDailyQuestionUrl(link, date) {
  // eg https://leetcode.com/problems/meeting-rooms-iii/?envType=daily-question&envId=2025-07-11
  return `${LEETCODE_URL}${link}?envType=daily-question&envId=${date}`;
}

async function queryLeetCodeApi(query, variables) {
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
