/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RefObject } from "react";

vi.mock("lucide-react", () => ({
  ChevronsDown: () => <div data-testid="chevrons-down-icon" />,
}));

vi.mock("@/hooks", () => ({
  useCheckOverflowContents: vi.fn(() => ({
    isOverflowing: false,
    ref: { current: null },
  })),
}));

import { useCheckOverflowContents } from "@/hooks";
import { UserOptionList } from "@/app/_components/UserSelection/UserOptionList";
import { MockUsers } from "@/test/mocks/users";

const mockUserList = MockUsers;

const defaultOverflowMock = () => ({
  isOverflowing: false,
  ref: { current: null } as RefObject<HTMLDivElement | null>,
});

beforeEach(() => {
  vi.mocked(useCheckOverflowContents).mockReturnValue(defaultOverflowMock());
});

afterEach(() => {
  cleanup();
});

describe("User Option List", () => {
  it("유저 목록이 화면에 렌더링된다.", () => {
    render(<UserOptionList userList={mockUserList} onSelect={vi.fn()} />);
    expect(screen.getByText("홍길동")).toBeInTheDocument();
    expect(screen.getByText("(010-1***-5678)")).toBeInTheDocument();
    expect(screen.getByText("김영희")).toBeInTheDocument();
    expect(screen.getByText("(010-2***-5678)")).toBeInTheDocument();
  });

  it("화면보다 유저 목록이 많으면 아이콘이 표시된다.", () => {
    vi.mocked(useCheckOverflowContents).mockReturnValue({
      isOverflowing: true,
      ref: { current: null } as RefObject<HTMLDivElement | null>,
    });
    render(<UserOptionList userList={mockUserList} onSelect={vi.fn()} />);
    expect(screen.getByTestId("chevrons-down-icon")).toBeInTheDocument();
  });

  it("화면보다 유저 목록이 많으면 스크롤이 가능해진다.", () => {
    vi.mocked(useCheckOverflowContents).mockReturnValue({
      isOverflowing: true,
      ref: { current: null } as RefObject<HTMLDivElement | null>,
    });
    const { container } = render(
      <UserOptionList userList={mockUserList} onSelect={vi.fn()} />,
    );
    const scrollContainer = container.firstChild as HTMLElement;
    expect(scrollContainer).toHaveClass("overflow-y-scroll");
  });

  it("오버플로우가 없으면 아이콘이 표시되지 않는다.", () => {
    render(<UserOptionList userList={mockUserList} onSelect={vi.fn()} />);
    expect(screen.queryByTestId("chevrons-down-icon")).not.toBeInTheDocument();
  });

  it("유저 항목 선택 시, onSelect에 해당 user 객체가 전달된다.", () => {
    const onSelect = vi.fn();
    render(<UserOptionList userList={mockUserList} onSelect={onSelect} />);
    fireEvent.click(screen.getAllByRole("button", { name: "선택" })[0]);
    expect(onSelect).toHaveBeenCalledWith(mockUserList[0]);
  });
});
