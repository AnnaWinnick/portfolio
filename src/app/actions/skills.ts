"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function addSkill(formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const notes = formData.get("notes") as string;
  const photoUrl = formData.get("photoUrl") as string;
  const mediaId = formData.get("mediaId") as string;

  if (!name) return;

  const skillId = crypto.randomUUID();

  await prisma.skill.create({
    data: {
      id: skillId,
      name,
      notes: notes || null,
      lastUpdatedAt: new Date(),
      ...(photoUrl
        ? {
            SkillPhoto: {
              create: {
                id: crypto.randomUUID(),
                url: photoUrl,
                mediaId: mediaId || null,
              },
            },
          }
        : {}),
    },
  });
  revalidatePath("/");
}

export async function updateSkill(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const notes = formData.get("notes") as string;

  if (!id) return;

  await prisma.skill.update({
    where: { id },
    data: { notes, lastUpdatedAt: new Date() },
  });
  revalidatePath("/");
}

export async function deleteSkill(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
}
