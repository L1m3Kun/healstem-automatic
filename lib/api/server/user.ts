import { fetchWithGAS } from "./_configs/GAS";

export const getAllUsers = () => {
  return fetchWithGAS(
    { action: "getUsers" },
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
