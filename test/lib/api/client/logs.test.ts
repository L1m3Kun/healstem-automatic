import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { writeLog } from "@/lib/api/client";

const RESPONSE_TIME_LIMIT_MS = 2000;
const ABORT_TIMEOUT_MS = 5000;
const API_ERROR_RESPONSE = {
  status: 404,
  message: "API Request Failed",
  data: null,
};

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

// ─── 정상 호출 ────────────────────────────────────────────────────────────────
describe("정상 호출", () => {
  it(
    "/api/v1/log 에 POST 요청을 전송한다.",
    async () => {
      vi.mocked(global.fetch).mockResolvedValue(
        new Response(
          JSON.stringify({ status: 200, message: "OK", data: null }),
        ),
      );
      await writeLog(1, 2);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/log",
        expect.objectContaining({ method: "POST" }),
      );
    },
    RESPONSE_TIME_LIMIT_MS,
  );

  it(
    "body에 userId와 checkedPeopleCount가 포함된다.",
    async () => {
      vi.mocked(global.fetch).mockResolvedValue(
        new Response(
          JSON.stringify({ status: 200, message: "OK", data: null }),
        ),
      );
      await writeLog(42, 3);
      const [, options] = vi.mocked(global.fetch).mock.calls[0];
      const body = JSON.parse(options!.body as string);
      expect(body.userId).toBe(42);
      expect(body.checkedPeopleCount).toBe(3);
    },
    RESPONSE_TIME_LIMIT_MS,
  );

  it(
    "body에 checkInDate가 포함된다.",
    async () => {
      vi.mocked(global.fetch).mockResolvedValue(
        new Response(
          JSON.stringify({ status: 200, message: "OK", data: null }),
        ),
      );
      await writeLog(1, 1);
      const [, options] = vi.mocked(global.fetch).mock.calls[0];
      const body = JSON.parse(options!.body as string);
      expect(body.checkInDate).toBeDefined();
    },
    RESPONSE_TIME_LIMIT_MS,
  );

  it(
    "응답 JSON을 파싱해 APIResponseContainer 형태로 반환한다.",
    async () => {
      const mockPayload = { status: 200, message: "OK", data: null };
      vi.mocked(global.fetch).mockResolvedValue(
        new Response(JSON.stringify(mockPayload)),
      );
      const result = await writeLog(1, 2);
      expect(result).toEqual(mockPayload);
    },
    RESPONSE_TIME_LIMIT_MS,
  );

  it(
    "API 응답이 2초 이내에 완료된다.",
    async () => {
      vi.mocked(global.fetch).mockResolvedValue(
        new Response(
          JSON.stringify({ status: 200, message: "OK", data: null }),
        ),
      );
      const start = Date.now();
      await writeLog(1, 2);
      expect(Date.now() - start).toBeLessThan(RESPONSE_TIME_LIMIT_MS);
    },
    RESPONSE_TIME_LIMIT_MS,
  );
});

// ─── 실패 시 재시도 ────────────────────────────────────────────────────────────
describe("실패 시 재시도", () => {
  it(
    "fetch 실패 시 1회 재시도한다.",
    async () => {
      vi.mocked(global.fetch)
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({ status: 200, message: "OK", data: null }),
          ),
        );
      await writeLog(1, 2);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    },
    RESPONSE_TIME_LIMIT_MS,
  );

  it(
    "재시도 후 성공하면 APIResponseContainer를 반환한다.",
    async () => {
      const mockPayload = { status: 200, message: "OK", data: null };
      vi.mocked(global.fetch)
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce(new Response(JSON.stringify(mockPayload)));
      const result = await writeLog(1, 2);
      expect(result).toEqual(mockPayload);
    },
    RESPONSE_TIME_LIMIT_MS,
  );

  it(
    "재시도 후에도 실패하면 status 404 APIResponseContainer를 반환한다.",
    async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error("Persistent error"));
      const result = await writeLog(1, 2);
      expect(result).toEqual(API_ERROR_RESPONSE);
      // 최초 1회 + 재시도 1회 = 총 2회
      expect(global.fetch).toHaveBeenCalledTimes(2);
    },
    RESPONSE_TIME_LIMIT_MS,
  );
});

// ─── 5초 초과 시 재시도 ───────────────────────────────────────────────────────
describe("5초 초과 시 재시도", () => {
  it("5초 초과 시 요청을 중단하고 재시도한다.", async () => {
    vi.useFakeTimers();

    vi.mocked(global.fetch)
      .mockImplementationOnce(
        (_url, options) =>
          new Promise<Response>((_resolve, reject) => {
            options!.signal!.addEventListener("abort", () => {
              reject(new DOMException("Aborted", "AbortError"));
            });
          }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ status: 200, message: "OK", data: null }),
        ),
      );

    const promise = writeLog(1, 2);
    vi.advanceTimersByTime(ABORT_TIMEOUT_MS + 1);
    await promise;

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("5초 초과 후 재시도에서도 실패하면 status 404 APIResponseContainer를 반환한다.", async () => {
    vi.useFakeTimers();

    const abortingFetch = (_url: unknown, options: RequestInit | undefined) =>
      new Promise<Response>((_resolve, reject) => {
        options!.signal!.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"));
        });
      });

    vi.mocked(global.fetch)
      .mockImplementationOnce(abortingFetch)
      .mockImplementationOnce(abortingFetch);

    const promise = writeLog(1, 2);
    await vi.advanceTimersByTimeAsync(ABORT_TIMEOUT_MS + 1);
    await vi.advanceTimersByTimeAsync(ABORT_TIMEOUT_MS + 1);

    const result = await promise;
    expect(result).toEqual(API_ERROR_RESPONSE);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
