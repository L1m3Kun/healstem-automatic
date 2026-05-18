import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/server", () => ({
  withApiSecurity: (handler: (req: NextRequest) => Promise<Response>) =>
    handler,
}));

import { POST } from "./route";

function createRequest(): NextRequest {
  return new NextRequest("http://localhost/api/v1/user/check", {
    method: "POST",
    body: JSON.stringify({ userId: 1 }),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/v1/user/check", () => {
  it("200 상태와 빈 객체를 반환한다", async () => {
    const res = await POST(createRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({});
  });
});
