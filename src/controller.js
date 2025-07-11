import {
  constructDailyQuestionUrl,
  fetchDailyQuestion,
} from "./leetcode-client.js";

const BASE_URL = process.env.BASE_URL;

export async function redirectToDailyQuestion(req, res) {
  const dailyQuestion = await fetchDailyQuestion();

  const { link, date } = dailyQuestion.data.activeDailyCodingChallengeQuestion;
  if (!link) {
    console.error(
      `Failed to retrieve daily question from Leetcode. link=${link}, response=${JSON.stringify(dailyQuestion)}`,
    );
    throw new Error("Failed to retrieve daily question from Leetcode");
  }

  const dailyQuestionUrl = constructDailyQuestionUrl(link, date);
  console.log("Redirecting to: ", dailyQuestionUrl);
  return res.redirect(303, dailyQuestionUrl);
}

export function displayInfo(req, res) {
  return res.status(200).json({
    message:
      "LeetCode does not provide any way to directly navigate to today's Daily Question, so I did it myself. Bookmark the provided URL to be redirected to each day's Daily Question.",
    url: `${BASE_URL}/`,
    github: "https://github.com/neozt/leetcode-daily",
  });
}

export function displayIpInfo(request, response) {
  return response.json({
    ip: request.ip,
    ips: request.ips,
  });
}
