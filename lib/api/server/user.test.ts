import { describe, expect, it, vi } from "vitest";

vi.mock("./_configs/GAS", () => ({
  fetchWithGAS: vi.fn(),
}));

import { fetchWithGAS } from "./_configs/GAS";
import { getAllUsers } from "./user";

describe("getAllUsers", () => {
  it("action=getUsers 쿼리와 GET 메서드로 fetchWithGAS를 호출한다", () => {
    getAllUsers();

    expect(fetchWithGAS).toHaveBeenCalledWith(
      { action: "getUsers" },
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
  });

  it("fetchWithGAS의 반환값을 그대로 반환한다", () => {
    const mockResponse = Promise.resolve(new Response());
    vi.mocked(fetchWithGAS).mockReturnValue(mockResponse);

    const result = getAllUsers();
    expect(result).toBe(mockResponse);
  });
});