"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "./cn";

type FireHoverMediaProps = {
  className?: string;
};

export function FireHoverMedia({ className }: FireHoverMediaProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isActive, setIsActive] = React.useState(false);

  return (
    <>
      <div
        className={cn(
          "absolute right-0 top-1/2 w-full max-w-3xl -translate-y-1/2 -z-10 pointer-events-none",
          className,
        )}
      >
        <div className="relative w-full aspect-[3/4]">
          <Image
            alt="Fire"
            src="/images/fire.png"
            className={cn("absolute inset-0 w-full h-full object-contain")}
            draggable={false}
            width={600}
            height={1200}
          />
          <video
            ref={videoRef}
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            src="/images/fire.mp4"
            poster="/images/fire.png"
            className={cn(
              "absolute inset-0 w-full h-full object-contain transition-all duration-[3000ms] ease-in-out scale-[0.92]",
              isActive ? "opacity-100" : "opacity-0",
            )}
          />
        </div>
      </div>

      <div
        className={cn(
          "absolute right-0 top-1/2 w-full max-w-3xl -translate-y-1/2 z-10",
          className,
        )}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
      >
        <div className="w-full aspect-[3/4]" />
      </div>
    </>
  );
}
