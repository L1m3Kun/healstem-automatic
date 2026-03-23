import { ChevronsDown } from "lucide-react";
import type { User } from "@/types/User";
import { UserOption } from "./UserOption";
import { useCheckOverflowContents } from "@/hooks";

interface UserOptionListProps {
  userList: User[];
  onSelect: (name: string) => void;
}

export const UserOptionList = ({ userList, onSelect }: UserOptionListProps) => {
  const { isOverflowing, ref: userListRef } = useCheckOverflowContents();

  return (
    <div
      className="overflow-y-scroll w-full flex-center flex-col justify-start gap-3 max-h-80"
      ref={userListRef}
    >
      {userList.map((user) => (
        <UserOption key={user.phone} user={user} onSelect={onSelect} />
      ))}
      {isOverflowing && (
        <ChevronsDown
          className="text-primary absolute inset-be-24 animate-bounce"
          size={40}
        />
      )}
    </div>
  );
};
