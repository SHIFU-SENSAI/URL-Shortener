import { redis } from "./redis";

const WINDOW_SECONDS = 60 * 60; // 1 hour
const MAX_REQUESTS = 20;

export async function checkRateLimit(ip: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetIn: number;
}> {
  const key = `ratelimit:${ip}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }

  const ttl = await redis.ttl(key);
  const remaining = Math.max(0, MAX_REQUESTS - count);

  return {
    allowed: count <= MAX_REQUESTS,
    remaining,
    resetIn: ttl,
  };
}
