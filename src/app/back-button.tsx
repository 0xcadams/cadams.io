"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "./button";
import { cn } from "./cn";

type BackButtonProps = Omit<
  ComponentProps<typeof Link>,
  "children" | "className" | "href"
> & {
  children?: ReactNode;
  className?: string;
  href: ComponentProps<typeof Link>["href"];
};

export function BackButton({
  children = "Back",
  className,
  href,
  ...props
}: BackButtonProps) {
  return (
    <Link
      className={cn("absolute top-4 left-4 items-center gap-2", className)}
      href={href}
      {...props}
    >
      <Button size="sm">
        <ArrowLeftIcon className="h-4 w-4" /> {children}
      </Button>
    </Link>
  );
}
