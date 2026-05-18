import { useState } from "react";
import { useConfirmModal, useErrorModal } from "./Modals";
import type { User } from "@/types";
import { writeLog } from "@/lib/api/client";

interface UserSelectParams {
  onClose: () => void;
}

const useUserSelect = ({ onClose }: UserSelectParams) => {
  const [companion, setCompanion] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const confirmModal = useConfirmModal();
  const errorModal = useErrorModal();

  const selectUser = async (user: User) => {
    try {
      setIsLoading(true);

      // 유저 유효성 검사
      const userMemebershipType = user.membership;

      if (userMemebershipType === "회권") {
        // 회권 개수 유효
        if (user.restTicket < companion) {
          // @TODO :회권 부족 처리
          errorModal.open({
            title: "회원권 부족",
            errorMessage: "동반 인원을 데려가기에 회권이 충분하지 않습니다.",
          });
          onClose();
          return;
        }
      } else {
        // 개월권 동반입장
        if (companion > 1) {
          errorModal.open({
            title: "정기회원권 동반입장 제한",
            errorMessage:
              "정기권 회원님께서는 동반 인원을 위해 추가 결제가 필요합니다. 직원에게 문의해주세요.",
          });
          onClose();
          return;
        }
        // 개월권 유효
        const now = new Date(Date.now());
        const startDate = new Date(user.monthlyMemebershipStart);
        const expiredDate = new Date(user.monthlyMemebershipEnd);

        const formatDate = (d: Date) => {
          const days = ["일", "월", "화", "수", "목", "금", "토"];
          return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}(${days[d.getDay()]})`;
        };

        if (startDate > now) {
          errorModal.open({
            title: "회원권 미시작",
            errorMessage: (
              <div>
                <p>회원권 시작일이 아직 도래하지 않았습니다.</p>
                <p>시작일: {formatDate(startDate)}</p>
              </div>
            ),
          });
          onClose();
          return;
        }

        if (now >= expiredDate) {
          errorModal.open({
            title: "회원권 만료",
            errorMessage: (
              <div>
                <p>기간제 회원권이 만료되었습니다. 다시 결제해주세요.</p>
                <p>만료일: {formatDate(expiredDate)}</p>
              </div>
            ),
          });
          onClose();
          return;
        }
      }

      writeLog(user.id, companion);
      confirmModal.open({
        name: user.name,
        companion,
      });
      onClose();
    } catch (e) {
      console.error(e);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  // 동반 인원 수 컨트롤 함수
  const increaseCompanion = () => {
    setCompanion((prev) => Math.min(prev + 1, 20));
  };

  const decreaseCompanion = () => {
    setCompanion((prev) => Math.max(prev - 1, 1));
  };

  return {
    selectUser,
    increaseCompanion,
    decreaseCompanion,
    isLoading,
    companion,
  };
};

export { useUserSelect };
