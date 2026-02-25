import { cn } from "@/utilities";
import { memo } from "react";

interface DisplayProps {
  lastPhone: string;
}

const Display = ({ lastPhone }: DisplayProps) => {
  return (
    <div>
      <div className="max-w-83 h-full w-full min-h-14 bg-white rounded-xl text-4xl tracking-[20%] text-center text-text py-2 no-scrollbar-scroll">
        {lastPhone}
      </div>
      {/* @TODO : 에러 변수 생성 및 에러 문구 처리 */}
      <p
        className={cn(
          "text-sm my-3 text-red-400",
          false ? "visible" : "invisible"
        )}
      >
        error message!!
      </p>
    </div>
  );
};
const MemoizedDisplay = memo(Display);
export { MemoizedDisplay, type DisplayProps };
