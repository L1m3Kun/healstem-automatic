/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Hoisted mocks ────────────────────────────────────────────────────────────
const mockOpen = vi.hoisted(() => vi.fn());
const mockClose = vi.hoisted(() => vi.fn());

vi.mock("@/contexts/Modals", () => ({
  useModal: () => ({ open: mockOpen, close: mockClose }),
  userSelectDialogKey: "userSelect",
}));

vi.mock("@/components/Modal", () => ({
  ConfirmModalContents: ({
    name,
    companion,
  }: {
    name: string;
    companion: number;
    onConfirm: () => void;
    onClose: () => void;
  }) => (
    <div>
      {name} - {companion}
    </div>
  ),
}));

// ─── Imports (after mocks) ────────────────────────────────────────────────────
import { useConfirmModal } from "@/hooks/Modals/useConfirmModal";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useConfirmModal", () => {
  it("open 호출 시 modal.open이 userSelectDialogKey로 호출된다.", () => {
    const { result } = renderHook(() => useConfirmModal());
    act(() => {
      result.current.open({ name: "홍길동", companion: 1 });
    });
    expect(mockOpen).toHaveBeenCalledWith(
      expect.objectContaining({ key: "userSelect" }),
    );
  });

  it("open 호출 시 children이 포함된다.", () => {
    const { result } = renderHook(() => useConfirmModal());
    act(() => {
      result.current.open({ name: "홍길동", companion: 2 });
    });
    const callArg = mockOpen.mock.calls[0][0];
    expect(callArg.children).toBeDefined();
  });

  it("close 호출 시 modal.close가 userSelectDialogKey로 호출된다.", () => {
    const { result } = renderHook(() => useConfirmModal());
    act(() => {
      result.current.close();
    });
    expect(mockClose).toHaveBeenCalledWith("userSelect");
  });

  it("open에 onConfirm 콜백이 없어도 에러 없이 동작한다.", () => {
    const { result } = renderHook(() => useConfirmModal());
    expect(() => {
      act(() => {
        result.current.open({ name: "테스트", companion: 1 });
      });
    }).not.toThrow();
  });
});
