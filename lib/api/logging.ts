import { fetchWithGAS } from "./_configs/GAS";

export const logEntrances = (
  userId: string | number,
  checkInDate: Date,
  checkedPeopleCount: number,
) => {
  const query = { action: "log" };
  const params = {
    userId,
    checkInDate,
    checkedPeopleCount,
  };
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  return fetchWithGAS(query, {
    method: "POST",
    body: JSON.stringify(params),
    headers,
  });
};
