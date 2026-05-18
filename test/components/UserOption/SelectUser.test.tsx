/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("lucide-react", () => ({
  ChevronLeftCircle: ({ className }: { className?: string }) => (
    <span data-testid="icon-decrease" className={className} />
  ),
  ChevronRightCircle: () => <span data-testid="icon-increase" />,
}));

vi.mock("@/app/_components/Form", () => ({
  Display: ({ lastPhone }: { lastPhone: string }) => (
    <div data-testid="display">{lastPhone}</div>
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

import { SelectUser } from "@/app/_components/UserSelection/SelectUser";

afterEach(() => {
  cleanup();
});

const defaultProps = {
  companion: 1,
  lastPhone: "5678",
  decreaseCompanion: vi.fn(),
  increaseCompanion: vi.fn(),
};

describe("SelectUser", () => {
  it("lastPhone이 Display에 전달된다.", () => {
    render(<SelectUser {...defaultProps} />);
    expect(screen.getByTestId("display")).toHaveTextContent("5678");
  });

  it("companion 값이 렌더링된다.", () => {
    render(<SelectUser {...defaultProps} companion={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("증가 버튼 클릭 시 increaseCompanion이 호출된다.", () => {
    const increaseCompanion = vi.fn();
    render(<SelectUser {...defaultProps} increaseCompanion={increaseCompanion} />);
    fireEvent.click(screen.getByTestId("icon-increase"));
    expect(increaseCompanion).toHaveBeenCalledTimes(1);
  });

  it("감소 버튼 클릭 시 decreaseCompanion이 호출된다.", () => {
    const decreaseCompanion = vi.fn();
    render(<SelectUser {...defaultProps} decreaseCompanion={decreaseCompanion} />);
    fireEvent.click(screen.getByTestId("icon-decrease"));
    expect(decreaseCompanion).toHaveBeenCalledTimes(1);
  });

  it("companion이 1일 때 감소 아이콘에 회색 클래스가 적용된다.", () => {
    render(<SelectUser {...defaultProps} companion={1} />);
    const icon = screen.getByTestId("icon-decrease");
    expect(icon).toHaveClass("text-gray-400");
  });

  it("companion이 2 이상이면 감소 아이콘에 회색 클래스가 없다.", () => {
    render(<SelectUser {...defaultProps} companion={2} />);
    const icon = screen.getByTestId("icon-decrease");
    expect(icon).not.toHaveClass("text-gray-400");
  });

  it("전화번호 뒷 자리와 인원 선택 헤더가 렌더링된다.", () => {
    render(<SelectUser {...defaultProps} />);
    expect(screen.getByText("전화번호 뒷 자리")).toBeInTheDocument();
    expect(screen.getByText("인원 선택")).toBeInTheDocument();
  });
});
