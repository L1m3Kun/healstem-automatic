import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/server", () => ({
  withApiSecurity: (handler: (req: NextRequest) => Promise<Response>) =>
    handler,
  logEntrances: vi.fn(),
}));

import { logEntrances } from "@/lib/api/server";
import { POST } from "./route";

const mockLogEntrances = vi.mocked(logEntrances);

const validBody = {
  userId: 1,
  checkInDate: new Date("2026-03-25T00:00:00.000Z").toISOString(),
  checkedPeopleCount: 2,
};

function createRequest(body: object): NextRequest {
  return new NextRequest("http://localhost/api/v1/log", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

function mockGASResponse(state: number, message: string, data: unknown) {
  return { json: async () => ({ state, message, data }) } as Response;
}

describe("POST /api/v1/log", () => {
  beforeEach(() => {
    mockLogEntrances.mockReset();
  });

  it("체크인 성공 시 201을 반환한다", async () => {
    mockLogEntrances.mockResolvedValue(mockGASResponse(201, "logged", null));

    const res = await POST(createRequest(validBody));
    expect(res.status).toBe(201);
  });

  it("DB가 400을 반환하면 400으로 응답한다", async () => {
    mockLogEntrances.mockResolvedValue(
      mockGASResponse(400, "Bad Request", null),
    );

    const res = await POST(createRequest(validBody));
    expect(res.status).toBe(400);
  });

  it("DB가 500을 반환하면 500으로 응답한다", async () => {
    mockLogEntrances.mockResolvedValue(
      mockGASResponse(500, "Server Error", null),
    );

    const res = await POST(createRequest(validBody));
    expect(res.status).toBe(500);
  });

  it("정의되지 않은 state이면 500으로 응답한다", async () => {
    mockLogEntrances.mockResolvedValue(mockGASResponse(999, "Unknown", null));

    const res = await POST(createRequest(validBody));
    expect(res.status).toBe(500);
  });

  it("logEntrances에 올바른 파라미터를 전달한다", async () => {
    mockLogEntrances.mockResolvedValue(mockGASResponse(201, "logged", null));

    await POST(createRequest(validBody));

    expect(mockLogEntrances).toHaveBeenCalledWith(
      validBody.userId,
      new Date(validBody.checkInDate),
      validBody.checkedPeopleCount,
    );
  });

  it("logEntrances가 예외를 던지면 500으로 응답한다", async () => {
    mockLogEntrances.mockRejectedValue(new Error("Network error"));

    const res = await POST(createRequest(validBody));
    expect(res.status).toBe(500);
  });
});
