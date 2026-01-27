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

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsActive(true);
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <div
        className={cn(
          "absolute pointer-events-none select-none right-0 top-1/2 w-full max-w-3xl -translate-y-1/2 -z-10 animate-fade-in motion-reduce:animate-none",
          className,
        )}
      >
        <div className="relative w-full pointer-events-none select-none aspect-3/4 opacity-50 lg:opacity-100 transition-opacity duration-1000">
          <Image
            alt="Fire"
            src="/images/fire.png"
            className={cn("absolute inset-0 w-full h-full object-contain")}
            draggable={false}
            width={600}
            height={1200}
            preload
            sizes="(min-width: 1024px) 768px, 100vw"
            quality={70}
            placeholder="blur"
          />
          <video
            ref={videoRef}
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            src="/images/fire-1.mp4"
            poster="/images/fire.png"
            className={cn(
              "absolute inset-0 w-full h-full object-contain transition-all duration-3000ms ease-in-out scale-[0.92]",
              isActive ? "opacity-100" : "opacity-0",
            )}
          />
        </div>
      </div>
    </>
  );
}
