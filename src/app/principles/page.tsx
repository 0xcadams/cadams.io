"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../button";
import { cn } from "../cn";

const BoldedText = ({ children }: { children: React.ReactNode }) => {
  return <span className="font-semibold text-amber-400">{children}</span>;
};

export default function Home() {
  return (
    <>
      <Link className="absolute top-4 left-4 items-center gap-2" href="/">
        <Button size="sm">
          <ArrowLeftIcon className="w-4 h-4" /> Back
        </Button>
      </Link>

      <main className="flex flex-col gap-4 row-start-2 w-full items-start">
        <div className="flex gap-2 items-center">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M96,72a8,8,0,0,1,8-8A104.11,104.11,0,0,1,208,168a8,8,0,0,1-16,0,88.1,88.1,0,0,0-88-88A8,8,0,0,1,96,72ZM240,192H80V32a8,8,0,0,0-16,0V64H32a8,8,0,0,0,0,16H64V200a8,8,0,0,0,8,8H240a8,8,0,0,0,0-16Z"></path>
          </svg>
          <span className="font-semibold">Principles</span>
        </div>
        <Accordion.Root defaultValue={[principles[0].title]} type="multiple">
          <ol className="list-inside list-decimal space-y-3 text-sm text-left w-full">
            {principles.map((principle) => (
              <Accordion.Item key={principle.title} value={principle.title}>
                <Accordion.Trigger
                  asChild
                  className={cn(
                    "items-center justify-between w-full font-semibold",
                  )}
                >
                  <li role="button">{principle.title}</li>
                </Accordion.Trigger>
                <Accordion.Content className="pt-2 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-white/80">
                      {principle.description}
                    </span>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </ol>
        </Accordion.Root>
        <div className="text-xs text-amber-400/80 font-[family-name:var(--font-rock-salt)] mt-6 ml-1">
          ~ January 2026
        </div>
      </main>
    </>
  );
}

const principles = [
  {
    title: "Love deeply",
    description: (
      <span>
        Seek out relationships, family, projects, and dreams to{" "}
        <span className="text-amber-400 font-semibold">
          love fully and intensely.
        </span>
      </span>
    ),
  },
  {
    title: "Radical responsibility",
    description: (
      <span>
        Default to taking responsibility for outcomes around you,{" "}
        <BoldedText>regardless of the amount of influence you had.</BoldedText>
      </span>
    ),
  },
  {
    title: "Transparency",
    description: (
      <span>
        Communicate in a clear, honest, and empathetic way. Let information flow
        freely and give others agency over how they use it.
      </span>
    ),
  },
  {
    title: "Keep commitments",
    description: (
      <span>
        Be careful about saying yes or providing an expectation. Once you
        commit, within reason, <BoldedText>it should be kept.</BoldedText>
      </span>
    ),
  },
  {
    title: "Embrace reality",
    description: (
      <span>
        Challenge assumptions behind your decisions and ensure they are{" "}
        <BoldedText>aligned with the facts available.</BoldedText>
      </span>
    ),
  },
  {
    title: "Localized risk",
    description: (
      <span>
        Make sure that <BoldedText>risk is siloed</BoldedText> across all areas
        of your life. Minimize overall risk as much as possible.
      </span>
    ),
  },
  {
    title: "Meaningful contributions",
    description: (
      <span>
        The goal is not money - it is{" "}
        <BoldedText>meaningful contributions</BoldedText>, and money comes
        along. Life is short.
      </span>
    ),
  },
  {
    title: "Exponential is incremental",
    description: <span>Small daily wins add up.</span>,
  },
  {
    title: "Reduce suffering",
    description: (
      <span>
        The best long-term outcome in any situation is the one that reduces
        suffering.
      </span>
    ),
  },
  {
    title: "Learn every day",
    description: (
      <span>
        Every day should include learning something{" "}
        <BoldedText>with passion.</BoldedText>
      </span>
    ),
  },
  {
    title: "Feel feelings",
    description: (
      <span>
        Allow your feelings to pass{" "}
        <BoldedText>without judgement and within reason</BoldedText>; allow and
        encourage others to do the same.
      </span>
    ),
  },
] as const;
