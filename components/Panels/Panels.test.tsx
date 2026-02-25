/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

afterEach(() => {
  cleanup();
});

import { Panels } from "./Panels";

describe("Panels", () => {
  it("renders children", () => {
    render(<Panels>Panel content</Panels>);

    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("applies default panel classes", () => {
    const { container } = render(<Panels>content</Panels>);

    const panel = container.firstElementChild as HTMLElement;
    expect(panel).toHaveClass("panel");
    expect(panel).toHaveClass("flex-center");
  });

  it("merges custom className", () => {
    const { container } = render(<Panels className="custom-class">content</Panels>);

    const panel = container.firstElementChild as HTMLElement;
    expect(panel).toHaveClass("custom-class");
  });
});
