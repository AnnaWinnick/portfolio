import { Resend } from "resend";

// Lazy initialization - only create client when needed
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export async function sendNudgeEmail() {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    throw new Error("ADMIN_EMAIL not configured");
  }

  const client = getResendClient();
  const result = await client.emails.send({
    from: "Portfolio Nudge <onboarding@resend.dev>", // Use your verified domain in production
    to: adminEmail,
    subject: "Someone nudged you to update your skills!",
    html: `
      <h2>You've been nudged!</h2>
      <p>Someone noticed you're behind on your skill updates and sent you a friendly nudge.</p>
      <p>Time to make some progress and update your portfolio!</p>
      <p><a href="${process.env.NEXTAUTH_URL}/admin/skills">Update your skills</a></p>
      <hr>
      <p style="color: #666; font-size: 12px;">
        This email was sent from your portfolio site's nudge feature.
      </p>
    `,
  });

  return result;
}

export async function sendReminderEmail(overdueSkills: string[]) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    throw new Error("ADMIN_EMAIL not configured");
  }

  const skillsList = overdueSkills.map((s) => `<li>${s}</li>`).join("");

  const client = getResendClient();
  const result = await client.emails.send({
    from: "Portfolio Reminder <onboarding@resend.dev>",
    to: adminEmail,
    subject: "Skill update reminder",
    html: `
      <h2>Time for a skill update!</h2>
      <p>The following skills haven't been updated in a while:</p>
      <ul>${skillsList}</ul>
      <p>Take a few minutes to log your progress.</p>
      <p><a href="${process.env.NEXTAUTH_URL}/admin/skills">Update your skills</a></p>
      <hr>
      <p style="color: #666; font-size: 12px;">
        This is an automated reminder from your portfolio site.
      </p>
    `,
  });

  return result;
}
