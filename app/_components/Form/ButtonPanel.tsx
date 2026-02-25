import { cn } from "@/utilities";
import { MouseEvent, memo, useCallback, useState } from "react";

const ButtonItems = [
  { contents: 1, id: 1, value: 1 },
  { contents: 2, id: 2, value: 2 },
  { contents: 3, id: 3, value: 3 },
  { contents: 4, id: 4, value: 4 },
  { contents: 5, id: 5, value: 5 },
  { contents: 6, id: 6, value: 6 },
  { contents: 7, id: 7, value: 7 },
  { contents: 8, id: 8, value: 8 },
  { contents: 9, id: 9, value: 9 },
  { contents: "<", id: "back-space", value: "bs" },
  { contents: 0, id: 0, value: 0 },
  { contents: ">", id: "confirm", value: "cf" },
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
      {ButtonItems.map(({ contents, value, id }) => (
        <button
          key={id}
          data-value={value}
          className={cn(
            "btn btn-numbers self-center justify-self-center h-15",
            typeof id !== "number" && "bg-accent"
          )}
        >
          {contents}
        </button>
      ))}
    </div>
  );
};

export const MemoizedButtonPanel = memo(ButtonPanel);
