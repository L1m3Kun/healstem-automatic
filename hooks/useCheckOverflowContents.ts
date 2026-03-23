"use client";
import { useEffect, useRef, useState } from "react";

const useCheckOverflowContents = () => {
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = ref;
    if (!current) {
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
