import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";

interface ModalProps {
  children?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface AlertModalProps extends ModalProps {
  AlertTitle?: string;
}

const AlertModal = ({
  children,
  AlertTitle = "주의",
  onCancel = () => {},
  onConfirm = () => {},
}: AlertModalProps) => {
  return (
    <article className="bg-surface rounded-2xl shadow-xl flex flex-col items-center gap-6 px-14 py-10 min-w-96 max-w-md border border-border">
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="flex items-center gap-2 text-primary">
          <TriangleAlert size={32} />
          <h1 className="text-2xl font-bold">{AlertTitle}</h1>
        </div>
        <hr className="w-full border-border" />
      </div>
      <div className="text-text text-lg text-center leading-relaxed min-h-10">
        {children}
      </div>
      <div className="flex gap-4 w-full justify-center">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-border text-text-muted text-lg hover:bg-bg-soft transition-colors"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 py-3 rounded-xl bg-primary text-bg-soft font-semibold text-lg hover:opacity-90 transition-opacity"
        >
          확인
        </button>
      </div>
    </article>
  );
};

interface ConfirmModalProps extends ModalProps {
  title?: string;
}

const ConfirmModal = ({
  children,
  title = "확인",
  onConfirm = () => {},
  onCancel = () => {},
}: ConfirmModalProps) => {
  return (
    <article className="bg-surface rounded-2xl shadow-xl flex flex-col items-center gap-6 px-14 py-10 min-w-96 max-w-md border border-border">
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="flex items-center gap-2 text-accent">
          <CircleCheck size={32} />
          <h1 className="text-2xl font-bold text-text">{title}</h1>
        </div>
        <hr className="w-full border-border" />
      </div>
      <div className="text-text text-lg text-center leading-relaxed min-h-10">
        {children}
      </div>
      <div className="flex gap-4 w-full justify-center">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-border text-text-muted text-lg hover:bg-bg-soft transition-colors"
        >
          아니오
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 py-3 rounded-xl bg-accent text-bg-soft font-semibold text-lg hover:opacity-90 transition-opacity"
        >
          예
        </button>
      </div>
    </article>
  );
};

interface CustomModalProps {
  children?: React.ReactNode;
  title?: string;
  onClose?: () => void;
}

const CustomModal = ({ children, title, onClose }: CustomModalProps) => {
  return (
    <article className="bg-surface rounded-2xl shadow-xl flex flex-col gap-5 px-14 py-10 min-w-96 max-w-lg border border-border">
      {(title || onClose) && (
        <div className="flex items-center justify-between w-full">
          {title && <h1 className="text-2xl font-bold text-text">{title}</h1>}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="ml-auto text-text-muted hover:text-primary transition-colors"
            >
              <CircleX size={28} />
            </button>
          )}
        </div>
      )}
      <div className="text-text text-lg leading-relaxed">{children}</div>
    </article>
  );
};

interface ContentTemplateModalProps extends ModalProps {
  mode: "alert" | "confirm" | "custom";
  title?: string;
  onClose?: () => void;
}

const ContentTemplateModal = ({
  mode,
  children,
  title,
  onConfirm,
  onCancel,
  onClose,
}: ContentTemplateModalProps) => {
  switch (mode) {
    case "alert":
      return (
        <AlertModal
          AlertTitle={title}
          onConfirm={onConfirm}
          onCancel={onCancel}
        >
          {children}
        </AlertModal>
      );
    case "confirm":
      return (
        <ConfirmModal title={title} onConfirm={onConfirm} onCancel={onCancel}>
          {children}
        </ConfirmModal>
      );
    case "custom":
      return (
        <CustomModal title={title} onClose={onClose}>
          {children}
        </CustomModal>
      );
    default:
      throw new Error(
        `Modal Template Error: Modal Template mode is not defined. mode: ${mode}`,
      );
  }
};

export { ContentTemplateModal, type ContentTemplateModalProps };
