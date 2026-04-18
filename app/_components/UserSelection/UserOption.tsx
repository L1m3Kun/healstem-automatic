import type { User } from "@/types";

interface UserOptionProps {
  user: User;
  onSelect: (user: User) => void;
}

export const UserOption = ({ user, onSelect }: UserOptionProps) => {
  return (
    <div className="flex-center justify-between rounded-2xl bg-secondary w-full h-full text-bg-soft py-3 px-8">
      <p className="text-2xl">
        {user.name} ({user.phone})
      </p>
      <button
        className="btn text-xl rounded-3xl bg-accent w-20 h-10"
        onClick={() => onSelect(user)}
      >
        선택
      </button>
    </div>
  );
};
