"use client";
import { useEffect, useRef, useState } from "react";

const useCheckOverflowContents = () => {
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = ref;
    if (!current) {
      console.warn("content overflow ref's current is null");
      // @TODO : current가 null일 경우 UI 처리 추가
      return;
    }

    setIsOverflowing(current.scrollHeight > current.clientHeight);
  }, []);
  return {
    isOverflowing,
    ref,
  };
};

export { useCheckOverflowContents };
