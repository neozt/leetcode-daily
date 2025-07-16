import serverless from "serverless-http";
import express from "express";
import rateLimit from "express-rate-limit";
import proxyaddr from "proxy-addr";
import {
  displayInfo,
  redirectToDailyQuestion,
} from "../controllers/controller.js";

const app = express();

app.set("trust proxy", 2); // For some reason req.ip still returns the proxy IP. See limiter.keyGenerator for workaround.

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many request, please try again later.",
  keyGenerator: (req) => {
    // Tried following https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues to solve proxy issue,
    // but can't get req.ip to return the true client IP after setting trust proxy to 2, even though req.ips shows [clientIp, proxyIp].
    // Workaround by directly using the underlying library to generate key for the rate limiter.
    const clientIp = proxyaddr(req, (address, i) => {
      return i < 2;
    });
    return clientIp;
  },
});
app.use(limiter);

app.get("/", redirectToDailyQuestion);
app.get("/about", displayInfo);
// app.get("/ip", displayIpInfo); // Used for debugging proxy

app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);
