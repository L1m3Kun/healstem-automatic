/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

afterEach(() => {
  cleanup();
});

import { MemoizedDisplay } from "./Display";

describe("MemoizedDisplay", () => {
  it("renders lastPhone text", () => {
    render(<MemoizedDisplay lastPhone="6498" />);

    expect(screen.getByText("6498")).toBeInTheDocument();
  });

  it("keeps error message hidden by default", () => {
    render(<MemoizedDisplay lastPhone="" />);

    const errorMessage = screen.getByText("error message!!");
    expect(errorMessage).toHaveClass("invisible");
  });
});
