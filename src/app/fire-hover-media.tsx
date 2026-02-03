"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "./cn";
import fire from "./fire.png";

type FireHoverMediaProps = {
  className?: string;
};

export function FireHoverMedia({ className }: FireHoverMediaProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "absolute pointer-events-none select-none right-0 xl:right-16 2xl:right-24 top-1/2 w-full max-w-3xl -z-10 -translate-y-1/2 transition-all animate-fade-in motion-reduce:animate-none [animation-delay:400ms]",
          className,
        )}
      >
        <div className="relative w-full pointer-events-none select-none aspect-3/4 opacity-50 lg:opacity-100 transition-opacity duration-1000">
          <Image
            alt="Fire"
            src={fire}
            className={cn(
              "absolute inset-0 w-full h-full object-contain filter contrast-[1.1] sepia-[0.2] mix-blend-screen -z-20",
            )}
            draggable={false}
            width={600}
            height={1200}
            preload
            sizes="(min-width: 1024px) 768px, 100vw"
          />

          <video
            ref={videoRef}
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            src="/images/fire-aidf7.mp4"
            poster="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffire.1b70983e.png&w=1920&q=75&dpl=dpl_H6eUFj4U9tW4q9xYqXEUrR6LS3aP"
            className={cn(
              "absolute inset-0 w-full h-full object-contain transition-all scale-[0.92] animate-fade-in motion-reduce:animate-none",
              "filter brightness-50 contrast-[1.1] blur-2xl mix-blend-color-dodge [animation-delay:4000ms]",
            )}
          />
        </div>
      </div>
    </>
  );
}
