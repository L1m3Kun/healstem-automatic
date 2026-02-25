/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  cleanup();
});

import { MemoizedButtonPanel } from "./ButtonPanel";

describe("MemoizedButtonPanel", () => {
  it("renders 12 keypad buttons", () => {
    render(<MemoizedButtonPanel handleButtonClick={vi.fn()} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(12);
  });

  it("calls handleButtonClick when a button is clicked", () => {
    const handleButtonClick = vi.fn();

    render(<MemoizedButtonPanel handleButtonClick={handleButtonClick} />);

    fireEvent.click(screen.getByRole("button", { name: "1" }));

    expect(handleButtonClick).toHaveBeenCalledTimes(1);
  });

  it("marks action buttons with accent class", () => {
    render(<MemoizedButtonPanel handleButtonClick={vi.fn()} />);

    const backspaceButton = screen.getByRole("button", { name: "<" });
    const confirmButton = screen.getByRole("button", { name: ">" });

    expect(backspaceButton).toHaveClass("bg-accent");
    expect(confirmButton).toHaveClass("bg-accent");
  });
});
