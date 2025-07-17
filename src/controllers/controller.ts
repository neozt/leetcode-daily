import { RequestHandler } from "express";
import { retrievePotd } from "../helpers/retrieve-potd";

const BASE_URL = process.env.BASE_URL;
const GITHUB_URL = process.env.GITHUB_URL;

export const redirectToDailyQuestion: RequestHandler = async (req, res) => {
  const potdData = await retrievePotd();
  if (!potdData) {
    console.error("Failed to retrieve POTD data");
    return res.status(404).json({ error: "POTD not found" });
  }

  console.log("Redirecting to: ", potdData.url);
  return res.redirect(303, potdData.url);
};

export const displayInfo: RequestHandler = (req, res) => {
  return res.status(200).json({
    message:
      "LeetCode does not provide any way to directly navigate to today's Daily Question, so I did it myself. Bookmark the provided URL to be redirected to each day's Daily Question.",
    url: BASE_URL,
    github: GITHUB_URL,
  });
};

export const displayIpInfo: RequestHandler = (request, response) => {
  return response.json({
    ip: request.ip,
    ips: request.ips,
  });
};
