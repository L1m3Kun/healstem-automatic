/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Hoisted mocks ────────────────────────────────────────────────────────────
const mockOpen = vi.hoisted(() => vi.fn());
const mockClose = vi.hoisted(() => vi.fn());

vi.mock("@/contexts/Modals", () => ({
  useModal: () => ({ open: mockOpen, close: mockClose }),
  errorModalKey: "errorModal",
}));

// ─── Imports (after mocks) ────────────────────────────────────────────────────
import { useErrorModal } from "@/hooks/Modals/useErrorModal";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useErrorModal", () => {
  it("open 호출 시 modal.open이 errorModalKey로 호출된다.", () => {
    const { result } = renderHook(() => useErrorModal());
    act(() => {
      result.current.open({ title: "에러", errorMessage: "문제가 발생했습니다." });
    });
    expect(mockOpen).toHaveBeenCalledWith(
      expect.objectContaining({ key: "errorModal" }),
    );
  });

  it("open 호출 시 전달한 title이 children에 반영된다.", () => {
    const { result } = renderHook(() => useErrorModal());
    act(() => {
      result.current.open({ title: "커스텀 에러", errorMessage: "메시지" });
    });
    expect(mockOpen).toHaveBeenCalledTimes(1);
    const callArg = mockOpen.mock.calls[0][0];
    expect(callArg.key).toBe("errorModal");
    expect(callArg.children).toBeDefined();
  });

  it("title 생략 시 기본값 '오류'가 적용된다.", () => {
    const { result } = renderHook(() => useErrorModal());
    act(() => {
      result.current.open({ errorMessage: "기본 제목 테스트" });
    });
    expect(mockOpen).toHaveBeenCalledTimes(1);
  });

  it("close 호출 시 modal.close가 errorModalKey로 호출된다.", () => {
    const { result } = renderHook(() => useErrorModal());
    act(() => {
      result.current.close();
    });
    expect(mockClose).toHaveBeenCalledWith("errorModal");
  });

  it("open을 여러 번 호출하면 modal.open도 같은 횟수로 호출된다.", () => {
    const { result } = renderHook(() => useErrorModal());
    act(() => {
      result.current.open({ title: "1차", errorMessage: "첫 번째" });
      result.current.open({ title: "2차", errorMessage: "두 번째" });
    });
    expect(mockOpen).toHaveBeenCalledTimes(2);
  });
});
