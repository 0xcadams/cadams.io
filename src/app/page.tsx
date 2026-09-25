import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import aurora from "./aurora.png";
import headshot from "./headshot.jpg";
import j from "./j.png";
import { linkVariants } from "./link";
import { PhotoHoverCard } from "./photo-hover-card";

export const metadata: Metadata = {
  title: "Chase Adams",
  description: "Engineer and optimist.",
};

export default function Home() {
  return (
    <div className="grid gap-10">
      <div
        className="flex group w-full flex-col gap-6"
        data-construction-node="home-introduction"
      >
        <div className="flex gap-2 items-center">
          <span className="flex gap-4 w-full items-center text-lg text-amber-400/80 font-(family-name:--font-rock-salt) animate-rise-in motion-reduce:animate-none [animation-delay:0ms]">
            <span>Chase Adams</span>
            <Image
              src={headshot}
              alt="Chase Adams"
              width={140}
              preload
              loading="eager"
              className="rounded-lg saturate-150 grayscale size-9 object-cover overflow-clip animate-rise-in motion-reduce:animate-none [animation-delay:40ms]"
            />
          </span>
        </div>
        <div className="flex w-full flex-col gap-6 items-start">
          <div className="animate-rise-in motion-reduce:animate-none [animation-delay:140ms]">
            I am an engineer and an optimist; partner at{" "}
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

      <div
        className="flex group w-full flex-col gap-6"
        data-construction-node="home-grounding"
      >
        <span className="text-sm text-amber-400 font-(family-name:--font-rock-salt) animate-rise-in motion-reduce:animate-none [animation-delay:300ms]">
          {"— What keeps me grounded;"}
        </span>

        <div className="animate-rise-in motion-reduce:animate-none [animation-delay:360ms]">
          I love to spend time with my{" "}
          <PhotoHoverCard
            alt="My wife and me on our wedding day"
            className="w-84"
            sizes="336px"
            src={j}
          >
            wife
          </PhotoHoverCard>{" "}
          &{" "}
          <PhotoHoverCard alt="Me holding my daughter, Aurora" src={aurora}>
            baby daughter
          </PhotoHoverCard>{" "}
          & family & friends & dogs, explore new ideas, build things, travel,
          run, ski, and read.
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
        <div className="w-full animate-rise-in motion-reduce:animate-none [animation-delay:620ms]">
          I live by a few{" "}
          <Link className={linkVariants()} href="/principles">
            principles
          </Link>
          {", have some "}
          <Link className={linkVariants()} href="/projects">
            personal projects
          </Link>
          {", and I "}
          <Link className={linkVariants()} href="/writing">
            write very infrequently
          </Link>
          {"."}
        </div>
      </div>
    </div>
  );
}
