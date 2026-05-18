interface ConfirmModalContentsProps {
  name: string;
  companion: number;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModalContents = ({
  name,
  companion,
  onConfirm,
  onClose,
}: ConfirmModalContentsProps) => {
  const handleClickBackground = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    onClose();
  };
  return (
    <div
      className="h-screen w-screen bg-black/50 flex-center"
      onClick={handleClickBackground}
    >
      <div className="max-w-screen max-h-screen min-w-sm min-h-lg bg-bg flex-center flex-col  rounded-xl px-24 pt-12 pb-6 gap-5 text-2xl">
        <div>
          <p>환영합니다, {name}님</p>
          <p>인원 수 : {companion} 명</p>
        </div>
        <button
          onClick={onConfirm}
          className="rounded-2xl bg-accent text-bg py-4 w-24"
        >
          확인
        </button>
      </div>
    </div>
  );
};
