/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ConfirmModalContents } from "@/components/Modal/Confirm.Modal";

afterEach(() => {
  cleanup();
});

const defaultProps = {
  name: "홍길동",
  companion: 2,
  onConfirm: vi.fn(),
  onClose: vi.fn(),
};

describe("ConfirmModalContents", () => {
  it("유저 이름이 렌더링된다.", () => {
    render(<ConfirmModalContents {...defaultProps} />);
    expect(screen.getByText("환영합니다, 홍길동님")).toBeInTheDocument();
  });

  it("인원 수가 렌더링된다.", () => {
    render(<ConfirmModalContents {...defaultProps} />);
    expect(screen.getByText("인원 수 : 2 명")).toBeInTheDocument();
  });

  it("확인 버튼이 렌더링된다.", () => {
    render(<ConfirmModalContents {...defaultProps} />);
    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
  });

  it("확인 버튼 클릭 시 onConfirm이 호출된다.", () => {
    const onConfirm = vi.fn();
    render(<ConfirmModalContents {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole("button", { name: "확인" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("배경(외부) 클릭 시 onClose가 호출된다.", () => {
    const onClose = vi.fn();
    const { container } = render(
      <ConfirmModalContents {...defaultProps} onClose={onClose} />,
    );
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop, { target: backdrop });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("내부 콘텐츠 클릭 시 onClose가 호출되지 않는다.", () => {
    const onClose = vi.fn();
    render(<ConfirmModalContents {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText("환영합니다, 홍길동님"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("다른 name과 companion props가 정상 렌더링된다.", () => {
    render(
      <ConfirmModalContents
        name="김영희"
        companion={3}
        onConfirm={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("환영합니다, 김영희님")).toBeInTheDocument();
    expect(screen.getByText("인원 수 : 3 명")).toBeInTheDocument();
  });
});
