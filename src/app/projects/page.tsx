import type { Metadata } from "next";
import { BackButton } from "../back-button";
import { cn } from "../cn";
import { linkVariants } from "../link";

export const metadata: Metadata = {
  title: "Projects | Chase Adams",
  description: "Open source projects and experiments.",
};

const projects = [
  {
    description:
      "SSR-safe dark mode and theming for Next.js, TanStack Start, React Router, and many more.",
    href: "https://ssr-themes.cadams.io",
    name: "ssr-themes",
  },
  {
    description: "Fractional indexing without conflicts.",
    href: "https://github.com/0xcadams/fugue",
    name: "fugue",
  },
  {
    description: "Generate Zero schemas from Drizzle ORM schemas.",
    href: "https://github.com/rocicorp/drizzle-zero",
    name: "drizzle-zero",
  },
  {
    description: "Minimal server for viewing Markdown and code, with Git metadata.",
    href: "https://peruse.cadams.io",
    name: "peruse",
  },
] as const;

export default function ProjectsPage() {
  return (
    <>
      <BackButton href="/" />

      <main className="flex w-full flex-col items-start gap-8 row-start-2">
        <div className="w-full overflow-y-auto animate-rise-in motion-reduce:animate-none [animation-delay:0ms]">
          <ol className="flex gap-6 flex-col text-left w-full">
            {projects.map((project) => (
              <li className="flex flex-col gap-1" key={project.name}>
                <a
                  className={cn("group/project block transition-colors")}
                  href={project.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span
                    className={cn(
                      linkVariants(),
                      "text-lg no-underline group-hover/project:underline",
                    )}
                  >
                    {project.name}
                  </span>
                  <span className="ml-3 my-1 block text-sm text-white/70">
                    {project.description}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </>
  );
}
