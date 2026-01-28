import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const visitorName = name.trim().slice(0, 100); // Limit length
    const timestamp = new Date().toISOString();
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Log to console (always)
    console.log(`[Visitor] ${timestamp} - ${visitorName} (${userAgent})`);

    // Send email notification if Resend is configured
    if (resend && process.env.ADMIN_EMAIL) {
      try {
        await resend.emails.send({
          from: "Portfolio <onboarding@resend.dev>",
          to: process.env.ADMIN_EMAIL,
          subject: `New visitor: ${visitorName}`,
          text: `Someone visited your portfolio!\n\nName: ${visitorName}\nTime: ${timestamp}\nUser Agent: ${userAgent}`,
        });
      } catch (emailError) {
        console.error("Failed to send visitor notification email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging visitor:", error);
    return NextResponse.json({ error: "Failed to log visitor" }, { status: 500 });
  }
}
