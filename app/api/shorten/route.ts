import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setCache } from "@/lib/redis";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  isValidUrl,
  isValidAlias,
  generateShortCode,
} from "@/lib/utils/url";

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, customAlias, expiresAt } = body as {
      url: string;
      customAlias?: string;
      expiresAt?: string;
    };

    // 1. Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: "Please enter a valid URL including http:// or https://" },
        { status: 400 }
      );
    }

    // 2. Rate limit
    const ip = getIp(req);
    const { allowed, remaining, resetIn } = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Try again in ${Math.ceil(resetIn / 60)} minutes.`,
        },
        {
          status: 429,
          headers: { "X-RateLimit-Remaining": "0" },
        }
      );
    }

    // 3. Validate custom alias
    if (customAlias) {
      if (!isValidAlias(customAlias)) {
        return NextResponse.json(
          {
            error:
              "Alias may only contain letters, numbers, hyphens, and underscores (max 50 chars).",
          },
          { status: 400 }
        );
      }
      const existing = await prisma.url.findUnique({
        where: { shortCode: customAlias },
      });
      if (existing) {
        return NextResponse.json(
          { error: "That alias is already taken. Please choose another." },
          { status: 409 }
        );
      }
    }

    // 4. Validate expiration date
    let expiration: Date | undefined;
    if (expiresAt) {
      expiration = new Date(expiresAt);
      if (isNaN(expiration.getTime()) || expiration <= new Date()) {
        return NextResponse.json(
          { error: "Expiration date must be in the future." },
          { status: 400 }
        );
      }
    }

    // 5. Generate short code with collision retry
    let shortCode = customAlias ?? "";
    if (!shortCode) {
      let attempts = 0;
      while (attempts < 5) {
        const candidate = generateShortCode();
        const collision = await prisma.url.findUnique({
          where: { shortCode: candidate },
        });
        if (!collision) {
          shortCode = candidate;
          break;
        }
        attempts++;
      }
      if (!shortCode) {
        return NextResponse.json(
          { error: "Failed to generate a unique code. Please try again." },
          { status: 500 }
        );
      }
    }

    // 6. Write to DB
    const record = await prisma.url.create({
      data: {
        originalUrl: url,
        shortCode,
        customAlias: customAlias ?? null,
        expiresAt: expiration ?? null,
      },
    });

    // 7. Cache in Redis
    const ttlSeconds = expiration
      ? Math.floor((expiration.getTime() - Date.now()) / 1000)
      : undefined;
    await setCache(shortCode, url, ttlSeconds);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return NextResponse.json(
      {
        shortUrl: `${appUrl}/${shortCode}`,
        shortCode,
        expiresAt: record.expiresAt,
        remaining,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[shorten]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
