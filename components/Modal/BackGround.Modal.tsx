import { cn } from "@/utilities";

interface BackGroundModalProps {
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}
const BackGroundModal = ({
  children,
  onClose = () => {},
  className,
}: BackGroundModalProps) => {
  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <article
      onClick={onClose}
      className={cn(
        "bg-black/80 fixed min-w-screen min-h-screen inset-0",
        className,
      )}
    >
      <div className="mx-12" onClick={handleStopPropagation}>
        {children}
      </div>
    </article>
  );
};

export { BackGroundModal };
