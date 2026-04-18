/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  cleanup();
});

import { ButtonPanel } from "./ButtonPanel";

describe("ButtonPanel", () => {
  it("0~9, reset, 12개의 버튼이 렌더링된다.", () => {
    render(<ButtonPanel handleButtonClick={vi.fn()} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(12);
  });

  it("calls handleButtonClick when a button is clicked", () => {
    const handleButtonClick = vi.fn();

    render(<ButtonPanel handleButtonClick={handleButtonClick} />);

    fireEvent.click(screen.getByRole("button", { name: "1" }));

    expect(handleButtonClick).toHaveBeenCalledTimes(1);
  });

  it("marks action buttons with accent class", () => {
    render(<ButtonPanel handleButtonClick={vi.fn()} />);

    const buttons = screen.getAllByRole("button");
    const accentButtons = buttons.filter((btn) =>
      btn.classList.contains("bg-accent"),
    );

    expect(accentButtons).toHaveLength(2);
  });
});
