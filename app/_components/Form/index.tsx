"use client";
import { MemoizedDisplay, type DisplayProps } from "./Display";
import { MemoizedButtonPanel } from "./ButtonPanel";
import { MouseEvent, useCallback, useState } from "react";

export const Form = () => {
  const [lastPhone, setLastPhone] = useState<string>("");
  const handleButtonClick = useCallback(
    (event: MouseEvent<Element>) => {
      const target = event.target as HTMLButtonElement;

      if (!target || !target.dataset.value) {
        return;
      }

      const { value } = target.dataset;

      if (value === "cf") {
        if (/^\d{4}$/.exec(lastPhone)) {
          console.log(`value: ${value}, lastPhone: ${lastPhone}`);
          return;
        }
        console.warn(`lastphone is must be 4,${lastPhone}`);
        return;
      }
      if (value === "bs") {
        setLastPhone((prev) => prev.slice(0, Math.max(prev.length - 1, 0)));
        return;
      }
      if (typeof parseInt(value) === "number") {
        setLastPhone((prev) => prev + value);
        return;
      }
      return;
    },
    [lastPhone, setLastPhone]
  );
  return (
    <div>
      <MemoizedDisplay lastPhone={lastPhone} />
      <MemoizedButtonPanel handleButtonClick={handleButtonClick} />
    </div>
  );
};
export { type DisplayProps };
