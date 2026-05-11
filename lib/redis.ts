import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

export async function getCached(shortCode: string): Promise<string | null> {
  return redis.get<string>(`url:${shortCode}`);
}

export async function setCache(
  shortCode: string,
  originalUrl: string,
  ttlSeconds?: number
): Promise<void> {
  if (ttlSeconds && ttlSeconds > 0) {
    await redis.set(`url:${shortCode}`, originalUrl, { ex: ttlSeconds });
  } else {
    await redis.set(`url:${shortCode}`, originalUrl);
  }
}

export async function deleteCache(shortCode: string): Promise<void> {
  await redis.del(`url:${shortCode}`);
}
