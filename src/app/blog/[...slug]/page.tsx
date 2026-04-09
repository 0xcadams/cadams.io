import type { Metadata } from "next";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "../../button";
import { Markdown } from "../_components/markdown";
import {
  formatBlogDate,
  getAllPostSlugs,
  getPostBySlug,
} from "@/lib/blog";

type BlogPostPageProps = {
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
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Blog | Chase Adams",
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.description,
    openGraph: {
      description: post.description,
      images: post.image ? [post.image] : undefined,
      title: post.title,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Link className="absolute top-4 left-4 items-center gap-2" href="/blog">
        <Button size="sm">
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Button>
      </Link>

      <main className="flex w-full flex-col items-start gap-5 row-start-2">
        <div className="animate-rise-in motion-reduce:animate-none [animation-delay:0ms] flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {post.title}
          </h1>
          <p className="text-white/70 leading-7">{post.description}</p>
          {post.date ? (
            <div className="text-sm text-amber-400/80 font-(family-name:--font-rock-salt)">
              ~ {formatBlogDate(post.date)}
            </div>
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
