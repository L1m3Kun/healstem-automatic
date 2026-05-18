import { ConfirmModalContents } from "@/components/Modal";
import { useModal, userSelectDialogKey } from "@/contexts/Modals";

interface ConfirmModalProps {
  name: string;
  companion: number;
  onConfirm?: () => void;
}
const useConfirmModal = () => {
  const modal = useModal();

  const onClose = () => {
    modal.close(userSelectDialogKey);
  };

  return {
    open: ({ onConfirm = () => {}, ...props }: ConfirmModalProps) => {
      const handleConfirm = () => {
        onConfirm();
        onClose();
      };
      modal.open({
        key: userSelectDialogKey,
        children: (
          <ConfirmModalContents
            onClose={onClose}
            onConfirm={handleConfirm}
            {...props}
          />
        ),
      });
    },
    close: onClose,
  };
};

export { type ConfirmModalProps, useConfirmModal };
