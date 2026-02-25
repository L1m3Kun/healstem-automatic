import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
  it("joins plain class names", () => {
    expect(cn("px-2", "py-1", "text-sm")).toBe("px-2 py-1 text-sm");
  });

  it("handles conditional and falsy values", () => {
    expect(cn("base", false && "hidden", null, undefined, "active")).toBe(
      "base active",
    );
  });

  it("merges conflicting tailwind classes with the last one winning", () => {
    expect(cn("p-2", "p-4", "text-sm", "text-lg")).toBe("p-4 text-lg");
  });

  it("supports clsx object/array inputs", () => {
    expect(
      cn(["flex", "items-center"], {
        "font-bold": true,
        hidden: false,
      }),
    ).toBe("flex items-center font-bold");
  });
});
