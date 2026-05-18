/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InlineSpinner } from "@/components/LoadingSpinner";

describe("InlineSpinner", () => {
  it("message prop이 없으면 텍스트를 렌더링하지 않는다.", () => {
    render(<InlineSpinner />);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("message prop을 전달하면 해당 텍스트를 표시한다.", () => {
    render(<InlineSpinner message="검색 중..." />);
    expect(screen.getByText("검색 중...")).toBeInTheDocument();
  });

  it("size 기본값(md)이면 w-10 h-10 border-4 클래스를 적용한다.", () => {
    const { container } = render(<InlineSpinner />);
    const spinner = container.querySelector(".w-10.h-10.border-4");
    expect(spinner).toBeInTheDocument();
  });

  it("size='sm'이면 w-6 h-6 border-2 클래스를 적용한다.", () => {
    const { container } = render(<InlineSpinner size="sm" />);
    const spinner = container.querySelector(".w-6.h-6.border-2");
    expect(spinner).toBeInTheDocument();
  });

  it("size='md'를 명시적으로 전달해도 md 클래스를 적용한다.", () => {
    const { container } = render(<InlineSpinner size="md" />);
    const spinner = container.querySelector(".w-10.h-10.border-4");
    expect(spinner).toBeInTheDocument();
  });

  it("스피너 회전 요소(animate-spin)가 렌더링된다.", () => {
    const { container } = render(<InlineSpinner />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });
});
