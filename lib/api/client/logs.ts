import type { APIResponseContainer, User } from "@/types";

const ABORT_TIMEOUT_MS = 5000;

export const writeLog = async (
  userId: User["id"],
  checkedPeopleCount: number,
  retryCount = 1,
): Promise<APIResponseContainer<null>> => {
  const params = {
    userId,
    checkInDate: new Date(Date.now()),
    checkedPeopleCount,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ABORT_TIMEOUT_MS);

  try {
    const response = await fetch("/api/v1/log", {
      method: "POST",
      body: JSON.stringify(params),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (retryCount > 0) {
      return writeLog(userId, checkedPeopleCount, retryCount - 1);
    }
    console.error(error);
    return {
      data: null,
      message: "API Request Failed",
      status: 404,
    };
  }
};
