import {
  formatWritingDate,
  getAllPostSlugs,
  getPostBySlug,
} from "@/lib/writing";
import {
  getWritingDateTransitionName,
  getWritingTitleTransitionName,
} from "@/lib/writing-view-transition";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { Button } from "../../button";
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
      <Link className="absolute top-4 left-4 items-center gap-2" href="/writing">
        <Button size="sm">
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Button>
      </Link>

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
            <ViewTransition
              default="none"
              name={getWritingDateTransitionName(post.slug)}
              share="writing-date-share"
            >
              <p className="ml-3 text-xs text-amber-400/80 font-(family-name:--font-rock-salt)">
                ~ {formatWritingDate(post.date)}
              </p>
            </ViewTransition>
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
