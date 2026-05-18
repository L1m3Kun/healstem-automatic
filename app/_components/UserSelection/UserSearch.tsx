import { CircleX } from "lucide-react";

import { InlineSpinner } from "@/components/LoadingSpinner";
import { BackGroundModal } from "@/components/Modal";
import { useUserSelect } from "@/hooks";
import type { User } from "@/types";

import { UserOptionList } from "./UserOptionList";
import { SelectUser } from "./SelectUser";

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
  const {
    companion,
    decreaseCompanion,
    increaseCompanion,
    isLoading,
    selectUser,
  } = useUserSelect({ onClose });

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
            <SelectUser
              companion={companion}
              lastPhone={lastPhone}
              decreaseCompanion={decreaseCompanion}
              increaseCompanion={increaseCompanion}
            />
            <UserOptionList userList={userList} onSelect={selectUser} />
          </>
        )}
      </div>
    </BackGroundModal>
  );
};
