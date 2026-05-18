/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BackGroundModal } from "@/components/Modal";

afterEach(() => {
  cleanup();
});

describe("Modal BackGround", () => {
  it("children을 받아 자식 컴포넌트로 렌더링된다.", () => {
    render(
      <BackGroundModal>
        <p>내용입니다</p>
      </BackGroundModal>,
    );
    expect(screen.getByText("내용입니다")).toBeInTheDocument();
  });

  it("children이 없으면 내부 wrapper div만 존재한다.", () => {
    const { container } = render(<BackGroundModal />);
    const article = container.querySelector("article");
    expect(article).toBeInTheDocument();
    expect(article!.childElementCount).toBe(1);
  });

  it("전체화면 사이즈의 흐린 검정색 배경 클래스가 적용된다.", () => {
    const { container } = render(<BackGroundModal />);
    const article = container.querySelector("article");
    expect(article).toHaveClass("bg-black/80");
    expect(article).toHaveClass("min-w-screen");
    expect(article).toHaveClass("min-h-screen");
  });

  it("article 시맨틱 요소로 렌더링된다.", () => {
    render(<BackGroundModal />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });
});
