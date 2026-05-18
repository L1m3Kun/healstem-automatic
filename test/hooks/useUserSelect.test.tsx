/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "@/types";

// ─── Hoisted mocks ────────────────────────────────────────────────────────────
const mockConfirmOpen = vi.hoisted(() => vi.fn());
const mockConfirmClose = vi.hoisted(() => vi.fn());
const mockErrorOpen = vi.hoisted(() => vi.fn());
const mockErrorClose = vi.hoisted(() => vi.fn());
const mockWriteLog = vi.hoisted(() => vi.fn());

vi.mock("@/hooks/Modals/useConfirmModal", () => ({
  useConfirmModal: () => ({ open: mockConfirmOpen, close: mockConfirmClose }),
}));

vi.mock("@/hooks/Modals/useErrorModal", () => ({
  useErrorModal: () => ({ open: mockErrorOpen, close: mockErrorClose }),
}));

vi.mock("@/lib/api/client", () => ({
  writeLog: mockWriteLog,
}));

// ─── Imports (after mocks) ────────────────────────────────────────────────────
import { useUserSelect } from "@/hooks/useUserSelect";

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const now = new Date();
const pastDate = new Date(
  now.getTime() - 30 * 24 * 60 * 60 * 1000,
).toISOString();
const futureDate = new Date(
  now.getTime() + 30 * 24 * 60 * 60 * 1000,
).toISOString();
const expiredDate = new Date(now.getTime() - 1).toISOString();
const notStartedDate = new Date(now.getTime() + 60 * 60 * 1000).toISOString();

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  name: "홍길동",
  gender: "남",
  phone: "010-1***-5678",
  membership: "1개월권",
  restTicket: 0,
  monthlyMemebershipStart: pastDate,
  monthlyMemebershipEnd: futureDate,
  ...overrides,
});

