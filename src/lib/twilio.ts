import twilio from "twilio";

export function verifyTwilioSignature(
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    console.error("TWILIO_AUTH_TOKEN not configured");
    return false;
  }
  return twilio.validateRequest(authToken, signature, url, params);
}
