"use client";

import * as HoverCard from "@radix-ui/react-hover-card";
import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { cn } from "./cn";

type PhotoHoverCardProps = {
  alt: string;
  children: ReactNode;
  className?: string;
  sizes?: string;
  src: StaticImageData;
};

export function PhotoHoverCard({
  alt,
  children,
  className,
  sizes = "224px",
  src,
}: PhotoHoverCardProps) {
  return (
    <HoverCard.Root openDelay={120} closeDelay={80}>
      <HoverCard.Trigger asChild>
        <button
          className="rounded-sm font-semibold text-white underline decoration-dotted decoration-white/60 underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          type="button"
        >
          {children}
        </button>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          align="center"
          className={cn(
            "z-50 w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-white/15 bg-black/80 p-1.5 shadow-2xl shadow-black/70 backdrop-blur-md outline-none data-[state=open]:[animation:rise-in_180ms_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none",
            className,
          )}
          collisionPadding={16}
          side="top"
          sideOffset={10}
        >
          <Image
            loading="eager"
            alt={alt}
            className="h-auto w-full rounded-lg"
            sizes={sizes}
            src={src}
          />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
