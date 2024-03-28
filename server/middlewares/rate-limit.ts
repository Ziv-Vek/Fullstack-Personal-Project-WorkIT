import rateLimit from "express-rate-limit";
import { MiddleWareType } from "./types";

const rateLimits: { [key: string]: number } = {
  "1000": 120,
  "2000": 240,
  "5000": 400,
  "10000": 800,
  "30000": 2000,
  "60000": 4000,
  "300000": 8000,
};

const rateLimitOptions = Object.keys(rateLimits).map((interval) => ({
  windowMs: parseInt(interval, 10),
  max: rateLimits[interval],
}));

export const rateLimitMiddleware: MiddleWareType = rateLimit({
  keyGenerator: (req) => req.ip as string,
  ...rateLimitOptions,
});
