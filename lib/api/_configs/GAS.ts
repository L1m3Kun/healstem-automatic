import { env } from "@/lib/env";

const fetchWithGAS = (
  query?: Record<string, string>,
  options?: RequestInit,
) => {
  let GAS_URL = env.api.AsApiUrl;
  if (query) {
    GAS_URL +=
      "?" +
      Object.entries(query).reduce((q, [k, v], i, arr) => {
        if (i === arr.length - 1) {
          return q + k + "=" + v;
        } else {
          return q + k + "=" + v + "&";
        }
      }, "");
  }
  return fetch(GAS_URL, options);
};

export { fetchWithGAS };
