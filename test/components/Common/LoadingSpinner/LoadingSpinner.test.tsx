/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingSpinner } from "@/components/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("message prop 없으면 기본 메시지 '잠시만 기다려주세요.'를 표시한다.", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText("잠시만 기다려주세요.")).toBeInTheDocument();
  });

  it("message prop을 전달하면 해당 메시지를 표시한다.", () => {
    render(<LoadingSpinner message="데이터를 불러오는 중..." />);
    expect(screen.getByText("데이터를 불러오는 중...")).toBeInTheDocument();
  });

  it("스피너 회전 요소가 렌더링된다.", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("고정 오버레이(fixed) 배경이 렌더링된다.", () => {
    const { container } = render(<LoadingSpinner />);
    const overlay = container.querySelector(".fixed");
    expect(overlay).toBeInTheDocument();
  });
});
