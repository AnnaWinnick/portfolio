import { NextRequest, NextResponse } from "next/server";
import { sendReminderEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import { isOverdue } from "@/lib/utils";

export async function GET(request: NextRequest) {
  // Verify cron secret (optional security)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get reminder threshold
  const reminderSetting = await prisma.setting.findUnique({
    where: { key: "reminder_days" },
  });
  const reminderDays = reminderSetting ? parseInt(reminderSetting.value) : 14;

  // Get last reminder sent timestamp
  const lastReminderSetting = await prisma.setting.findUnique({
    where: { key: "last_reminder_sent" },
  });
  const lastReminderSent = lastReminderSetting
    ? new Date(lastReminderSetting.value)
    : new Date(0);

  // Don't send more than one reminder per day
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if (lastReminderSent > oneDayAgo) {
    return NextResponse.json({
      sent: false,
      reason: "Reminder already sent within the last 24 hours",
    });
  }

  // Find overdue skills
  const skills = await prisma.skill.findMany({
    select: { name: true, lastUpdatedAt: true },
  });

  const overdueSkills = skills.filter((s) =>
    isOverdue(s.lastUpdatedAt, reminderDays)
  );

  if (overdueSkills.length === 0) {
    return NextResponse.json({
      sent: false,
      reason: "No overdue skills",
    });
  }

  try {
    await sendReminderEmail(overdueSkills.map((s) => s.name));

    // Update last reminder timestamp
    await prisma.setting.upsert({
      where: { key: "last_reminder_sent" },
      update: { value: new Date().toISOString(), updatedAt: new Date() },
      create: { key: "last_reminder_sent", value: new Date().toISOString(), updatedAt: new Date() },
    });

    return NextResponse.json({
      sent: true,
      overdueSkills: overdueSkills.map((s) => s.name),
    });
  } catch (error) {
    console.error("Failed to send reminder:", error);
    return NextResponse.json(
      { error: "Failed to send reminder" },
      { status: 500 }
    );
  }
}
