import type { APIResponseContainer, User } from "@/types";

const ABORT_TIMEOUT_MS = 5000;
export const getUser = async (
  lastPhone: string,
  retryCount = 1,
): Promise<APIResponseContainer<User[]>> => {
  const params = {
    phone: Number(lastPhone),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ABORT_TIMEOUT_MS);

  try {
    const response = await fetch("/api/v1/user", {
      method: "POST",
      body: JSON.stringify(params),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const { data } = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (retryCount > 0) {
      return await getUser(lastPhone, retryCount - 1);
    }
    console.error(error);

    return {
      message: "API Request Failed",
      data: null,
      status: 404,
    };
  }
};
