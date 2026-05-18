import { ErrorModalContents } from "@/components/Modal";
import { errorModalKey, useModal } from "@/contexts/Modals";

interface ErrorModalProps {
  title?: React.ReactNode;
  errorMessage?: React.ReactNode;
}

const useErrorModal = () => {
  const modal = useModal();

  const onClose = () => {
    modal.close(errorModalKey);
  };

  return {
    open: ({ title = "오류", errorMessage = "" }: ErrorModalProps) => {
      modal.open({
        key: errorModalKey,
        children: (
          <ErrorModalContents
            onClose={onClose}
            title={title}
            errorMessage={errorMessage}
          />
        ),
      });
    },
    close: onClose,
  };
};

export { type ErrorModalProps, useErrorModal };
