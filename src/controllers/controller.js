import { retrievePotdData } from "../helpers/s3-client.js";

const BASE_URL = process.env.BASE_URL;

export async function redirectToDailyQuestion(req, res) {
  const potdData = await retrievePotdData();
  console.log("Redirecting to: ", potdData.url);
  return res.redirect(303, potdData.url);
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
