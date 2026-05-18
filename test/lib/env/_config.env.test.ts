import { afterEach, describe, expect, it } from "vitest";

import { requireEnv } from "@/lib/env/_config.env";

describe("requireEnv", () => {
  afterEach(() => {
    delete process.env._TEST_KEY_;
  });

  it("환경변수가 설정되어 있으면 값을 반환한다", () => {
    process.env._TEST_KEY_ = "hello-value";
    expect(requireEnv("_TEST_KEY_")).toBe("hello-value");
  });

  it("환경변수가 없으면 에러를 던진다", () => {
    expect(() => requireEnv("_TEST_KEY_")).toThrow(
      "Eviroment Error: key - _TEST_KEY_",
    );
  });
});
