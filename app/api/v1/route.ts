import { type NextRequest, NextResponse } from "next/server";
import { parseBodySafe, withApiSecurity } from "@/lib/api/security";

// ─── GET /api/v1 ────────────────────────────────────────────────────────

export const GET = withApiSecurity(async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "id 파라미터가 필요합니다." },
      { status: 400 },
    );
  }

  // TODO: 실제 데이터 조회 로직
  const data = { id, name: "예시 데이터" };

  return NextResponse.json({ data }, { status: 200 });
});

// ─── POST /api/v1 ───────────────────────────────────────────────────────

export const POST = withApiSecurity(async (request: NextRequest) => {
  const { data, error } = await parseBodySafe(request);

  if (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }

  // TODO: 실제 처리 로직
  const result = {
    ...(data as Record<string, unknown>),
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ data: result }, { status: 201 });
});
