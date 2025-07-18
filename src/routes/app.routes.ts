import { RequestHandler } from "express";
import { getPotd } from "../services/potd.service";

const BASE_URL = process.env.BASE_URL;
const GITHUB_URL = process.env.GITHUB_URL;

export const redirectToDailyQuestion: RequestHandler = async (req, res) => {
  const potd = await getPotd();
  if (!potd) {
    console.error("Failed to retrieve POTD data");
    return res.status(404).json({ error: "POTD not found" });
  }

  console.log("Redirecting to: ", potd.url);
  return res.redirect(303, potd.url);
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
