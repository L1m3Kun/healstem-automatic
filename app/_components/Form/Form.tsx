"use client";
import type { MouseEvent, SubmitEvent } from "react";
import { useState } from "react";
import { useModal, userSearchModalKey } from "@/contexts/Modals";
import type { User } from "@/types/User";
import { cn } from "@/utilities";
import { Display } from "./Display";
import { ButtonPanel } from "./ButtonPanel";
import { UserSearch } from "../UserSelection/UserSearch";

const TestUserData: User[] = [
  { name: "test1", phone: "010-1***-6666" },
  { name: "test2", phone: "010-2***-6666" },
  { name: "test3", phone: "010-3***-6666" },
  { name: "test4", phone: "010-4***-6666" },
  { name: "test5", phone: "010-5***-6666" },
  { name: "test6", phone: "010-6***-6666" },
  { name: "test7", phone: "010-7***-6666" },
  { name: "test8", phone: "010-8***-6666" },
];

export const Form = () => {
  const [lastPhone, setLastPhone] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const userSelectionModal = useModal();

  const onSumbit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{4}$/.exec(lastPhone)) {
      console.warn(`lastphone is must be 4, lastPhoen: ${lastPhone}`);
      setErrorMessage("핸드폰 뒷 번호 4자리를 입력해주세요.");
      return;
    }

    setErrorMessage("");
    userSelectionModal.open({
      key: userSearchModalKey,
      children: (
        <UserSearch
          lastPhone={lastPhone}
          userList={TestUserData}
          onClose={() => userSelectionModal.close(userSearchModalKey)}
        />
      ),
    });
    return;
  };

  const onButtonClick = (event: MouseEvent<Element>) => {
    const target = event.target as HTMLButtonElement;
    if (!target || !target.dataset.value) {
      return;
    }

    const { value } = target.dataset;

    if (value === "bs") {
      setLastPhone((prev) => prev.slice(0, Math.max(prev.length - 1, 0)));
      return;
    }
    if (/^[0-9]$/.exec(value)) {
      setLastPhone((prev) => prev + value);
      return;
    }
    return;
  };

  return (
    <form onSubmit={onSumbit}>
      <Display lastPhone={lastPhone} />
      <p
        className={cn(
          "text-sm my-3 text-red-400 min-h-5",
          !!errorMessage ? "visible" : "invisible",
        )}
      >
        {errorMessage}
      </p>
      <ButtonPanel handleButtonClick={onButtonClick} />
    </form>
  );
};
