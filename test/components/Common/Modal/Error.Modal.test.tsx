/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("lucide-react", () => ({
  MessageCircleWarningIcon: () => <span data-testid="warning-icon" />,
}));

vi.mock("@/components/Modal/BackGround.Modal", () => ({
  BackGroundModal: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="bg-modal">{children}</div>
  ),
}));

vi.mock("@/components/Buttons", () => ({
  CustomButton: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

import { ErrorModalContents } from "@/components/Modal/Error.Modal";

afterEach(() => {
  cleanup();
});

describe("ErrorModalContents", () => {
  it("title과 errorMessage가 렌더링된다.", () => {
    render(
      <ErrorModalContents
        onClose={vi.fn()}
        title="오류 발생"
        errorMessage="무언가 잘못되었습니다."
      />,
    );
    expect(screen.getByText("오류 발생")).toBeInTheDocument();
    expect(screen.getByText("무언가 잘못되었습니다.")).toBeInTheDocument();
  });

  it("경고 아이콘이 렌더링된다.", () => {
    render(
      <ErrorModalContents onClose={vi.fn()} title="에러" errorMessage="에러" />,
    );
    expect(screen.getByTestId("warning-icon")).toBeInTheDocument();
  });

  it("확인 버튼이 렌더링된다.", () => {
    render(
      <ErrorModalContents onClose={vi.fn()} title="에러" errorMessage="에러" />,
    );
    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
  });

  it("확인 버튼 클릭 시 onClose가 호출된다.", () => {
    const onClose = vi.fn();
    render(
      <ErrorModalContents
        onClose={onClose}
        title="에러"
        errorMessage="에러 메시지"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "확인" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("errorMessage에 ReactNode를 전달하면 렌더링된다.", () => {
    render(
      <ErrorModalContents
        onClose={vi.fn()}
        title="에러"
        errorMessage={<span data-testid="custom-message">커스텀 메시지</span>}
      />,
    );
    expect(screen.getByTestId("custom-message")).toBeInTheDocument();
  });

  it("title 기본값은 빈 문자열이다.", () => {
    const { container } = render(
      <ErrorModalContents onClose={vi.fn()} errorMessage="메시지" />,
    );
    expect(container).toBeInTheDocument();
  });
});
