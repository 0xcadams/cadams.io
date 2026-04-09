"use client";

import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { buttonVariants } from "./button-variants";
import { cn } from "./cn";
import { useHotkeys } from "./use-hotkeys";

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  rightComponent?: React.ReactNode | null | undefined;
  leftComponent?: React.ReactNode | null | undefined;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size, disabled, children, ...props },
    ref,
  ) => {
    const localRef = React.useRef<HTMLButtonElement | null>(null);
    const mergedRef = mergeRefs([ref, localRef]);
    useHotkeys(localRef.current);

    const isDisabled = Boolean(disabled);

    return (
      <button
        className={cn(
          "disabled:cursor-not-allowed",
          buttonVariants({
            variant,
            size,
            loading: isDisabled,
            className,
          }),
          "inline-flex gap-2",
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        ref={mergedRef}
        type="button"
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

function mergeRefs<T = unknown>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>,
): React.RefCallback<T> {
  return (value) => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}
