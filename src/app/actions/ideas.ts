"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error("Unauthorized");
}

export async function addIdea(formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title) return;

  await prisma.idea.create({
    data: {
      id: crypto.randomUUID(),
      title,
      description: description || null,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/");
}

export async function toggleArchiveIdea(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const currentlyArchived = formData.get("archived") === "true";

  if (!id) return;

  await prisma.idea.update({
    where: { id },
    data: { isArchived: !currentlyArchived },
  });
  revalidatePath("/");
}

export async function deleteIdea(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.idea.delete({ where: { id } });
  revalidatePath("/");
}
