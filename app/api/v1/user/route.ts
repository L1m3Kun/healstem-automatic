import { type NextRequest, NextResponse } from "next/server";
import {
  CUSTOM_STATUS_CODE,
  DEFAULT_STATUS_CODE,
  getAllUsers,
  withApiSecurity,
} from "@/lib/api/server";
import type { User, UserInput } from "@/types";

// ─── POST /api/v1 ────────────────────────────────────────────────────────

export const POST = withApiSecurity(async (request: NextRequest) => {
  try {
    // post 요청 body 가져오기
    const { phone: inputedPhoneNum } = (await request.json()) as UserInput;

    // 데이터 가져와서 파싱
    const dbResponse = await getAllUsers();
    const { data, message, status } = await dbResponse.json();
    // 가져온 데이터에 대한 에러 처리
    if (status === 400) {
      console.error(message);
      return NextResponse.json(
        { data, message },
        { status: DEFAULT_STATUS_CODE.bad_request },
      );
    }
    if (status === 500) {
      console.error(message);
      return NextResponse.json(
        { data, message },
        { status: DEFAULT_STATUS_CODE.interval_server_error },
      );
    }
    if (!data) {
      console.error(message);
      // throw new Error("DB Data is null.");
      return NextResponse.json(
        {
          data: null,
          message: "DB data is null",
          status: CUSTOM_STATUS_CODE.db_not_connected,
        },
        { status: DEFAULT_STATUS_CODE.interval_server_error },
      );
    }
    // 유저 찾기 로직
    const users = data as User[];

    const userList = users.reduce<User[]>((candidateUsers, user) => {
      // 휴대폰 뒷 4자리
      const candidatePhone = user.phone.slice(user.phone.length - 4);

      if (candidatePhone === String(inputedPhoneNum)) {
        // 유저 폰 번호 가리기
        user.phone = ((fullPhoneNum) => {
          const secretPhoneNums: string[] = fullPhoneNum.split("-");
          secretPhoneNums.forEach((numStr, idx) => {
            let num = numStr;
            if (idx === 1) {
              num = numStr[0] + "*".repeat(numStr.length - 1);
            }
            secretPhoneNums[idx] = num;
            return;
          });
          return secretPhoneNums.join("-");
        })(user.phone);

        candidateUsers.push(user);
      }
      return candidateUsers;
    }, []);
    // 찾는 유저가 없을 때
    if (userList.length < 1) {
      return NextResponse.json(
        {
          data: userList,
          message: "유저를 찾을 수 없습니다.",
          status: CUSTOM_STATUS_CODE.user_not_fond,
        },
        { status: DEFAULT_STATUS_CODE.bad_request },
      );
    }
    // 결과 도출
    return NextResponse.json({ data: userList, message }, { status });
  } catch (error) {
    // Nextjs api 에러처리
    console.error(error);
    return NextResponse.json(
      { message: "Next Server Error. Please Check." },
      { status: 500 },
    );
  }
});
