import type { User } from "@/types/User";

interface UserOptionProps {
  user: User;
  onSelect: (name: string) => void;
}

export const UserOption = ({
  user: { phone, name },
  onSelect,
}: UserOptionProps) => {
  return (
    <div
      key={phone}
      className="flex-center justify-between rounded-2xl bg-secondary w-full h-full text-bg-soft py-3 px-8"
    >
      <p className="text-2xl">
        {name} ({phone})
      </p>
      <button
        className="btn text-xl rounded-3xl bg-accent w-20 h-10"
        onClick={() => onSelect(name)}
      >
        선택
      </button>
    </div>
  );
};
