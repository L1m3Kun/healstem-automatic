import { type MouseEvent, type ReactNode } from "react";
import { CircleCheck, Delete } from "lucide-react";
import { cn } from "@/utilities";

type ButtonItemType = {
  type: "button" | "submit";
  contents: ReactNode;
  id: string | number;
  value: string | number;
};

const ButtonItems: ButtonItemType[] = [
  { type: "button", contents: 1, id: 1, value: 1 },
  { type: "button", contents: 2, id: 2, value: 2 },
  { type: "button", contents: 3, id: 3, value: 3 },
  { type: "button", contents: 4, id: 4, value: 4 },
  { type: "button", contents: 5, id: 5, value: 5 },
  { type: "button", contents: 6, id: 6, value: 6 },
  { type: "button", contents: 7, id: 7, value: 7 },
  { type: "button", contents: 8, id: 8, value: 8 },
  { type: "button", contents: 9, id: 9, value: 9 },
  {
    type: "button",
    contents: <Delete size={40} data-value={"bs"} />,
    id: "back-space",
    value: "bs",
  },
  { type: "button", contents: 0, id: 0, value: 0 },
  {
    type: "submit",
    contents: <CircleCheck size={40} data-value={"cf"} />,
    id: "confirm",
    value: "cf",
  },
];

interface ButtonPanelProps {
  handleButtonClick: (event: MouseEvent) => void;
}

const ButtonPanel = ({ handleButtonClick }: ButtonPanelProps) => {
  return (
    <div
      onClick={handleButtonClick}
      className="grid grid-cols-[repeat(3,100px)] gap-4 w-full justify-center max-h-75 h-full"
    >
      {ButtonItems.map(({ contents, value, id, ...rest }) => (
        <button
          key={id}
          data-value={value}
          className={cn(
            "btn btn-numbers self-center justify-self-center h-15 flex-center",
            typeof id !== "number" && "bg-accent",
          )}
          {...rest}
        >
          {contents}
        </button>
      ))}
    </div>
  );
};

export { ButtonPanel };
