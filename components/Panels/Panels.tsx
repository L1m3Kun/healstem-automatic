import { type PropsWithChildren } from "react";
import { cn } from "@/utilities";

interface PanelComponentProps extends PropsWithChildren {
  className?: string;
}

export const Panels = ({ children, className }: PanelComponentProps) => {
  return (
    <div
      className={cn(
        "panel w-full text-bg-soft text-2xl flex-center",
        className
      )}
    >
      {children}
    </div>
  );
};
