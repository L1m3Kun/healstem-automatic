interface DisplayProps {
  lastPhone: string;
}

const Display = ({ lastPhone }: DisplayProps) => {
  return (
    <div className="min-w-83 h-full w-full min-h-14 bg-white rounded-xl text-4xl tracking-[20%] text-center text-text py-2 no-scrollbar-scroll">
      {lastPhone}
    </div>
  );
};

export { Display, type DisplayProps };
