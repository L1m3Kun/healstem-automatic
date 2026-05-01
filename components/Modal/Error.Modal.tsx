import { CustomButton } from "../Buttons";
import type { ErrorModalProps } from "@/hooks/Modals/useErrorModal";
import BackGroundModal from "./BackGround.Modal";
import { MessageCircleWarningIcon } from "lucide-react";

interface ErrorModalContentProps extends ErrorModalProps {
  onClose: () => void;
}
export const ErrorModalContents = ({
  onClose,
  title = "",
  errorMessage,
}: ErrorModalContentProps) => {
  return (
    <BackGroundModal className="flex justify-center items-center">
      <div className="bg-bg rounded-2xl min-w-md min-h-1/3 flex flex-col justify-center items-center gap-10 py-10">
        <h3 className="text-2xl text-[#B80f0A] flex justify-around items-center gap-2 ">
          <MessageCircleWarningIcon />
          {title}
        </h3>
        <p className="text-md wrap-break-words max-w-130 px-6 text-center">
          {errorMessage}
        </p>
        <CustomButton
          mode="default"
          onClick={onClose}
          className="px-10 py-2 bg-primary rounded-2xl text-center"
        >
          확인
        </CustomButton>
      </div>
    </BackGroundModal>
  );
};
