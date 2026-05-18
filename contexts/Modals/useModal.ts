"use client";
import { useContext } from "react";
import { _ModalContext } from "./ModalContext";

export const useModal = () => {
  const ctx = useContext(_ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used in Modal Provider.");
  }
  return ctx;
};
