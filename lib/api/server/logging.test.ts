import { describe, expect, it, vi } from "vitest";

vi.mock("./_configs/GAS", () => ({
  fetchWithGAS: vi.fn(),
}));

import { fetchWithGAS } from "./_configs/GAS";
import { logEntrances } from "./logging";

const userId = 42;
const checkInDate = new Date("2026-03-25T00:00:00.000Z");
const checkedPeopleCount = 3;

describe("logEntrances", () => {
  it("action=log 쿼리와 POST 메서드로 fetchWithGAS를 호출한다", () => {
    logEntrances(userId, checkInDate, checkedPeopleCount);

    expect(fetchWithGAS).toHaveBeenCalledWith(
      { action: "log" },
      {
        method: "POST",
        body: JSON.stringify({ userId, checkInDate, checkedPeopleCount }),
        headers: { "Content-Type": "text/plain" },
      },
    );
  });

  it("userId가 문자열이어도 올바르게 호출된다", () => {
    logEntrances("user-abc", checkInDate, 1);

    expect(fetchWithGAS).toHaveBeenCalledWith(
      { action: "log" },
      expect.objectContaining({
        body: JSON.stringify({
          userId: "user-abc",
          checkInDate,
          checkedPeopleCount: 1,
        }),
      }),
    );
  });

  it("fetchWithGAS의 반환값을 그대로 반환한다", () => {
    const mockResponse = Promise.resolve(new Response());
    vi.mocked(fetchWithGAS).mockReturnValue(mockResponse);

    const result = logEntrances(userId, checkInDate, checkedPeopleCount);
    expect(result).toBe(mockResponse);
  });
});
