"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { getStorage } from "@/lib/storage";
import { revalidatePath } from "next/cache";

export async function listMedia() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });
  const storage = getStorage();
  return media.map((m) => ({
    id: m.id,
    url: storage.getUrl(m.key),
    filename: m.filename,
    mimeType: m.mimeType,
    caption: m.caption,
    createdAt: m.createdAt,
  }));
}

export async function deleteMedia(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) return;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return;

  const storage = getStorage();
  await storage.delete(media.key);
  await prisma.media.delete({ where: { id } });

  revalidatePath("/");
}
