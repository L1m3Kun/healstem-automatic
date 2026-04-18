/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  cleanup();
});

import { ContentTemplateModal } from "./ContentTemplate.Modal";

// ───────────────────────────────────────────────
// AlertModal (mode="alert")
// ───────────────────────────────────────────────
describe("ContentTemplateModal — alert mode", () => {
  it("기본 타이틀 '주의'를 렌더링한다", () => {
    render(<ContentTemplateModal mode="alert" />);

    expect(screen.getByRole("heading", { name: "주의" })).toBeInTheDocument();
  });

  it("title prop이 전달되면 커스텀 타이틀을 렌더링한다", () => {
    render(<ContentTemplateModal mode="alert" title="삭제 주의" />);

    expect(
      screen.getByRole("heading", { name: "삭제 주의" }),
    ).toBeInTheDocument();
  });

  it("children 내용을 렌더링한다", () => {
    render(
      <ContentTemplateModal mode="alert">
        정말 삭제하시겠습니까?
      </ContentTemplateModal>,
    );

    expect(screen.getByText("정말 삭제하시겠습니까?")).toBeInTheDocument();
  });

  it("취소 버튼과 확인 버튼을 렌더링한다", () => {
    render(<ContentTemplateModal mode="alert" />);

    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
  });

  it("확인 버튼 클릭 시 onConfirm을 호출한다", () => {
    const onConfirm = vi.fn();

    render(<ContentTemplateModal mode="alert" onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole("button", { name: "확인" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("취소 버튼 클릭 시 onCancel을 호출한다", () => {
    const onCancel = vi.fn();

    render(<ContentTemplateModal mode="alert" onCancel={onCancel} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("onConfirm이 전달되지 않으면 확인 버튼 클릭 시 아무 일도 일어나지 않는다", () => {
    render(<ContentTemplateModal mode="alert" />);
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: "확인" })),
    ).not.toThrow();
  });

  it("onCancel이 전달되지 않으면 취소 버튼 클릭 시 아무 일도 일어나지 않는다", () => {
    render(<ContentTemplateModal mode="alert" />);
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: "취소" })),
    ).not.toThrow();
  });
});

// ───────────────────────────────────────────────
// ConfirmModal (mode="confirm")
// ───────────────────────────────────────────────
describe("ContentTemplateModal — confirm mode", () => {
  it("기본 타이틀 '확인'을 렌더링한다", () => {
    render(<ContentTemplateModal mode="confirm" />);

    expect(screen.getByRole("heading", { name: "확인" })).toBeInTheDocument();
  });

  it("title prop이 전달되면 커스텀 타이틀을 렌더링한다", () => {
    render(<ContentTemplateModal mode="confirm" title="입장 확인" />);

    expect(
      screen.getByRole("heading", { name: "입장 확인" }),
    ).toBeInTheDocument();
  });

  it("children 내용을 렌더링한다", () => {
    render(
      <ContentTemplateModal mode="confirm">
        입장하시겠습니까?
      </ContentTemplateModal>,
    );

    expect(screen.getByText("입장하시겠습니까?")).toBeInTheDocument();
  });

  it("아니오 버튼과 예 버튼을 렌더링한다", () => {
    render(<ContentTemplateModal mode="confirm" />);

    expect(screen.getByRole("button", { name: "아니오" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "예" })).toBeInTheDocument();
  });

  it("예 버튼 클릭 시 onConfirm을 호출한다", () => {
    const onConfirm = vi.fn();

    render(<ContentTemplateModal mode="confirm" onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole("button", { name: "예" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("아니오 버튼 클릭 시 onCancel을 호출한다", () => {
    const onCancel = vi.fn();

    render(<ContentTemplateModal mode="confirm" onCancel={onCancel} />);

    fireEvent.click(screen.getByRole("button", { name: "아니오" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("onConfirm이 전달되지 않으면 예 버튼 클릭 시 아무 일도 일어나지 않는다", () => {
    render(<ContentTemplateModal mode="confirm" />);
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: "예" })),
    ).not.toThrow();
  });

  it("onCancel이 전달되지 않으면 아니오 버튼 클릭 시 아무 일도 일어나지 않는다", () => {
    render(<ContentTemplateModal mode="confirm" />);
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: "아니오" })),
    ).not.toThrow();
  });
});

// ───────────────────────────────────────────────
// CustomModal (mode="custom")
// ───────────────────────────────────────────────
describe("ContentTemplateModal — custom mode", () => {
  it("children 내용을 렌더링한다", () => {
    render(
      <ContentTemplateModal mode="custom">
        커스텀 내용입니다
      </ContentTemplateModal>,
    );

    expect(screen.getByText("커스텀 내용입니다")).toBeInTheDocument();
  });

  it("title prop이 전달되면 타이틀을 렌더링한다", () => {
    render(<ContentTemplateModal mode="custom" title="공지사항" />);

    expect(
      screen.getByRole("heading", { name: "공지사항" }),
    ).toBeInTheDocument();
  });

  it("onClose가 전달되면 닫기 버튼을 렌더링한다", () => {
    render(<ContentTemplateModal mode="custom" onClose={vi.fn()} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("닫기 버튼 클릭 시 onClose를 호출한다", () => {
    const onClose = vi.fn();

    render(<ContentTemplateModal mode="custom" onClose={onClose} />);

    fireEvent.click(screen.getByRole("button"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("title과 onClose 모두 없으면 헤더를 렌더링하지 않는다", () => {
    render(
      <ContentTemplateModal mode="custom">내용</ContentTemplateModal>,
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("title만 있고 onClose가 없으면 닫기 버튼을 렌더링하지 않는다", () => {
    render(<ContentTemplateModal mode="custom" title="제목만" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

// ───────────────────────────────────────────────
// ContentTemplateModal — mode 라우팅
// ───────────────────────────────────────────────
describe("ContentTemplateModal — mode 라우팅", () => {
  it("mode가 정의되지 않은 값이면 에러를 던진다", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() =>
      render(<ContentTemplateModal mode={"unknown" as never} />),
    ).toThrow("Modal Template Error");

    consoleError.mockRestore();
  });
});
