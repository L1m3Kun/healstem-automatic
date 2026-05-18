/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// useModal mock
const mockModalOpen = vi.hoisted(() => vi.fn());

vi.mock("@/contexts/Modals", () => ({
  useModal: () => ({
    open: mockModalOpen,
    close: vi.fn(),
  }),
  userSearchModalKey: "userSearch",
}));

// getUser mock
const mockGetUser = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api/client", () => ({
  getUser: mockGetUser,
}));

vi.mock("@/app/_components/Form/ButtonPanel", () => ({
  ButtonPanel: ({ handleButtonClick }: { handleButtonClick: () => void }) => (
    <>
      <button type="button" data-value="1" onClick={handleButtonClick}>
        1
      </button>
      <button type="button" data-value="2" onClick={handleButtonClick}>
        2
      </button>
      <button type="button" data-value="3" onClick={handleButtonClick}>
        3
      </button>
      <button type="button" data-value="4" onClick={handleButtonClick}>
        4
      </button>
      <button type="button" data-value="bs" onClick={handleButtonClick}>
        bs
      </button>
      <button type="button" onClick={handleButtonClick}>
        no-value
      </button>
    </>
  ),
}));

afterEach(() => {
  cleanup();
});

import { Form } from "@/app/_components/Form/Form";

describe("Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("초기상태에서는 에러 메세지를 표시하지 않는다.", () => {
    render(<Form />);
    expect(screen.getByTestId("error-message")).toHaveClass("invisible");
  });

  it("입력된 번호가 4자리 미만이면 에러 메세지를 표시한다.", async () => {
    render(<Form />);
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    await act(async () => {
      fireEvent.submit(screen.getByRole("form"));
    });
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "핸드폰 뒷 번호 4자리를 입력해주세요.",
    );
  });

  it("입력된 번호가 4자리 초과면 에러 메세지를 표시한다.", () => {
    render(<Form />);
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    // 5번째 입력 시 최대 4자리 에러 표시
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "최대 4자리까지 입력 가능합니다.",
    );
  });

  it("입력된 번호가 4개라면 api를 통해 유저 데이터를 검색한다.", async () => {
    mockGetUser.mockResolvedValue({ data: [], message: "" });
    render(<Form />);
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    await act(async () => {
      fireEvent.submit(screen.getByRole("form"));
    });
    await waitFor(() => {
      expect(mockGetUser).toHaveBeenCalledTimes(1);
      expect(mockGetUser).toHaveBeenCalledWith("1234");
    });
  });

  it("user 데이터를 탐색하는 중일 때는 LoadingSpinner가 렌더링되어야한다.", async () => {
    mockGetUser.mockReturnValue(new Promise(() => {}));
    render(<Form />);
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    // don't await so loading state is visible
    act(() => {
      fireEvent.submit(screen.getByRole("form"));
    });
    expect(screen.getByText("잠시만 기다려주세요.")).toBeInTheDocument();
  });

  it("api 호출이 실패한 경우, LoadingSpinner가 사라진다.", async () => {
    mockGetUser.mockRejectedValue(new Error("Network error"));
    render(<Form />);
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    await act(async () => {
      fireEvent.submit(screen.getByRole("form"));
    });
    await waitFor(() => {
      expect(
        screen.queryByText("잠시만 기다려주세요."),
      ).not.toBeInTheDocument();
    });
  });

  it("검색된 유저 데이터가 없는 경우, 에러 메세지를 표시한다.", async () => {
    mockGetUser.mockResolvedValue({ data: [], message: "", status: 1001 });
    render(<Form />);
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    await act(async () => {
      fireEvent.submit(screen.getByRole("form"));
    });
    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "유저를 찾을 수 없습니다.",
      );
    });
  });

  it("검색된 유저 데이터가 검색된 경우, 모달을 통해 유저 정보를 나열한다.", async () => {
    const mockUsers = [{ id: 1, name: "홍길동", phone: "010-1***-1234" }];
    mockGetUser.mockResolvedValue({
      data: mockUsers,
      message: "",
      status: 200,
    });
    render(<Form />);
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    await act(async () => {
      fireEvent.submit(screen.getByRole("form"));
    });
    await waitFor(() => {
      expect(mockModalOpen).toHaveBeenCalledTimes(1);
      expect(mockModalOpen).toHaveBeenCalledWith(
        expect.objectContaining({ key: "userSearch" }),
      );
    });
  });

  it("getUser가 data: null을 반환하면 '다시 시도해주세요.' 에러 메세지를 표시한다.", async () => {
    mockGetUser.mockResolvedValue({
      data: null,
      message: "API Request Failed",
      status: 400,
    });
    render(<Form />);
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    await act(async () => {
      fireEvent.submit(screen.getByRole("form"));
    });
    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "다시 시도해주세요.",
      );
    });
  });

  it("api 호출이 성공한 경우, LoadingSpinner가 사라진다.", async () => {
    mockGetUser.mockResolvedValue({ data: [], message: "", status: 200 });
    render(<Form />);
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    await act(async () => {
      fireEvent.submit(screen.getByRole("form"));
    });
    await waitFor(() => {
      expect(
        screen.queryByText("잠시만 기다려주세요."),
      ).not.toBeInTheDocument();
    });
  });

  it("bs 버튼 클릭 시 마지막 입력 숫자가 삭제된다.", async () => {
    render(<Form />);
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    fireEvent.click(screen.getByRole("button", { name: "bs" }));
    await act(async () => {
      fireEvent.submit(screen.getByRole("form"));
    });
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "핸드폰 뒷 번호 4자리를 입력해주세요.",
    );
  });

  it("유효성 에러 발생 후 4자리 재입력하면 에러 메세지가 사라진다.", async () => {
    mockGetUser.mockResolvedValue({ data: [], message: "", status: 200 });
    render(<Form />);
    // 3자리 입력 후 제출 → 에러 발생
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    await act(async () => {
      fireEvent.submit(screen.getByRole("form"));
    });
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "핸드폰 뒷 번호 4자리를 입력해주세요.",
    );
    // 4자리 맞춰 재제출 → 에러 메세지 초기화
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    await act(async () => {
      fireEvent.submit(screen.getByRole("form"));
    });
    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveClass("invisible");
    });
  });

  it("data-value가 없는 버튼 클릭 시 입력값이 변경되지 않는다.", async () => {
    render(<Form />);
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "no-value" }));
    await act(async () => {
      fireEvent.submit(screen.getByRole("form"));
    });
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "핸드폰 뒷 번호 4자리를 입력해주세요.",
    );
  });
});
