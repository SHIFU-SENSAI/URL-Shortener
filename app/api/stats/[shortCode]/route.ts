import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  const record = await prisma.url.findUnique({ where: { shortCode } });

  if (!record) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  return NextResponse.json({
    shortCode: record.shortCode,
    originalUrl: record.originalUrl,
    clicks: record.clicks,
    createdAt: record.createdAt,
    expiresAt: record.expiresAt,
  });
}
