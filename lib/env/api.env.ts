import { requireEnv } from "./_config.env";

const api = {
  AsApiUrl: requireEnv("AS_API_URL"),
};

export { api };
