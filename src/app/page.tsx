"use client";

import Link from "next/link";
import { cn } from "./cn";
import { linkVariants } from "./link";

export default function Home() {
  return (
    <div className={cn("grid gap-10")}>
      <div className="flex group flex-col gap-6">
        <div className="flex gap-2 items-center">
          <span className="text-lg text-amber-400/80 font-[family-name:var(--font-rock-salt)] ml-1">
            — Chase Adams
          </span>
        </div>
        <div className="flex flex-col gap-6 items-start">
          <div>
            I am a builder and an optimist; at{" "}
            <a
              className={linkVariants()}
              target="_blank"
              href="https://rocicorp.dev"
            >
              Rocicorp
            </a>{" "}
            building a general purpose sync engine for the web,{" "}
            <a
              className={linkVariants()}
              target="_blank"
              href="https://zero.rocicorp.dev"
            >
              Zero
            </a>
            .
          </div>

          <div>
            I am fascinated by{" "}
            <span className="text-sm text-amber-400 font-[family-name:var(--font-rock-salt)]">
              Quality
            </span>{" "}
            in the craft of engineering, product design, sync engines, and AI.
          </div>
        </div>
      </div>

      <div className="flex group flex-col gap-6">
        <div>
          I love to spend time with my wife & family & friends & three dogs,
          write software, explore new ideas, travel, ski, run, and read.
        </div>

        <div>A few of my favorite books:</div>

        <ol className="list-inside list-decimal text-white/80 italic text-left">
          <li className="mb-2">
            Zen and the Art of Motorcycle Maintenance (Robert M. Pirsig)
          </li>
          <li className="mb-2">
            The Timeless Way of Building (Christopher Alexander)
          </li>
          <li className="mb-2">Thinking, Fast and Slow (Daniel Kahneman)</li>
          <li>Waking Up (Sam Harris)</li>
        </ol>
        <div>
          I also have a few{" "}
          <Link className={linkVariants()} href="/principles">
            life principles
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
