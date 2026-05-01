import { requireEnv } from "./_config.env";

const api = {
  // @TODO : t3-oss/env-nextjs 도입 - 도입이유: 테스트 격리, 빌드 타임 검증, 타입 안정 보장
  /**
    import { createEnv } from "@t3-oss/env-nextjs";                                                                                                                                
    import { z } from "zod";
                                                                                                                                                                                  
    export const env = createEnv({                                                                                                                                               
      server: {
        AS_API_URL: z.string().url(),
      },                                                                                                                                                                           
      runtimeEnv: {
        AS_API_URL: process.env.AS_API_URL,                                                                                                                                        
      },                                                                                                                                                                         
    });
   */
  get AsApiUrl() {
    return requireEnv("AS_API_URL");
  },
};

export { api };
