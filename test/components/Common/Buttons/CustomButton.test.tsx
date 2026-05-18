/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Route } from "next";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

import { CustomButton } from "@/components/Buttons";

afterEach(() => {
  cleanup();
});

describe("CustomButton", () => {
  it("renders a button by default and forwards props", () => {
    const handleClick = vi.fn();

    render(
      <CustomButton
        mode="default"
        href={"/test" as Route}
        onClick={handleClick}
        type="button"
      >
        Click me
      </CustomButton>,
    );

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toHaveAttribute("type", "button");

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders a link when mode is link", () => {
    render(
      <CustomButton href={"/docs" as Route} mode="link">
        Docs
      </CustomButton>,
    );

    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "/docs");
  });
});
