interface BackGroundModalProps {
  children: React.ReactNode;
}
const BackGroundModal = ({ children }: BackGroundModalProps) => {
  return <article className="bg-black/80 w-full h-full">{children}</article>;
};

export default BackGroundModal;
