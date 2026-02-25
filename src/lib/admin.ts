import { auth } from "@/lib/auth";

export async function requireAdmin() {
  if (process.env.NODE_ENV === "development" && process.env.DEV_ADMIN_BYPASS === "true") {
    return;
  }
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error("Unauthorized");
}
