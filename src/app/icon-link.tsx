import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "./cn";

type IconLinkProps = ComponentProps<typeof Link> & {
  "aria-label": string;
};

export function IconLink({ className, ...props }: IconLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-radial-[at_50%_75%] from-amber-700/10 via-amber-500/10 to-amber-300/10 text-white backdrop-blur-sm transition-all duration-500 hover:from-amber-700/20 hover:via-amber-500/20 hover:to-amber-300/20 hover:opacity-95 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        className,
      )}
      {...props}
    />
  );
}
