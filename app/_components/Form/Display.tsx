interface DisplayProps {
  lastPhone: string;
}

const Display = ({ lastPhone }: DisplayProps) => {
  return (
    <div className="min-w-52 min-h-9 h-full w-full bg-white rounded-xl text-xl lg:min-w-83 lg:min-h-14 lg:text-4xl tracking-[20%] text-center text-text py-2 no-scrollbar-scroll">
      {lastPhone}
    </div>
  );
};

export { Display, type DisplayProps };
