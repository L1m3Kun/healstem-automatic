import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { User } from "@/types";

vi.mock("@/lib/api", () => ({
  withApiSecurity: (handler: (req: NextRequest) => Promise<Response>) =>
    handler,
  getAllUsers: vi.fn(),
}));

import { getAllUsers } from "@/lib/api/server";
import { POST } from "./route";

const mockGetAllUsers = vi.mocked(getAllUsers);

/** 각 테스트에서 독립된 User 객체를 생성 (route 내부에서 phone 필드를 직접 변형하기 때문) */
const createMockUsers = (): User[] => [
  {
    id: 1,
    name: "홍길동",
    gender: "남",
    phone: "010-1234-5678",
    membership: "1개월권",
  },
  {
    id: 2,
    name: "김철수",
    gender: "남",
    phone: "010-9999-5678",
    membership: "3개월권",
  },
  {
    id: 3,
    name: "이영희",
    gender: "여",
    phone: "010-1234-9999",
    membership: "6개월권",
  },
];

function createRequest(body: object): NextRequest {
  return new NextRequest("http://localhost/api/v1/user", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

function mockGASResponse(state: number, message: string, data: unknown) {
  return { json: async () => ({ state, message, data }) } as Response;
}

describe("POST /api/v1/user", () => {
  beforeEach(() => {
    mockGetAllUsers.mockReset();
  });

  it("뒷 4자리가 일치하는 유저 목록을 반환한다", async () => {
    mockGetAllUsers.mockResolvedValue(
      mockGASResponse(200, "success", createMockUsers()),
    );

    const res = await POST(createRequest({ phone: "5678" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(2);
    expect(json.data[0].id).toBe(1);
    expect(json.data[1].id).toBe(2);
  });

  it("반환된 유저의 휴대폰 번호 중간 부분을 마스킹한다", async () => {
    mockGetAllUsers.mockResolvedValue(
      mockGASResponse(200, "success", createMockUsers()),
    );

    const res = await POST(createRequest({ phone: "5678" }));
    const json = await res.json();

    // 010-1234-5678 → 010-1***-5678
    expect(json.data[0].phone).toBe("010-1***-5678");
    // 010-9999-5678 → 010-9***-5678
    expect(json.data[1].phone).toBe("010-9***-5678");
  });

  it("일치하는 유저가 없을 때 빈 배열과 안내 메시지를 반환한다", async () => {
    mockGetAllUsers.mockResolvedValue(
      mockGASResponse(200, "success", createMockUsers()),
    );

    const res = await POST(createRequest({ phone: "0000" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(0);
    expect(json.message).toBe("유저를 찾을 수 없습니다.");
  });

  it("DB가 400을 반환하면 400으로 응답한다", async () => {
    mockGetAllUsers.mockResolvedValue(
      mockGASResponse(400, "DB Client Error", null),
    );

    const res = await POST(createRequest({ phone: "5678" }));
    expect(res.status).toBe(400);
  });

  it("DB가 500을 반환하면 500으로 응답한다", async () => {
    mockGetAllUsers.mockResolvedValue(
      mockGASResponse(500, "DB Server Error", null),
    );

    const res = await POST(createRequest({ phone: "5678" }));
    expect(res.status).toBe(500);
  });

  it("getAllUsers가 예외를 던지면 500으로 응답한다", async () => {
    mockGetAllUsers.mockRejectedValue(new Error("Network error"));

    const res = await POST(createRequest({ phone: "5678" }));
    expect(res.status).toBe(500);
  });
});
