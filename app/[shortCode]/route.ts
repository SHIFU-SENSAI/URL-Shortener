import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCached, setCache } from "@/lib/redis";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  let originalUrl: string | null = await getCached(shortCode);

  if (!originalUrl) {
    // 2. Fall back to DB
    const record = await prisma.url.findUnique({ where: { shortCode } });

    if (!record) {
      return NextResponse.redirect(
        new URL(`/not-found`, process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
      );
    }

    // 3. Check expiration
    if (record.expiresAt && record.expiresAt < new Date()) {
      return NextResponse.redirect(
        new URL(
          `/expired?code=${shortCode}`,
          process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
        )
      );
    }

    originalUrl = record.originalUrl;

    // Re-populate cache
    const ttlSeconds = record.expiresAt
      ? Math.floor((record.expiresAt.getTime() - Date.now()) / 1000)
      : undefined;
    await setCache(shortCode, originalUrl, ttlSeconds);
  }

  // 4. Increment click count + log event (non-blocking)
  prisma.url
    .update({
      where: { shortCode },
      data: {
        clicks: { increment: 1 },
        clickEvents: { create: {} },
      },
    })
    .catch((err: unknown) => console.error("[redirect-click]", err));

  // 5. Redirect
  redirect(originalUrl as string);
}
