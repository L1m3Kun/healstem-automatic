/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useCheckOverflowContents } from "@/hooks";

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
  it("화면 사이즈가 스크롤 사이즈보다 작을 때 true를 반환한다.", async () => {
    setHeights(200, 100);

    render(<OverflowProbe />);

    expect(await screen.findByText("overflow")).toBeInTheDocument();
  });

  it("컨텐츠가 딱 맞으면 false를 리턴한다.", async () => {
    setHeights(100, 200);

    render(<OverflowProbe />);

    expect(await screen.findByText("fit")).toBeInTheDocument();
  });

  it("ref.current가 null이면 경고를 출력하고 isOverflowing은 false(초기값)를 유지한다.", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    // ref을 DOM에 연결하지 않으면 ref.current === null
    const NullRefProbe = () => {
      const { isOverflowing } = useCheckOverflowContents();
      return <div>{isOverflowing ? "overflow" : "fit"}</div>;
    };

    render(<NullRefProbe />);

    expect(warnSpy).toHaveBeenCalledWith(
      "content overflow ref's current is null",
    );
    expect(screen.getByText("fit")).toBeInTheDocument();

    warnSpy.mockRestore();
  });
});
