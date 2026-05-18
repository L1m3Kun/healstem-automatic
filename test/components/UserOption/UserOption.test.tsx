/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { UserOption } from "@/app/_components/UserSelection/UserOption";
import { MockUsers } from "@/test/mocks/users";

const mockUser = MockUsers[0];

afterEach(() => {
  cleanup();
});

describe("UserOption UI Unit Test", () => {
  it("유저 이름과 유저 전화번호가 props에 의해 동적으로 표시된다.", () => {
    render(<UserOption user={mockUser} onSelect={vi.fn()} />);
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(`(${mockUser.phone})`)).toBeInTheDocument();
  });

  it("render Button", () => {
    render(<UserOption user={mockUser} onSelect={vi.fn()} />);
    expect(screen.getByRole("button", { name: "선택" })).toBeInTheDocument();
  });

  it("선택 버튼 클릭 시, onSelect 함수가 실행된다.", () => {
    const onSelect = vi.fn();
    render(<UserOption user={mockUser} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: "선택" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("선택 버튼 클릭 시, onSelect에 해당 user 객체가 전달된다.", () => {
    const onSelect = vi.fn();
    render(<UserOption user={mockUser} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: "선택" }));
    expect(onSelect).toHaveBeenCalledWith(mockUser);
  });

  it("다른 user props가 주어지면 해당 이름과 전화번호가 표시된다.", () => {
    const anotherUser = MockUsers[1];
    render(<UserOption user={anotherUser} onSelect={vi.fn()} />);
    expect(screen.getByText(anotherUser.name)).toBeInTheDocument();
    expect(screen.getByText(`(${anotherUser.phone})`)).toBeInTheDocument();
  });
});
