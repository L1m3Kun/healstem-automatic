"use client";

import { ChevronLeftCircle, ChevronRightCircle, CircleX } from "lucide-react";
import { type MouseEvent, useState } from "react";

import type { User } from "@/types";
import { useModal, userSelectDialogKey } from "@/contexts/Modals";
import { writeLog } from "@/lib/api/client";

import { Display } from "../Form";
import { UserOptionList } from "./UserOptionList";
import { InlineSpinner } from "@/components/LoadingSpinner";

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

  const onConfirm = () => {
    dialog.close(userSelectDialogKey);
  };

  const selectUser = (user: User) => {
    try {
      setIsLoading(true);
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
    <div className="max-h-screen max-w-screen min-h-140 min-w-220 mt-20 bg-bg-soft rounded-xl flex-center flex-col justify-start relative gap-7 px-20 pb-20 pt-16">
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
          <div className="w-full h-full flex-center justify-between items-start">
            <div>
              <h2 className="text-2xl mb-1">전화번호 뒷 자리</h2>
              <Display lastPhone={lastPhone} />
            </div>
            <div className="w-full h-full">
              <h2 className="text-2xl mb-1">인원 선택</h2>
              <div className="flex-center gap-3 w-full h-full min-h-14">
                <button onClick={decreaseCompanion}>
                  <ChevronLeftCircle />
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
      <div className="max-w-screen max-h-screen min-w-sm min-h-lg bg-bg flex flex-col items-center rounded-xl px-24 pt-12 pb-6 gap-5 text-2xl">
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
