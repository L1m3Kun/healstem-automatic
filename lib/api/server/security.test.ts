import { NextRequest, NextResponse } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  checkRateLimit,
  getClientIp,
  handlePreflight,
  parseBodySafe,
  withApiSecurity,
  withCors,
  withSecurityHeaders,
} from "./security";

// rateLimitStore는 모듈 레벨 상태이므로 각 테스트마다 고유 IP를 사용해 격리

// ─── withCors ────────────────────────────────────────────────────────────────
describe("withCors", () => {
  const makeResponse = () => NextResponse.json({});

  it("허용된 origin이면 Access-Control-Allow-Origin 헤더를 설정한다.", () => {
    const res = withCors(makeResponse(), "http://localhost:3000");
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
      "http://localhost:3000",
    );
  });

  it("허용되지 않은 origin이면 Access-Control-Allow-Origin을 설정하지 않는다.", () => {
    const res = withCors(makeResponse(), "https://evil.com");
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("origin이 null이면 Access-Control-Allow-Origin을 설정하지 않는다.", () => {
    const res = withCors(makeResponse(), null);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("origin 허용 여부와 무관하게 Allow-Methods 헤더를 항상 설정한다.", () => {
    const res = withCors(makeResponse(), null);
    expect(res.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET, POST, OPTIONS",
    );
  });

  it("origin 허용 여부와 무관하게 Vary: Origin 헤더를 항상 설정한다.", () => {
    const res = withCors(makeResponse(), null);
    expect(res.headers.get("Vary")).toBe("Origin");
  });
});

// ─── handlePreflight ─────────────────────────────────────────────────────────
describe("handlePreflight", () => {
  it("OPTIONS 요청이면 null이 아닌 NextResponse를 반환한다.", () => {
    const req = new NextRequest("http://localhost/api/test", {
      method: "OPTIONS",
    });
    expect(handlePreflight(req)).not.toBeNull();
  });

  it("OPTIONS 요청 응답의 status는 204이다.", () => {
    const req = new NextRequest("http://localhost/api/test", {
      method: "OPTIONS",
    });
    expect(handlePreflight(req)!.status).toBe(204);
  });

  it("GET 요청이면 null을 반환한다.", () => {
    const req = new NextRequest("http://localhost/api/test", {
      method: "GET",
    });
    expect(handlePreflight(req)).toBeNull();
  });

  it("POST 요청이면 null을 반환한다.", () => {
    const req = new NextRequest("http://localhost/api/test", {
      method: "POST",
    });
    expect(handlePreflight(req)).toBeNull();
  });
});

// ─── checkRateLimit ───────────────────────────────────────────────────────────
describe("checkRateLimit", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("새 IP의 첫 번째 요청은 true를 반환한다.", () => {
    expect(checkRateLimit("rl-new-ip")).toBe(true);
  });

  it("60번째 요청(한도 이내)은 true를 반환한다.", () => {
    const ip = "rl-within-limit";
    for (let i = 0; i < 59; i++) checkRateLimit(ip);
    expect(checkRateLimit(ip)).toBe(true);
  });

  it("61번째 요청(한도 초과)은 false를 반환한다.", () => {
    const ip = "rl-exceed-limit";
    for (let i = 0; i < 60; i++) checkRateLimit(ip);
    expect(checkRateLimit(ip)).toBe(false);
  });

  it("1분 윈도우 초과 시 카운트가 초기화되어 true를 반환한다.", () => {
    vi.useFakeTimers();
    const ip = "rl-window-reset";
    for (let i = 0; i < 60; i++) checkRateLimit(ip); // 한도 도달
    vi.advanceTimersByTime(60_001);
    expect(checkRateLimit(ip)).toBe(true);
  });
});

// ─── getClientIp ──────────────────────────────────────────────────────────────
describe("getClientIp", () => {
  const makeReq = (headers: Record<string, string>) =>
    new NextRequest("http://localhost/api/test", { headers });

  it("x-forwarded-for 헤더가 있으면 해당 IP를 반환한다.", () => {
    const req = makeReq({ "x-forwarded-for": "1.2.3.4" });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("x-forwarded-for에 여러 IP가 있으면 첫 번째 IP를 반환한다.", () => {
    const req = makeReq({ "x-forwarded-for": "1.2.3.4, 5.6.7.8, 9.10.11.12" });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("x-forwarded-for 없이 x-real-ip만 있으면 x-real-ip를 반환한다.", () => {
    const req = makeReq({ "x-real-ip": "10.0.0.1" });
    expect(getClientIp(req)).toBe("10.0.0.1");
  });

  it("IP 관련 헤더가 없으면 'unknown'을 반환한다.", () => {
    const req = makeReq({});
    expect(getClientIp(req)).toBe("unknown");
  });
});

// ─── parseBodySafe ────────────────────────────────────────────────────────────
describe("parseBodySafe", () => {
  it("content-length가 10KB를 초과하면 크기 에러를 반환한다.", async () => {
    const req = new NextRequest("http://localhost/api/test", {
      method: "POST",
      headers: { "content-length": String(10 * 1024 + 1) },
    });
    const result = await parseBodySafe(req);
    expect(result.data).toBeNull();
    expect(result.error).toBe("요청 본문이 너무 큽니다. (최대 10KB)");
  });

  it("유효한 JSON body라면 { data, error: null }을 반환한다.", async () => {
    const req = new NextRequest("http://localhost/api/test", {
      method: "POST",
      body: JSON.stringify({ phone: "1234" }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await parseBodySafe(req);
    expect(result.data).toEqual({ phone: "1234" });
    expect(result.error).toBeNull();
  });

  it("잘못된 JSON body라면 { data: null, error } 를 반환한다.", async () => {
    const req = new NextRequest("http://localhost/api/test", {
      method: "POST",
      body: "not-valid-json{{",
      headers: { "Content-Type": "application/json" },
    });
    const result = await parseBodySafe(req);
    expect(result.data).toBeNull();
    expect(result.error).toBe("잘못된 JSON 형식입니다.");
  });
});

// ─── withSecurityHeaders ──────────────────────────────────────────────────────
describe("withSecurityHeaders", () => {
  const res = withSecurityHeaders(NextResponse.json({}));

  it("X-Content-Type-Options: nosniff 헤더를 설정한다.", () => {
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("X-Frame-Options: DENY 헤더를 설정한다.", () => {
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
  });

  it("Referrer-Policy 헤더를 설정한다.", () => {
    expect(res.headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
  });

  it("Permissions-Policy 헤더를 설정한다.", () => {
    expect(res.headers.get("Permissions-Policy")).toBe(
      "camera=(), microphone=(), geolocation=()",
    );
  });
});

// ─── withApiSecurity ─────────────────────────────────────────────────────────
describe("withApiSecurity", () => {
  it("OPTIONS 요청이면 핸들러를 실행하지 않고 204 preflight 응답을 반환한다.", async () => {
    const handler = vi.fn().mockResolvedValue(NextResponse.json({}));
    const req = new NextRequest("http://localhost/api/test", {
      method: "OPTIONS",
      headers: { "x-forwarded-for": "10.0.1.1" },
    });
    const res = await withApiSecurity(handler)(req);
    expect(res.status).toBe(204);
    expect(handler).not.toHaveBeenCalled();
  });

  it("Rate limit 초과 시 핸들러를 실행하지 않고 429를 반환한다.", async () => {
    const ip = "sec-429-ip";
    for (let i = 0; i < 60; i++) checkRateLimit(ip); // 한도 소진
    const handler = vi.fn().mockResolvedValue(NextResponse.json({}));
    const req = new NextRequest("http://localhost/api/test", {
      method: "POST",
      headers: { "x-forwarded-for": ip },
    });
    const res = await withApiSecurity(handler)(req);
    expect(res.status).toBe(429);
    expect(handler).not.toHaveBeenCalled();
  });

  it("정상 요청이면 핸들러를 실행하고 보안 헤더를 포함한 응답을 반환한다.", async () => {
    const handler = vi.fn().mockResolvedValue(NextResponse.json({ ok: true }));
    const req = new NextRequest("http://localhost/api/test", {
      method: "POST",
      headers: { "x-forwarded-for": "10.0.2.1" },
    });
    const res = await withApiSecurity(handler)(req);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("정상 요청이면 CORS 헤더를 포함한 응답을 반환한다.", async () => {
    const handler = vi.fn().mockResolvedValue(NextResponse.json({}));
    const req = new NextRequest("http://localhost/api/test", {
      method: "POST",
      headers: {
        "x-forwarded-for": "10.0.3.1",
        origin: "http://localhost:3000",
      },
    });
    const res = await withApiSecurity(handler)(req);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
      "http://localhost:3000",
    );
  });
});
