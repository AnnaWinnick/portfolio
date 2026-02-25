"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function addTool(formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;

  if (!name || !category) return;

  await prisma.tool.create({
    data: { id: crypto.randomUUID(), name, category },
  });
  revalidatePath("/");
}

export async function deleteTool(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.tool.delete({ where: { id } });
  revalidatePath("/");
}
