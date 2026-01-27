"use client";

import { install, uninstall } from "@github/hotkey";
import { useEffect, useState } from "react";

export const useHotkeys = (el: HTMLElement | null) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isMounted && el) {
      install(el);

      return () => {
        uninstall(el as HTMLElement);
      };
    }
  }, [el, isMounted]);

  return <></>;
};
