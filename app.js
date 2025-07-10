import serverless from "serverless-http";
import express from "express";
import { getDailyQuestion, constructDailyQuestionLink } from "./leetcode-client.js";
import rateLimit from 'express-rate-limit'
import proxyaddr from 'proxy-addr'

const BASE_URL = process.env.BASE_URL;

const app = express();

app.set('trust proxy', 2); // For some reason req.ip still returns the proxy IP. See limiter.keyGenerator for workaround.

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many request, please try again later.',
  keyGenerator: (req) => {
    // Tried following https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues to solve proxy issue,
    // but can't get req.ip to return the true client IP after setting trust proxy to 2, even though req.ips shows [clientIp, proxyIp].
    // Workaround by directly using the underlying library to generate key for the rate limiter.
    const clientIp = proxyaddr(req, (address, i) => {
      return i < 2;
    });
    return clientIp;
  }
});

app.use(limiter);

app.get("/about", (req, res) => {
  return res.status(200).json({
    message: "LeetCode does not provide any way to directly navigate to today's Daily Question, so I did it myself. Bookmark the provided URL to be redirected to each day's Daily Question.",
    url: `${BASE_URL}/`,
    github: 'https://github.com/neozt/leetcode-daily',
  });
});

app.get("/", async (req, res) => {
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

// Used for debugging proxy
// app.get('/ip', (request, response) => {
//   return response.json({
//     ip: request.ip,
//     ips: request.ips,
//   })
// })

app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);