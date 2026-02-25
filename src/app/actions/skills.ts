"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function addSkill(formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const notes = formData.get("notes") as string;

  if (!name) return;

  await prisma.skill.create({
    data: {
      id: crypto.randomUUID(),
      name,
      notes: notes || null,
      lastUpdatedAt: new Date(),
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
