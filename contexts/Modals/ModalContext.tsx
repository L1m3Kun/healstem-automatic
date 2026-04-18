"use client";
import {
  createContext,
  type MouseEvent,
  type PropsWithChildren,
  useState,
} from "react";

type ModalStateType = {
  key: symbol | string;
  children?: React.ReactNode;
};

type ModalContextType = {
  open: (modalContext: ModalStateType) => void;
  close: (deleteKey: ModalStateType["key"]) => void;
  modalStates: ModalStateType[];
};

export const _ModalContext = createContext<ModalContextType | null>(null);

interface ModalBackgroundProps extends PropsWithChildren {
  onClose: () => void;
}

const ModalBackground = ({ children, onClose }: ModalBackgroundProps) => {
  const handleBackgroundClick = (event: MouseEvent<HTMLDivElement>) => {
    const { currentTarget, target } = event;

    if (currentTarget !== target) {
      return;
    }
    onClose();
  };
  return (
    <div
      className="w-dvw h-dvh fixed inset-0 flex-center"
      onClick={handleBackgroundClick}
    >
      {children}
    </div>
  );
};

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalStates, setModalContexts] = useState<ModalStateType[]>([]);

  const openModal = (modalContext: ModalStateType) => {
    const isUnique = modalStates.findIndex(
      ({ key }) => key === modalContext.key,
    );
    if (isUnique >= 0) {
      console.warn(
        `same modal is already opened. ${modalContext.key.toString()}`,
      );
      return;
    }

    setModalContexts((prev) => [...prev, modalContext]);
    return;
  };

  const closeModal = (deleteKey: ModalStateType["key"]) => {
    setModalContexts((prev) => prev.filter(({ key }) => key !== deleteKey));
    return;
  };

  return (
    <_ModalContext.Provider
      value={{
        modalStates,
        open: openModal,
        close: closeModal,
      }}
    >
      {children}
      {modalStates.map(({ children, key }) => (
        <ModalBackground key={key.toString()} onClose={() => closeModal(key)}>
          {children}
        </ModalBackground>
      ))}
    </_ModalContext.Provider>
  );
};
