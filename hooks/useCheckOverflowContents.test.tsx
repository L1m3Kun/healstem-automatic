/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useCheckOverflowContents } from "./useCheckOverflowContents";

const originalScrollHeight = Object.getOwnPropertyDescriptor(
  HTMLDivElement.prototype,
  "scrollHeight",
);
const originalClientHeight = Object.getOwnPropertyDescriptor(
  HTMLDivElement.prototype,
  "clientHeight",
);

const setHeights = (scrollHeight: number, clientHeight: number) => {
  Object.defineProperty(HTMLDivElement.prototype, "scrollHeight", {
    configurable: true,
    get() {
      return scrollHeight;
    },
  });

  Object.defineProperty(HTMLDivElement.prototype, "clientHeight", {
    configurable: true,
    get() {
      return clientHeight;
    },
  });
};

const restoreHeightDescriptor = (
  key: "scrollHeight" | "clientHeight",
  original: PropertyDescriptor | undefined,
) => {
  if (original) {
    Object.defineProperty(HTMLDivElement.prototype, key, original);
    return;
  }

  delete (HTMLDivElement.prototype as unknown as Record<string, unknown>)[key];
};

const OverflowProbe = () => {
  const { isOverflowing, ref } = useCheckOverflowContents();

  return <div ref={ref}>{isOverflowing ? "overflow" : "fit"}</div>;
};

afterEach(() => {
  restoreHeightDescriptor("scrollHeight", originalScrollHeight);
  restoreHeightDescriptor("clientHeight", originalClientHeight);
  cleanup();
});

describe("useCheckOverflowContents", () => {
  it("returns true when scrollHeight exceeds clientHeight", async () => {
    setHeights(200, 100);

    render(<OverflowProbe />);

    expect(await screen.findByText("overflow")).toBeInTheDocument();
  });

  it("returns false when content fits", async () => {
    setHeights(100, 200);

    render(<OverflowProbe />);

    expect(await screen.findByText("fit")).toBeInTheDocument();
  });
});
