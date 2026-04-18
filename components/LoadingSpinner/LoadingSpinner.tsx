interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({
  message = "잠시만 기다려주세요.",
}: LoadingSpinnerProps) => {
  return (
    <div className="fixed inset-0 z-50 flex-center flex-col gap-5 bg-black/60">
      <div className="w-14 h-14 rounded-full border-4 border-bg-soft/30 border-t-primary animate-spin" />
      <p className="text-bg-soft text-xl">{message}</p>
    </div>
  );
};
