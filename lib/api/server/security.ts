import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// ─── CORS ────────────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS: string[] = [
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
];

export function withCors(
  response: NextResponse,
  origin: string | null,
): NextResponse {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Vary", "Origin");
  return response;
}

/** OPTIONS preflight 요청 처리. null 반환 시 본 요청으로 진행 */
export function handlePreflight(request: NextRequest): NextResponse | null {
  if (request.method !== "OPTIONS") {
    return null;
  }

  const origin = request.headers.get("origin");
  const response = new NextResponse(null, { status: 204 });
  return withCors(response, origin);
}

// ─── Rate Limiting ────────────────────────────────────────────────────────────

type RateLimitEntry = { count: number; resetAt: number };

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_MAX = 60; // 최대 요청 수
const RATE_LIMIT_WINDOW = 60_000; // 윈도우 크기: 1분 (ms)

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ─── Body Size Guard ──────────────────────────────────────────────────────────

const MAX_BODY_BYTES = 10 * 1024; // 10KB

type ParseResult =
  | { data: unknown; error: null }
  | { data: null; error: string };

export async function parseBodySafe(
  request: NextRequest,
): Promise<ParseResult> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return { data: null, error: "요청 본문이 너무 큽니다. (최대 10KB)" };
  }

  try {
    const data = await request.json();
    return { data, error: null };
  } catch {
    return { data: null, error: "잘못된 JSON 형식입니다." };
  }
}

// ─── Security Headers ─────────────────────────────────────────────────────────

export function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  return response;
}

// ─── 통합 헬퍼 ───────────────────────────────────────────────────────────────

type ApiHandler = (request: NextRequest) => Promise<NextResponse>;

/**
 * CORS + Rate Limit + Security Headers 를 한 번에 적용하는 래퍼
 *
 * @example
 * export const GET = withApiSecurity(async (request) => {
 *   return NextResponse.json({ data: "ok" });
 * });
 */
export function withApiSecurity(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest): Promise<NextResponse> => {
    const origin = request.headers.get("origin");

    // Preflight
    const preflight = handlePreflight(request);
    if (preflight) {
      return preflight;
    }

    // Rate limit
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      const response = NextResponse.json(
        { message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
        { status: 429 },
      );
      return withSecurityHeaders(withCors(response, origin));
    }

    // 핸들러 실행
    const response = await handler(request);

    return withSecurityHeaders(withCors(response, origin));
  };
}
