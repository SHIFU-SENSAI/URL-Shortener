import { NextRequest, NextResponse, after } from "next/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCached, setCache } from "@/lib/redis";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  // Prevent routing reserved endpoints dynamically
  const RESERVED_WORDS = ["not-found", "expired", "stats", "api", "favicon.ico"];
  if (RESERVED_WORDS.includes(shortCode.toLowerCase())) {
    notFound();
  }

  let originalUrl: string | null = await getCached(shortCode);

  if (!originalUrl) {
    // 2. Fall back to DB
    const record = await prisma.url.findUnique({ where: { shortCode } });

    if (!record) {
      notFound();
    }

    // 3. Check expiration
    if (record.expiresAt && record.expiresAt < new Date()) {
      const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");
      return NextResponse.redirect(
        new URL(
          `/expired?code=${shortCode}`,
          appUrl
        )
      );
    }

    originalUrl = record.originalUrl;

    // Re-populate cache
    const ttlSeconds = record.expiresAt
      ? Math.floor((record.expiresAt.getTime() - Date.now()) / 1000)
      : undefined;
    
    // Only cache if there's no expiration or it has future TTL
    if (!record.expiresAt || (ttlSeconds !== undefined && ttlSeconds > 0)) {
      await setCache(shortCode, originalUrl, ttlSeconds);
    }
  }

  // 4. Increment click count + log event (non-blocking in serverless)
  after(() => {
    prisma.url
      .update({
        where: { shortCode },
        data: {
          clicks: { increment: 1 },
          clickEvents: { create: {} },
        },
      })
      .catch((err: unknown) => console.error("[redirect-click-error]", err));
  });

  // 5. Redirect
  redirect(originalUrl as string);
}
