import type { Metadata } from "next";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../button";
import { formatBlogDate, getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Chase Adams",
  description: "Writing on craft, ideas, and the work behind them.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <Link className="absolute top-4 left-4 items-center gap-2" href="/">
        <Button size="sm">
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Button>
      </Link>

      <main className="flex w-full flex-col items-start gap-4 row-start-2">
        <div className="w-full overflow-y-auto animate-rise-in motion-reduce:animate-none [animation-delay:0ms]">
          {posts.length > 0 ? (
            <ol className="list-inside list-decimal space-y-4 text-left w-full">
              {posts.map((post) => (
                <li
                  key={post.href}
                  className=" marker:text-amber-400/80 marker:text-xl"
                >
                  <Link
                    className="font-semibold text-lg text-white transition-colors hover:text-amber-100"
                    href={post.href}
                  >
                    {post.title}
                  </Link>
                  {post.date ? (
                    <div className="ml-5 mt-1 text-xs text-amber-400/80 font-(family-name:--font-rock-salt)">
                      ~ {formatBlogDate(post.date)}
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-sm text-white/60">
              No posts yet.
            </div>
          )}
        </div>
      </main>
    </>
  );
}
