import serverless from "serverless-http";
import express from "express";
import { getDailyQuestion, constructDailyQuestionLink } from "./leetcode-client.js";
import rateLimit from 'express-rate-limit'

const BASE_URL = process.env.BASE_URL;

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many request from this IP, try again in 1 hour',
});

app.use(limiter);

app.set('trust proxy', 1)

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "LeetCode does not provide any way to directly navigate to today's Daily Question, so I did it myself. Bookmark the provided URL to be redirected to each day's Daily Question.",
    url: `${BASE_URL}/daily`
  });
});

app.get("/daily", async (req, res) => {
  const dailyQuestion = await getDailyQuestion()

  const link = dailyQuestion.data.activeDailyCodingChallengeQuestion.link
  const date = dailyQuestion.data.activeDailyCodingChallengeQuestion.date
  if (!link) {
    console.error(`Failed to retrieve daily question from Leetcode. link=${link}, response=${JSON.stringify(dailyQuestion)}`);
    throw new Error("Failed to retrieve daily question from Leetcode");
  }

  const dailyQuestionUrl = constructDailyQuestionLink(link, date)
  console.log("Redirecting to: ", dailyQuestionUrl);
  return res.redirect(303, dailyQuestionUrl);
});

app.get('/ip', (request, response) => response.send(request.ip))

app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);