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

      <div className="flex items-center -my-6 text-amber-400/70" aria-hidden="true">
        <svg
          className="ml-1 h-4 w-28"
          viewBox="0 0 160 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M8 14C14 8 22 8 28 14C34 20 42 20 48 14"
              strokeWidth="3"
            />
            <path
              d="M56 14C62 8 70 8 76 14C82 20 90 20 96 14"
              strokeWidth="3"
            />
            <path
              d="M104 14C110 8 118 8 124 14C130 20 138 20 144 14"
              strokeWidth="3"
            />
            <path
              d="M7 15C14 10 21 9 28 15C35 21 42 20 49 15"
              strokeWidth="1.75"
              opacity="0.55"
            />
            <path
              d="M55 15C62 10 69 9 76 15C83 21 90 20 97 15"
              strokeWidth="1.75"
              opacity="0.55"
            />
            <path
              d="M103 15C110 10 117 9 124 15C131 21 138 20 145 15"
              strokeWidth="1.75"
              opacity="0.55"
            />
          </g>
          <g fill="currentColor" opacity="0.55">
            <circle cx="28" cy="6" r="1.25" />
            <circle cx="76" cy="19" r="1" />
            <circle cx="124" cy="6" r="1" />
            <circle cx="144" cy="19" r="1.25" />
          </g>
        </svg>
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
