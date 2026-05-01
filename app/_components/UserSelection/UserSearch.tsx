"use client";

import { ChevronLeftCircle, ChevronRightCircle, CircleX } from "lucide-react";
import { type MouseEvent, useState } from "react";

import type { User } from "@/types";
import { useModal, userSelectDialogKey } from "@/contexts/Modals";
import { writeLog } from "@/lib/api/client";

import { Display } from "../Form";
import { UserOptionList } from "./UserOptionList";
import { InlineSpinner } from "@/components/LoadingSpinner";
import { useErrorModal } from "@/hooks/Modals";
import BackGroundModal from "@/components/Modal/BackGround.Modal";

interface UserSelectionProps {
  lastPhone: string;
  userList: User[];
  onClose: () => void;
}

export const UserSearch = ({
  lastPhone,
  userList,
  onClose,
}: UserSelectionProps) => {
  const [companion, setCompanion] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dialog = useModal();
  const errorModal = useErrorModal();

  const onConfirm = () => {
    dialog.close(userSelectDialogKey);
  };

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
          // @TODO : 개월권 동반입장 처리
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
      dialog.open({
        key: userSelectDialogKey,
        children: (
          <Dialog
            name={user.name}
            companion={companion}
            onConfirm={onConfirm}
            onClose={() => dialog.close(userSelectDialogKey)}
          />
        ),
      });
      onClose();
    } catch (e) {
      console.error(e);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const increaseCompanion = () => {
    setCompanion((prev) => Math.min(prev + 1, 20));
  };

  const decreaseCompanion = () => {
    setCompanion((prev) => Math.max(prev - 1, 1));
  };

  return (
    <BackGroundModal>
      <div className="max-h-screen max-w-screen lg:min-h-140 lg:min-w-220 mt-20 bg-bg-soft rounded-xl flex flex-col justify-center relative gap-7 px-10 pb-10 pt-8 lg:px-20 lg:pb-20 lg:pt-16">
        <div
          className="absolute inset-e-1 inset-y-1 pointer-clickable w-10 h-10"
          onClick={onClose}
        >
          <CircleX fill="#c86a3a" stroke="#ede7de" className="w-full h-full" />
        </div>
        {isLoading ? (
          <InlineSpinner />
        ) : (
          <>
            <div className="w-full h-full flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
              <div>
                <h2 className="text-2xl lg:mb-1">전화번호 뒷 자리</h2>
                <Display lastPhone={lastPhone} />
              </div>
              <div className="w-full h-full">
                <h2 className="text-2xl lg:mb-1">인원 선택</h2>
                <div className="flex-center gap-3 w-full h-full min-h-14">
                  <button onClick={decreaseCompanion}>
                    <ChevronLeftCircle
                      className={companion <= 1 ? "text-gray-400" : ""}
                    />
                  </button>
                  <p className="text-3xl w-12">{companion}</p>
                  <button onClick={increaseCompanion}>
                    <ChevronRightCircle />
                  </button>
                </div>
              </div>
            </div>
            <UserOptionList userList={userList} onSelect={selectUser} />
          </>
        )}
      </div>
    </BackGroundModal>
  );
};

interface DialogProps {
  name: string;
  companion: number;
  onConfirm: () => void;
  onClose: () => void;
}

const Dialog = ({ name, companion, onConfirm, onClose }: DialogProps) => {
  const handleClickBackground = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    onClose();
  };
  return (
    <div
      className="h-screen w-screen bg-black/50 flex-center"
      onClick={handleClickBackground}
    >
      <div className="max-w-screen max-h-screen min-w-sm min-h-lg bg-bg flex-center flex-col  rounded-xl px-24 pt-12 pb-6 gap-5 text-2xl">
        <div>
          <p>환영합니다, {name}님</p>
          <p>인원 수 : {companion} 명</p>
        </div>
        <button
          onClick={onConfirm}
          className="rounded-2xl bg-accent text-bg py-4 w-24"
        >
          확인
        </button>
      </div>
    </div>
  );
};
