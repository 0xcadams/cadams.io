"use client";

import Link from "next/link";
import { cn } from "./cn";
import { linkVariants } from "./link";
import Image from "next/image";
import headshot from "./headshot.jpg";

export default function Home() {
  return (
    <div className="grid gap-10">
      <div className="flex group flex-col gap-6">
        <div className="flex gap-2 items-center">
          <span className="flex gap-4 w-full items-center text-lg text-amber-400/80 font-(family-name:--font-rock-salt) animate-rise-in motion-reduce:animate-none [animation-delay:0ms]">
            <span>Chase Adams</span>
            <Image
              src={headshot}
              alt="Chase Adams"
              width={140}
              className="rounded-full saturate-150 grayscale size-9 object-cover overflow-clip animate-rise-in motion-reduce:animate-none [animation-delay:780ms]"
            />
          </span>
        </div>
        <div className="flex flex-col gap-6 items-start">
          <div className="animate-rise-in motion-reduce:animate-none [animation-delay:140ms]">
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

          <div className="animate-rise-in motion-reduce:animate-none [animation-delay:240ms]">
            I am fascinated by{" "}
            <span className="text-sm text-amber-400 font-(family-name:--font-rock-salt)">
              Quality
            </span>{" "}
            in the craft of engineering, product design, sync engines, and AI.
          </div>
        </div>
      </div>

      <div className="flex group flex-col gap-6">
        <span className="text-sm text-amber-400 font-(family-name:--font-rock-salt) animate-rise-in motion-reduce:animate-none [animation-delay:300ms]">
          {"— What keeps me grounded;"}
        </span>

        <div className="animate-rise-in motion-reduce:animate-none [animation-delay:360ms]">
          I love to spend time with my wife & family & friends & three dogs,
          explore new ideas, travel, run, ski, and read.
        </div>

        <div className="animate-rise-in motion-reduce:animate-none [animation-delay:440ms]">
          A few of my favorite books:
        </div>

        <ol className="list-inside list-decimal text-white/80 italic text-left animate-rise-in motion-reduce:animate-none [animation-delay:520ms]">
          <li className="mb-2">
            Zen and the Art of Motorcycle Maintenance (Robert M. Pirsig)
          </li>
          <li className="mb-2">
            The Timeless Way of Building (Christopher Alexander)
          </li>
          <li className="mb-2">Thinking, Fast and Slow (Daniel Kahneman)</li>
          <li>Waking Up (Sam Harris)</li>
        </ol>
        <div className="animate-rise-in motion-reduce:animate-none [animation-delay:620ms]">
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
