import { type NextRequest, NextResponse } from "next/server";
import { logEntrances, withApiSecurity } from "@/lib/api";

// ─── POST /api/v1/log ───────────────────────────────────────────────────────

export const POST = withApiSecurity(async (request: NextRequest) => {
  try {
    const { userId, checkInDate, checkedPeopleCount } = await request.json();

    const dbResponse = await logEntrances(
      userId,
      new Date(checkInDate),
      checkedPeopleCount,
    );

    // console.log(`userId : ${userId}`);
    // console.log(`date: ${new Date(checkInDate)}`);
    // console.log(`count: ${checkedPeopleCount}`);

    const { data, message, state } = await dbResponse.json();

    switch (state) {
      case 201:
        return NextResponse.json({ data, message }, { status: state });
      case 400:
        return NextResponse.json({ data, message }, { status: state });
      case 500:
        return NextResponse.json({ data }, { status: state });
      default:
        throw new Error(`UnknownErrorState: status is not defined.`);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Next Server Error. Please Check." },
      { status: 500 },
    );
  }
});
