import { NextRequest } from "next/server";
import { verifyTwilioSignature } from "@/lib/twilio";
import { getStorage, generateStorageKey } from "@/lib/storage";
import prisma from "@/lib/prisma";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function twiml(message?: string): Response {
  const body = message
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`
    : `<?xml version="1.0" encoding="UTF-8"?><Response/>`;
  return new Response(body, {
    headers: { "Content-Type": "text/xml" },
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    // Verify Twilio signature
    const signature = request.headers.get("X-Twilio-Signature") || "";
    const url = `${process.env.NEXTAUTH_URL}/api/twilio/webhook`;

    if (!verifyTwilioSignature(signature, url, params)) {
      return new Response("Forbidden", { status: 403 });
    }

    // Only allow admin phone number
    const adminPhone = process.env.ADMIN_PHONE;
    if (!adminPhone || params.From !== adminPhone) {
      return twiml();
    }

    // Check for media
    const numMedia = parseInt(params.NumMedia || "0", 10);
    if (numMedia === 0) {
      return twiml("Got it — but no image attached.");
    }

    const caption = params.Body?.trim() || undefined;
    const storage = getStorage();
    let added = 0;

    for (let i = 0; i < numMedia; i++) {
      const mediaUrl = params[`MediaUrl${i}`];
      const mediaType = params[`MediaContentType${i}`];

      if (!mediaUrl || !mediaType || !ALLOWED_TYPES.includes(mediaType)) {
        continue;
      }

      // Download image from Twilio
      const response = await fetch(mediaUrl);
      if (!response.ok) continue;

      const buffer = Buffer.from(await response.arrayBuffer());
      const ext = mediaType.split("/")[1] || "jpg";
      const filename = `twilio-${Date.now()}-${i}.${ext}`;
      const key = generateStorageKey(filename);

      await storage.upload(key, buffer, mediaType);

      await prisma.media.create({
        data: {
          id: crypto.randomUUID(),
          key,
          filename,
          mimeType: mediaType,
          size: buffer.length,
          caption: caption,
          source: "twilio",
        },
      });

      added++;
    }

    if (added === 0) {
      return twiml("No supported images found (use JPEG, PNG, WebP, or GIF).");
    }

    return twiml(`Added ${added} photo${added > 1 ? "s" : ""} to the library.`);
  } catch (error) {
    console.error("Twilio webhook error:", error);
    return twiml("Something went wrong processing your image.");
  }
}
