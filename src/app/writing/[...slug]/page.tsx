import {
  formatWritingDate,
  getAllPostSlugs,
  getPostBySlug,
} from "@/lib/writing";
import { getWritingTitleTransitionName } from "@/lib/writing-view-transition";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { BackButton } from "../../back-button";
import { Markdown } from "../components/markdown";

type PostPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Writing | Chase Adams",
    };
  }

  return {
    title: `${post.title} | Writing`,
    description: post.description,
    openGraph: {
      description: post.description,
      images: post.image ? [post.image] : undefined,
      title: post.title,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <BackButton href="/writing" />

      <main className="flex w-full flex-col items-start gap-5 row-start-2">
        <div className="flex flex-col gap-3">
          <ViewTransition
            default="none"
            name={getWritingTitleTransitionName(post.slug)}
            share="writing-title-share"
          >
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {post.title}
            </h1>
          </ViewTransition>
          <div className="animate-rise-in motion-reduce:animate-none [animation-delay:0ms] flex flex-col gap-3">
            <p className="text-white/70 leading-7">{post.description}</p>
          </div>
          {post.date ? (
            <p className="ml-3 text-xs text-amber-400/80 animate-rise-in motion-reduce:animate-none [animation-delay:60ms] font-(family-name:--font-rock-salt)">
              ~ {formatWritingDate(post.date)}
            </p>
          ) : null}
        </div>

        <Markdown
          className="animate-rise-in motion-reduce:animate-none [animation-delay:120ms] pb-12"
          content={post.content}
        />
      </main>
    </>
  );
}
