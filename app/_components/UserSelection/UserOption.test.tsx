/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { User } from "@/types";

import { UserOption } from "./UserOption";

const mockUser: User = {
  id: 1,
  name: "홍길동",
  gender: "남",
  phone: "010-1***-5678",
  membership: "1개월권",
};

afterEach(() => {
  cleanup();
});

describe("UserOption UI Unit Test", () => {
  it("유저 이름과 유저 전화번호가 props에 의해 동적으로 표시된다.", () => {
    render(<UserOption user={mockUser} onSelect={vi.fn()} />);
    expect(
      screen.getByText(`${mockUser.name} (${mockUser.phone})`),
    ).toBeInTheDocument();
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
    const anotherUser: User = {
      id: 2,
      name: "김철수",
      gender: "남",
      phone: "010-2***-9999",
      membership: "3개월권",
    };
    render(<UserOption user={anotherUser} onSelect={vi.fn()} />);
    expect(
      screen.getByText(`${anotherUser.name} (${anotherUser.phone})`),
    ).toBeInTheDocument();
  });
});
