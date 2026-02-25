"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function addHobbyImage(formData: FormData) {
  await requireAdmin();
  const url = formData.get("url") as string;
  const caption = formData.get("caption") as string;

  if (!url) return;

  const maxOrder = await prisma.hobbyImage.aggregate({
    _max: { order: true },
  });
  const order = (maxOrder._max.order ?? -1) + 1;

  await prisma.hobbyImage.create({
    data: { id: crypto.randomUUID(), url, caption: caption || null, order },
  });
  revalidatePath("/");
}

export async function deleteHobbyImage(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.hobbyImage.delete({ where: { id } });
  revalidatePath("/");
}

export async function moveHobbyImage(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const direction = formData.get("direction") as "up" | "down";
  if (!id || !direction) return;

  const current = await prisma.hobbyImage.findUnique({ where: { id } });
  if (!current) return;

  const newOrder = direction === "up" ? current.order - 1 : current.order + 1;
  const swap = await prisma.hobbyImage.findFirst({
    where: { order: newOrder },
  });

  if (swap) {
    await prisma.hobbyImage.update({
      where: { id: swap.id },
      data: { order: current.order },
    });
  }
  await prisma.hobbyImage.update({
    where: { id },
    data: { order: newOrder },
  });

  revalidatePath("/");
}
