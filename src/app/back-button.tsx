import { ArrowLeftIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "./cn";
import { IconLink } from "./icon-link";

type BackButtonProps = Omit<
  ComponentProps<typeof IconLink>,
  "aria-label" | "children"
>;

export function BackButton({
  className,
  href,
  ...props
}: BackButtonProps) {
  return (
    <IconLink
      aria-label="Back"
      className={cn("absolute top-4 left-4", className)}
      href={href}
      {...props}
    >
      <ArrowLeftIcon aria-hidden="true" className="size-4" />
    </IconLink>
  );
}
