import { NextRequest, NextResponse } from "next/server";
import { sendNudgeEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import { isOverdue } from "@/lib/utils";

// Simple in-memory rate limiter (resets on server restart)
// For production, use Redis or similar
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_NUDGES_PER_WINDOW = 3;

function getRateLimitKey(ip: string): string {
  return `nudge:${ip}`;
}

function isRateLimited(ip: string): boolean {
  const key = getRateLimitKey(ip);
  const count = rateLimitMap.get(key) || 0;
  return count >= MAX_NUDGES_PER_WINDOW;
}

function incrementRateLimit(ip: string): void {
  const key = getRateLimitKey(ip);
  const count = rateLimitMap.get(key) || 0;
  rateLimitMap.set(key, count + 1);

  // Clean up after window expires
  setTimeout(() => {
    const current = rateLimitMap.get(key) || 0;
    if (current > 0) {
      rateLimitMap.set(key, current - 1);
    }
  }, RATE_LIMIT_WINDOW);
}

export async function POST(request: NextRequest) {
  // Get client IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Check rate limit
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

  // Verify skills are actually overdue
  const reminderSetting = await prisma.setting.findUnique({
    where: { key: "reminder_days" },
  });
  const reminderDays = reminderSetting ? parseInt(reminderSetting.value) : 14;

  const skills = await prisma.skill.findMany({
    select: { lastUpdatedAt: true },
  });
  const hasOverdueSkills = skills.some((s) => isOverdue(s.lastUpdatedAt, reminderDays));

  if (!hasOverdueSkills) {
    return NextResponse.json(
      { error: "No skills are overdue. Nudge not needed!" },
      { status: 400 }
    );
  }

  try {
    await sendNudgeEmail();
    incrementRateLimit(ip);

    return NextResponse.json({
      success: true,
      message: "Nudge sent! Thanks for the accountability.",
    });
  } catch (error) {
    console.error("Failed to send nudge:", error);
    return NextResponse.json(
      { error: "Failed to send nudge. Please try again." },
      { status: 500 }
    );
  }
}

// GET endpoint for checking API status (for documentation)
export async function GET() {
  const reminderSetting = await prisma.setting.findUnique({
    where: { key: "reminder_days" },
  });
  const reminderDays = reminderSetting ? parseInt(reminderSetting.value) : 14;

  const skills = await prisma.skill.findMany({
    select: { lastUpdatedAt: true, name: true },
  });
  const overdueSkills = skills.filter((s) => isOverdue(s.lastUpdatedAt, reminderDays));

  return NextResponse.json({
    endpoint: "/api/nudge",
    method: "POST",
    description: "Send a nudge email when skills are overdue",
    rateLimiting: `${MAX_NUDGES_PER_WINDOW} requests per hour`,
    status: {
      skillsOverdue: overdueSkills.length > 0,
      overdueCount: overdueSkills.length,
    },
    poweredBy: "Next.js API Routes → Resend",
  });
}
