import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    api: {
      AsApiUrl: "https://script.google.com/test-base",
    },
  },
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { fetchWithGAS } from "@/lib/api/server/_configs/GAS";

describe("fetchWithGAS", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue(new Response());
  });

  it("쿼리 없이 base URL 그대로 fetch를 호출한다", () => {
    fetchWithGAS();
    expect(mockFetch).toHaveBeenCalledWith(
      "https://script.google.com/test-base",
      undefined,
    );
  });

  it("단일 쿼리 파라미터를 URL에 추가한다", () => {
    fetchWithGAS({ action: "getUsers" });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://script.google.com/test-base?action=getUsers",
      undefined,
    );
  });

  it("여러 쿼리 파라미터를 & 구분자로 URL에 추가한다", () => {
    fetchWithGAS({ action: "log", type: "entry" });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://script.google.com/test-base?action=log&type=entry",
      undefined,
    );
  });

  it("options를 fetch에 그대로 전달한다", () => {
    const options: RequestInit = {
      method: "POST",
      body: "payload",
      headers: { "Content-Type": "application/json" },
    };
    fetchWithGAS({ action: "log" }, options);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://script.google.com/test-base?action=log",
      options,
    );
  });
});
