"use client";
import { type MouseEvent, type SubmitEvent, useState } from "react";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useModal, userSearchModalKey } from "@/contexts/Modals";
import { cn } from "@/utilities";

import { UserSearch } from "../UserSelection";
import { Display } from "./Display";
import { ButtonPanel } from "./ButtonPanel";
import { getUser } from "@/lib/api/client";
import { CUSTOM_STATUS_CODE } from "@/lib/api/server";

export const Form = () => {
  const [lastPhone, setLastPhone] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userSelectionModal = useModal();

  const onSumbit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{4}$/.exec(lastPhone)) {
      console.warn(`lastphone is must be 4, lastPhoen: ${lastPhone}`);
      setErrorMessage("핸드폰 뒷 번호 4자리를 입력해주세요.");
      return;
    }

    setErrorMessage("");
    try {
      setIsLoading(true);
      const { data: userList, message, status } = await getUser(lastPhone);

      if (status === CUSTOM_STATUS_CODE.user_not_fond) {
        setErrorMessage("유저를 찾을 수 없습니다.");
        return;
      }
      if (!userList) {
        setErrorMessage("다시 시도해주세요.");
        console.error(message);
        return;
      }
      // @TODO : loading, error 처리
      setLastPhone("");
      userSelectionModal.open({
        key: userSearchModalKey,
        children: (
          <UserSearch
            lastPhone={lastPhone}
            userList={userList}
            onClose={() => userSelectionModal.close(userSearchModalKey)}
          />
        ),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
    return;
  };

  const onButtonClick = (event: MouseEvent<Element>) => {
    const target = (event.target as Element).closest<HTMLButtonElement>(
      "button",
    );

    if (!target || !target.dataset.value) {
      return;
    }

    const { value } = target.dataset;
    setErrorMessage("");
    if (value === "bs") {
      setLastPhone((prev) => prev.slice(0, Math.max(prev.length - 1, 0)));
      return;
    }
    if (/^[0-9]$/.exec(value)) {
      if (lastPhone.length > 3) {
        setErrorMessage("최대 4자리까지 입력 가능합니다.");
        return;
      }
      setLastPhone((prev) => prev + value);
      return;
    }
    return;
  };

  return (
    <>
      <form aria-label="form" onSubmit={onSumbit}>
        <Display lastPhone={lastPhone} />
        <p
          data-testid="error-message"
          className={cn(
            "text-xs lg:text-sm my-3 text-red-400 min-h-2 lg:min-h-5",
            !!errorMessage ? "visible" : "invisible",
          )}
        >
          {errorMessage}
        </p>
        <ButtonPanel handleButtonClick={onButtonClick} />
      </form>
      {isLoading && <LoadingSpinner />}
    </>
  );
};
