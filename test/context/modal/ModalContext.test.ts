/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ModalProvider } from "../../../contexts/Modals/ModalContext";
import { useModal } from "../../../contexts/Modals/useModal";

afterEach(() => {
  cleanup();
});

// ── 테스트용 헬퍼 컴포넌트 (React.createElement 사용) ──

const ModalOpener = ({
  modalKey,
  label,
}: {
  modalKey: string;
  label: string;
}) => {
  const { open } = useModal();
  return React.createElement(
    "button",
    {
      onClick: () =>
        open({
          key: modalKey,
          children: React.createElement("p", null, label),
        }),
    },
    "열기",
  );
};

const ModalCloser = ({ modalKey }: { modalKey: string }) => {
  const { close } = useModal();
  return React.createElement(
    "button",
    { onClick: () => close(modalKey) },
    "닫기",
  );
};

// ── 테스트 ──

describe("ModalProvider", () => {
  it("children을 렌더링한다", () => {
    render(
      React.createElement(
        ModalProvider,
        null,
        React.createElement("p", null, "자식 요소"),
      ),
    );

    expect(screen.getByText("자식 요소")).toBeInTheDocument();
  });

  it("open 호출 시 modal children을 렌더링한다", async () => {
    render(
      React.createElement(
        ModalProvider,
        null,
        React.createElement(ModalOpener, {
          modalKey: "m1",
          label: "모달 내용",
        }),
      ),
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
    });

    expect(screen.getByText("모달 내용")).toBeInTheDocument();
  });

  it("같은 key로 open을 두 번 호출하면 두 번째는 무시된다", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      React.createElement(
        ModalProvider,
        null,
        React.createElement(ModalOpener, {
          modalKey: "m2",
          label: "중복 모달",
        }),
      ),
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
    });

    expect(screen.getAllByText("중복 모달")).toHaveLength(1);
    expect(warnSpy).toHaveBeenCalledTimes(1);

    warnSpy.mockRestore();
  });

  it("close 호출 시 modal이 제거된다", async () => {
    render(
      React.createElement(
        ModalProvider,
        null,
        React.createElement(ModalOpener, {
          modalKey: "m3",
          label: "닫힐 모달",
        }),
        React.createElement(ModalCloser, { modalKey: "m3" }),
      ),
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
    });

    expect(screen.getByText("닫힐 모달")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    });

    expect(screen.queryByText("닫힐 모달")).not.toBeInTheDocument();
  });

  it("ModalBackground 바깥 영역 클릭 시 modal이 닫힌다", async () => {
    render(
      React.createElement(
        ModalProvider,
        null,
        React.createElement(ModalOpener, {
          modalKey: "m4",
          label: "배경 클릭 모달",
        }),
      ),
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "열기" }));
    });

    expect(screen.getByText("배경 클릭 모달")).toBeInTheDocument();

    // ModalBackground div(currentTarget === target)를 직접 클릭
    const background = screen.getByText("배경 클릭 모달").parentElement!;
    await act(async () => {
      fireEvent.click(background, { target: background });
    });

    expect(screen.queryByText("배경 클릭 모달")).not.toBeInTheDocument();
  });
});
