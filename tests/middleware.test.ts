import { describe, expect, it, vi } from "vitest";

// Expose the callback so the tests exercise the authorization decision itself.
vi.mock("@/lib/auth", () => ({ auth: (handler: unknown) => handler }));
import middleware from "@/middleware";

const check = middleware as unknown as (req: {
  auth: unknown; nextUrl: URL; url: string;
}) => Response;

function request(path: string, auth: unknown) {
  const url = `https://annawinnick.com${path}`;
  return check({ auth, nextUrl: new URL(url), url });
}

describe("admin middleware", () => {
  it.each([null, { message: "configuration error" }, { user: {} }, { user: { isAdmin: false } }])(
    "fails closed for an invalid/non-admin session: %j", (auth) => {
      const response = request("/admin/settings", auth);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("https://annawinnick.com/admin/login");
    },
  );

  it("allows an admin session", () => {
    expect(request("/admin/settings", { user: { isAdmin: true } }).headers.get("x-middleware-next")).toBe("1");
  });

  it("keeps the login page accessible", () => {
    expect(request("/admin/login", null).headers.get("x-middleware-next")).toBe("1");
  });
});
