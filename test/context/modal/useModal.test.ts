import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";

import { useModal } from "@/contexts/Modals/useModal";
import { ModalProvider } from "@/contexts/Modals/ModalContext";

describe("useModal", () => {
  it("ModalProvider 외부에서 호출하면 에러를 던진다.", () => {
    expect(() => renderHook(() => useModal())).toThrow(
      "useModal must be used in Modal Provider.",
    );
  });
  it("ModalProvider 내부에서 호출하면 context를 반환한다.", () => {
    const { result } = renderHook(() => useModal(), { wrapper: ModalProvider });
    expect(result.current).toBeDefined();
  });
});