const makeTicketUser = (restTicket: number): User => ({
  id: 2,
  name: "김회원",
  gender: "남",
  phone: "010-2***-1234",
  membership: "회권",
  restTicket,
  monthlyMemebershipStart: pastDate,
  monthlyMemebershipEnd: futureDate,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useUserSelect", () => {
  // ─── 초기 상태 ────────────────────────────────────────────────────────────────
  describe("초기 상태", () => {
    it("companion 초기값은 1이다.", () => {
      const onClose = vi.fn();
      const { result } = renderHook(() => useUserSelect({ onClose }));
      expect(result.current.companion).toBe(1);
    });

    it("isLoading 초기값은 false이다.", () => {
      const onClose = vi.fn();
      const { result } = renderHook(() => useUserSelect({ onClose }));
      expect(result.current.isLoading).toBe(false);
    });
  });

  // ─── 인원 조정 ────────────────────────────────────────────────────────────────
  describe("인원 조정", () => {
    it("increaseCompanion 호출 시 companion이 1 증가한다.", () => {
      const { result } = renderHook(() => useUserSelect({ onClose: vi.fn() }));
      act(() => result.current.increaseCompanion());
      expect(result.current.companion).toBe(2);
    });

    it("companion 최댓값은 20이다.", () => {
      const { result } = renderHook(() => useUserSelect({ onClose: vi.fn() }));
      act(() => {
        for (let i = 0; i < 25; i++) {
          result.current.increaseCompanion();
        }
      });
      expect(result.current.companion).toBe(20);
    });

    it("decreaseCompanion 호출 시 companion이 1 감소한다.", () => {
      const { result } = renderHook(() => useUserSelect({ onClose: vi.fn() }));
      act(() => result.current.increaseCompanion());
      act(() => result.current.decreaseCompanion());
      expect(result.current.companion).toBe(1);
    });

    it("companion 최솟값은 1이다.", () => {
      const { result } = renderHook(() => useUserSelect({ onClose: vi.fn() }));
      act(() => result.current.decreaseCompanion());
      expect(result.current.companion).toBe(1);
    });
  });

  // ─── 유저 선택: 개월권 정상 입장 ──────────────────────────────────────────────
  describe("개월권 정상 입장", () => {
    it("유효한 개월권 유저 선택 시 writeLog와 confirmModal.open이 호출된다.", async () => {
      const onClose = vi.fn();
      const { result } = renderHook(() => useUserSelect({ onClose }));
      const user = makeUser();
      await act(async () => {
        await result.current.selectUser(user);
      });
      expect(mockWriteLog).toHaveBeenCalledWith(user.id, 1);
      expect(mockConfirmOpen).toHaveBeenCalledWith(
        expect.objectContaining({ name: user.name, companion: 1 }),
      );
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("인원을 늘린 후 유저 선택 시 변경된 companion이 전달된다.", async () => {
      const onClose = vi.fn();
      const { result } = renderHook(() => useUserSelect({ onClose }));
      act(() => result.current.increaseCompanion()); // companion → 2
      const user = makeTicketUser(5); // 회권 5장, companion=2 → OK
      await act(async () => {
        await result.current.selectUser(user);
      });
      expect(mockWriteLog).toHaveBeenCalledWith(user.id, 2);
      expect(mockConfirmOpen).toHaveBeenCalledWith(
        expect.objectContaining({ companion: 2 }),
      );
    });
  });

  // ─── 개월권 오류 케이스 ────────────────────────────────────────────────────────
  describe("개월권 오류 케이스", () => {
    it("개월권 유저가 동반 인원 2명 이상이면 errorModal을 열고 onClose를 호출한다.", async () => {
      const onClose = vi.fn();
      const { result } = renderHook(() => useUserSelect({ onClose }));
      act(() => result.current.increaseCompanion()); // companion → 2
      const user = makeUser();
      await act(async () => {
        await result.current.selectUser(user);
      });
      expect(mockErrorOpen).toHaveBeenCalledWith(
        expect.objectContaining({ title: "정기회원권 동반입장 제한" }),
      );
      expect(mockConfirmOpen).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("개월권 시작일이 미래이면 errorModal을 열고 onClose를 호출한다.", async () => {
      const onClose = vi.fn();
      const { result } = renderHook(() => useUserSelect({ onClose }));
      const user = makeUser({ monthlyMemebershipStart: notStartedDate });
      await act(async () => {
        await result.current.selectUser(user);
      });
      expect(mockErrorOpen).toHaveBeenCalledWith(
        expect.objectContaining({ title: "회원권 미시작" }),
      );
      expect(mockConfirmOpen).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("개월권이 만료되었으면 errorModal을 열고 onClose를 호출한다.", async () => {
      const onClose = vi.fn();
      const { result } = renderHook(() => useUserSelect({ onClose }));
      const user = makeUser({ monthlyMemebershipEnd: expiredDate });
      await act(async () => {
        await result.current.selectUser(user);
      });
      expect(mockErrorOpen).toHaveBeenCalledWith(
        expect.objectContaining({ title: "회원권 만료" }),
      );
      expect(mockConfirmOpen).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  // ─── 회권 케이스 ──────────────────────────────────────────────────────────────
  describe("회권 케이스", () => {
    it("회권이 충분하면 writeLog와 confirmModal.open이 호출된다.", async () => {
      const onClose = vi.fn();
      const { result } = renderHook(() => useUserSelect({ onClose }));
      const user = makeTicketUser(3); // companion=1, restTicket=3 → OK
      await act(async () => {
        await result.current.selectUser(user);
      });
      expect(mockWriteLog).toHaveBeenCalledWith(user.id, 1);
      expect(mockConfirmOpen).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("회권이 부족하면 errorModal을 열고 onClose를 호출한다.", async () => {
      const onClose = vi.fn();
      const { result } = renderHook(() => useUserSelect({ onClose }));
      act(() => result.current.increaseCompanion()); // companion → 2
      const user = makeTicketUser(1); // restTicket=1 < companion=2
      await act(async () => {
        await result.current.selectUser(user);
      });
      expect(mockErrorOpen).toHaveBeenCalledWith(
        expect.objectContaining({ title: "회원권 부족" }),
      );
      expect(mockConfirmOpen).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  // ─── 에러 처리 ────────────────────────────────────────────────────────────────
  describe("에러 처리", () => {
    it("writeLog에서 예외 발생 시 onClose가 호출된다.", async () => {
      const onClose = vi.fn();
      mockWriteLog.mockImplementationOnce(() => {
        throw new Error("writeLog failed");
      });
      vi.spyOn(console, "error").mockImplementation(() => {});
      const { result } = renderHook(() => useUserSelect({ onClose }));
      const user = makeUser();
      await act(async () => {
        await result.current.selectUser(user);
      });
      expect(mockConfirmOpen).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("selectUser 완료 후 isLoading이 false로 복구된다.", async () => {
      const { result } = renderHook(() => useUserSelect({ onClose: vi.fn() }));
      const user = makeUser();
      await act(async () => {
        await result.current.selectUser(user);
      });
      expect(result.current.isLoading).toBe(false);
    });
  });
});
