"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "./cn";
import { useFormStatus } from "react-dom";
import { useHotkeys } from "./use-hotkeys";

const buttonVariants = cva(
  "group relative inline-flex line-clamp-1 backdrop-blur-sm items-center justify-center whitespace-nowrap transition-all duration-500 hover:opacity-95 active:scale-[0.97] rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      variant: {
        default:
          "text-white bg-[linear-gradient(25deg,var(--tw-gradient-stops))] from-amber-700/0 via-amber-500/0 to-amber-300/0 hover:from-amber-700/20 hover:via-amber-500/20 hover:to-amber-300/20",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-sm",
        lg: "h-10 px-8 text-base",
        xl: "h-12 px-10 text-base",
        "2xl": "h-14 px-12 text-base",
      },
      loading: {
        true: "cursor-not-allowed opacity-60",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  rightComponent?: React.ReactNode | null | undefined;
  leftComponent?: React.ReactNode | null | undefined;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size,

      disabled,

      children,

      ...props
    },
    ref,
  ) => {
    const { pending: formPending } = useFormStatus();

    const localRef = React.useRef<HTMLButtonElement | null>(null);
    const mergedRef = mergeRefs([ref, localRef]);
    useHotkeys(localRef.current);

    const isDisabled = Boolean(formPending || disabled);

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
