import { formatWritingDate, getAllPosts } from "@/lib/writing";
import { getWritingTitleTransitionName } from "@/lib/writing-view-transition";
import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { BackButton } from "../back-button";
import { cn } from "../cn";
import { linkVariants } from "../link";

export const metadata: Metadata = {
  title: "Writing | Chase Adams",
  description: "Writing on craft, ideas, and the work behind them.",
};

export default async function WritingPagePage() {
  const posts = await getAllPosts();

  return (
    <>
      <BackButton href="/" />

      <main className="flex w-full flex-col items-start gap-8 row-start-2">
        <div className="w-full overflow-y-auto animate-rise-in motion-reduce:animate-none [animation-delay:0ms]">
          {posts.length > 0 ? (
            <ol className="flex gap-6 flex-col text-left w-full">
              {posts.map((post) => (
                <li className="flex flex-col gap-1" key={post.href}>
                  <Link
                    className={cn("group/post block transition-colors")}
                    href={post.href}
                  >
                    <ViewTransition
                      default="none"
                      name={getWritingTitleTransitionName(post.slug)}
                      share="writing-title-share"
                    >
                      <span
                        className={cn(
                          linkVariants(),
                          "text-lg no-underline group-hover/post:underline",
                        )}
                      >
                        {post.title}
                      </span>
                    </ViewTransition>
                    {post.date ? (
                      <p className="ml-3 my-1 text-xs text-amber-400/80 font-(family-name:--font-rock-salt)">
                        ~ {formatWritingDate(post.date)}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-sm text-white/60">No posts yet.</div>
          )}
        </div>
      </main>
    </>
  );
}
