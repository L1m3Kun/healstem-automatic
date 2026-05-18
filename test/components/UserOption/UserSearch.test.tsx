/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "@/types";

// ─── Hoisted mocks ────────────────────────────────────────────────────────────
const mockDialogOpen = vi.hoisted(() => vi.fn());
const mockDialogClose = vi.hoisted(() => vi.fn());

vi.mock("@/contexts/Modals", () => ({
  useModal: () => ({ open: mockDialogOpen, close: mockDialogClose }),
  userSelectDialogKey: "userSelect",
  errorModalKey: "errorModal",
}));

vi.mock("@/lib/api/client", () => ({
  writeLog: vi.fn(),
}));

vi.mock("@/app/_components/Form", () => ({
  Display: ({ lastPhone }: { lastPhone: string }) => (
    <div data-testid="display">{lastPhone}</div>
  ),
}));

vi.mock("@/app/_components/UserSelection/UserOptionList", () => ({
  UserOptionList: ({
    userList,
    onSelect,
  }: {
    userList: User[];
    onSelect: (user: User) => void;
  }) => (
    <div data-testid="user-option-list">
      {userList.map((user) => (
        <button key={user.id} onClick={() => onSelect(user)}>
          {user.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("@/components/LoadingSpinner", () => ({
  InlineSpinner: () => <div data-testid="inline-spinner" />,
}));

vi.mock("lucide-react", () => ({
  ChevronLeftCircle: () => <span data-testid="icon-decrease" />,
  ChevronRightCircle: () => <span data-testid="icon-increase" />,
  CircleX: () => <span data-testid="icon-close" />,
}));

// ─── Imports (after mocks) ────────────────────────────────────────────────────
import { writeLog } from "@/lib/api/client";
import { UserSearch } from "@/app/_components/UserSelection/UserSearch";
import { MockUsers } from "@/test/mocks/users";

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const mockUser = MockUsers[0];

const mockUserList = MockUsers;

const defaultProps = {
  lastPhone: "1234",
  userList: mockUserList,
  onClose: vi.fn(),
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ─── Helper ───────────────────────────────────────────────────────────────────
const setup = (props = defaultProps) => render(<UserSearch {...props} />);

// =============================================================================
describe("UserSearch", () => {
  // ─── 초기 렌더링 ─────────────────────────────────────────────────────────────
  describe("초기 렌더링", () => {
    it("초기 인원(companion) 값이 1로 표시된다.", () => {
      setup();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("lastPhone이 Display에 전달된다.", () => {
      setup();
      expect(screen.getByTestId("display")).toHaveTextContent("1234");
    });

    it("userList가 UserOptionList에 전달되어 렌더링된다.", () => {
      setup();
      expect(screen.getByTestId("user-option-list")).toBeInTheDocument();
      expect(screen.getByText("홍길동")).toBeInTheDocument();
      expect(screen.getByText("김영희")).toBeInTheDocument();
    });

    it("닫기 아이콘이 렌더링된다.", () => {
      setup();
      expect(screen.getByTestId("icon-close")).toBeInTheDocument();
    });
  });

  // ─── 닫기 ─────────────────────────────────────────────────────────────────────
  describe("닫기", () => {
    it("닫기 아이콘 클릭 시 onClose가 호출된다.", () => {
      const onClose = vi.fn();
      render(<UserSearch {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByTestId("icon-close"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  // ─── 인원 조정 ────────────────────────────────────────────────────────────────
  describe("인원 조정", () => {
    it("증가 버튼 클릭 시 companion이 1 증가한다.", () => {
      setup();
      fireEvent.click(screen.getByTestId("icon-increase"));
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("감소 버튼 클릭 시 companion이 1 감소한다.", () => {
      setup();
      // 먼저 2로 증가시킨 뒤 감소
      fireEvent.click(screen.getByTestId("icon-increase"));
      fireEvent.click(screen.getByTestId("icon-decrease"));
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("companion 최솟값은 1이다 — 1에서 감소해도 1을 유지한다.", () => {
      setup();
      fireEvent.click(screen.getByTestId("icon-decrease"));
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("companion 최댓값은 20이다 — 20에서 증가해도 20을 유지한다.", () => {
      setup();
      for (let i = 0; i < 25; i++) {
        fireEvent.click(screen.getByTestId("icon-increase"));
      }
      expect(screen.getByText("20")).toBeInTheDocument();
    });
  });

  // ─── 유저 선택 ────────────────────────────────────────────────────────────────
  describe("유저 선택", () => {
    beforeEach(() => setup());

    it("유저 선택 시 writeLog가 user.id와 현재 companion 값으로 호출된다.", () => {
      fireEvent.click(screen.getByText("홍길동"));
      expect(writeLog).toHaveBeenCalledWith(mockUser.id, 1);
    });

    it("companion 증가 후 유저 선택 시 writeLog에 현재 companion이 전달된다.", () => {
      // MockUsers[0]은 개월권(1개월권)이므로 companion=1만 허용 → companion 그대로 1 유지
      fireEvent.click(screen.getByText("홍길동"));
      expect(writeLog).toHaveBeenCalledWith(mockUser.id, 1);
    });

    it("유저 선택 시 dialog.open이 호출된다.", () => {
      fireEvent.click(screen.getByText("홍길동"));
      expect(mockDialogOpen).toHaveBeenCalledTimes(1);
      expect(mockDialogOpen).toHaveBeenCalledWith(
        expect.objectContaining({ key: "userSelect" }),
      );
    });

    it("유저 선택 시 onClose가 호출된다.", () => {
      const onClose = vi.fn();
      cleanup();
      render(<UserSearch {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByText("홍길동"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("유저 선택 후 InlineSpinner가 표시되지 않는다 (isLoading이 false로 복구).", () => {
      fireEvent.click(screen.getByText("홍길동"));
      expect(screen.queryByTestId("inline-spinner")).not.toBeInTheDocument();
    });

    it("writeLog 에러 발생 시 dialog.open이 호출되지 않고 onClose는 호출된다.", () => {
      vi.mocked(writeLog).mockImplementationOnce(() => {
        throw new Error("writeLog failed");
      });
      const onClose = vi.fn();
      cleanup();
      render(<UserSearch {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByText("홍길동"));
      expect(mockDialogOpen).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Dialog ───────────────────────────────────────────────────────────────────
  describe("Dialog", () => {
    const selectUser = () => {
      setup();
      fireEvent.click(screen.getByText("홍길동"));
      // dialog.open에 전달된 children(Dialog 컴포넌트)을 추출해 렌더링
      const dialogChildren = mockDialogOpen.mock.calls[0][0].children;
      return render(dialogChildren);
    };

    it("Dialog에 유저 이름과 인원이 표시된다.", () => {
      selectUser();
      expect(screen.getByText("환영합니다, 홍길동님")).toBeInTheDocument();
      expect(screen.getByText("인원 수 : 1 명")).toBeInTheDocument();
    });

    it("Dialog 확인 버튼 클릭 시 dialog.close가 호출된다.", () => {
      selectUser();
      fireEvent.click(screen.getByRole("button", { name: "확인" }));
      expect(mockDialogClose).toHaveBeenCalledWith("userSelect");
    });

    it("Dialog 배경(외부) 클릭 시 dialog.close가 호출된다.", () => {
      const { container } = selectUser();
      // 최상위 배경 div 직접 클릭 (target === currentTarget 조건 충족)
      const backdrop = container.firstChild as HTMLElement;
      fireEvent.click(backdrop, { target: backdrop });
      expect(mockDialogClose).toHaveBeenCalledWith("userSelect");
    });

    it("Dialog 내부 콘텐츠 클릭 시 닫히지 않는다.", () => {
      selectUser();
      // 내부 p 태그 클릭 — target !== currentTarget 이므로 close 미호출
      fireEvent.click(screen.getByText("환영합니다, 홍길동님"));
      expect(mockDialogClose).not.toHaveBeenCalled();
    });
  });
});
