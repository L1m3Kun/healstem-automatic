interface InlineSpinnerProps {
  message?: string;
  size?: "sm" | "md";
}

/** 특정 영역 내에서 사용하는 인라인 스피너 */
export const InlineSpinner = ({ message, size = "md" }: InlineSpinnerProps) => {
  const spinnerSize =
    size === "sm" ? "w-6 h-6 border-2" : "w-10 h-10 border-4";

  return (
    <div className="flex-center flex-col gap-3 w-full py-6">
      <div
        className={`${spinnerSize} rounded-full border-border border-t-primary animate-spin`}
      />
      {message && <p className="text-text-muted text-base">{message}</p>}
    </div>
  );
};
