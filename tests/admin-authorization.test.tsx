import { beforeEach, describe, expect, it, vi } from "vitest";
import { isValidElement } from "react";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  requireAdmin: vi.fn(),
  findUnique: vi.fn(),
  upsert: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: mocks.auth,
}));
vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/prisma", () => ({
  default: { setting: { findUnique: mocks.findUnique, upsert: mocks.upsert } },
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => { throw new Error(`redirect:${url}`); },
}));

import SettingsAdmin from "@/app/admin/settings/page";

// Invoke the actual rendered Server Action separately from rendering the page.
function findAction(node: unknown): (data: FormData) => Promise<void> {
  if (isValidElement<{ action?: unknown; children?: unknown }>(node)) {
    if (typeof node.props.action === "function") {
      return node.props.action as (data: FormData) => Promise<void>;
    }
    const children = Array.isArray(node.props.children)
      ? node.props.children : [node.props.children];
    for (const child of children) {
      try { return findAction(child); } catch { /* Continue to the next child. */ }
    }
  }
  throw new Error("No form action found");
}

describe("settings authorization", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.findUnique.mockResolvedValue(null);
  });

  it.each([null, { message: "configuration error" }, { user: {} }, { user: { isAdmin: false } }])(
    "denies settings reads for an invalid/non-admin session: %j", async (session) => {
      mocks.auth.mockResolvedValue(session);
      await expect(SettingsAdmin()).rejects.toThrow("redirect:/admin/login");
      expect(mocks.findUnique).not.toHaveBeenCalled();
    },
  );

  it("rechecks authorization when an action is invoked after the session expires", async () => {
    mocks.auth.mockResolvedValue({ user: { isAdmin: true } });
    const action = findAction(await SettingsAdmin());
    mocks.requireAdmin.mockRejectedValue(new Error("Unauthorized"));
    const data = new FormData();
    data.set("reminder_days", "30");
    await expect(action(data)).rejects.toThrow("Unauthorized");
    expect(mocks.upsert).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("allows an authorized administrator to update settings", async () => {
    mocks.auth.mockResolvedValue({ user: { isAdmin: true } });
    const action = findAction(await SettingsAdmin());
    const data = new FormData();
    data.set("reminder_days", "30");
    await action(data);
    expect(mocks.requireAdmin).toHaveBeenCalledOnce();
    expect(mocks.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { key: "reminder_days" },
      update: expect.objectContaining({ value: "30" }),
    }));
  });
});
