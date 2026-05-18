import { CustomButton } from "@/components/Buttons";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { Display } from "../Form";

interface SelectUserProps {
  companion: number;
  lastPhone: string;
  decreaseCompanion: () => void;
  increaseCompanion: () => void;
}

export const SelectUser = ({
  lastPhone,
  decreaseCompanion,
  increaseCompanion,
  companion,
}: SelectUserProps) => {
  return (
    <>
      <div className="w-full h-full flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
        <div>
          <h2 className="text-2xl lg:mb-1">전화번호 뒷 자리</h2>
          <Display lastPhone={lastPhone} />
        </div>
        <div className="w-full h-full">
          <h2 className="text-2xl lg:mb-1">인원 선택</h2>
          <div className="flex-center gap-3 w-full h-full min-h-14">
            <CustomButton mode="default" onClick={decreaseCompanion}>
              <ChevronLeftCircle
                className={companion <= 1 ? "text-gray-400" : ""}
              />
            </CustomButton>
            <p className="text-3xl w-12">{companion}</p>
            <CustomButton mode="default" onClick={increaseCompanion}>
              <ChevronRightCircle />
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  );
};
