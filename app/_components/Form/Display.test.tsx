/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

afterEach(() => {
  cleanup();
});

import { Display } from "./Display";

describe("Display", () => {
  it("renders lastPhone text", () => {
    render(<Display lastPhone="6498" />);

    expect(screen.getByText("6498")).toBeInTheDocument();
  });

  it("lastPhone이 빈 문자열이면 아무 텍스트도 표시하지 않는다", () => {
    const { container } = render(<Display lastPhone="" />);

    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
