import { CustomButton } from "@/components/Buttons";
import type { User } from "@/types";

interface UserOptionProps {
  user: User;
  onSelect: (user: User) => void;
}

export const UserOption = ({ user, onSelect }: UserOptionProps) => {
  return (
    <div className="flex-center justify-between rounded-2xl bg-secondary w-full h-full text-bg-soft py-3 px-4 lg:px-8">
      <p className="text-sm lg:text-2xl">
        <span className="block lg:inline-block">{user.name}</span>
        <span className="block lg:inline-block">({user.phone})</span>
      </p>
      <CustomButton
        mode="default"
        className="btn text-sm lg:text-xl rounded-3xl bg-accent w-10 h-8 lg:w-20 lg:h-10"
        onClick={() => onSelect(user)}
      >
        선택
      </CustomButton>
    </div>
  );
};
