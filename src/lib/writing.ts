import matter from "gray-matter";
import { promises as fs } from "node:fs";
import path from "node:path";

const BLOG_DIRECTORY = path.join(process.cwd(), "content", "writing");

type WritingFrontmatter = {
  title: string;
  description: string;
  date?: string;
  image?: string;
};

export type WritingPost = WritingFrontmatter & {
  content: string;
  slug: string[];
  href: string;
};

type WritingFile = {
  filePath: string;
  modifiedAt: number;
};

type ParsedWritingPost = WritingPost & {
  modifiedAt: number;
};

export async function getAllPosts(): Promise<WritingPost[]> {
  const files = await getMarkdownFiles(BLOG_DIRECTORY);
  const posts = await Promise.all(files.map(readWritingPost));

  return posts
    .sort((left, right) => getSortTimestamp(right) - getSortTimestamp(left))
    .map(({ modifiedAt, ...post }) => post);
}

export async function getAllPostSlugs(): Promise<string[][]> {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}

export async function getPostBySlug(slug: string[]): Promise<WritingPost | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug.join("/") === slug.join("/")) ?? null;
}

export function formatWritingDate(date: string): string {
  const timestamp = getDateTimestamp(date);

  if (timestamp === null) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(timestamp);
}

async function getMarkdownFiles(directory: string): Promise<WritingFile[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return getMarkdownFiles(entryPath);
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        const stats = await fs.stat(entryPath);
        return [{ filePath: entryPath, modifiedAt: stats.mtimeMs }];
      }

      return [];
    }),
  );

  return files.flat();
}

async function readWritingPost(file: WritingFile): Promise<ParsedWritingPost> {
  const fileContents = await fs.readFile(file.filePath, "utf8");
  const { content, data } = matter(fileContents);

  if (!isRecord(data)) {
    throw new Error(`Expected frontmatter object in ${file.filePath}`);
  }

  const slug = getSlug(file.filePath);

  return {
    content,
    date: getOptionalDateField(data, "date", file.filePath),
    description: getRequiredField(data, "description", file.filePath),
    href: `/writing/${slug.map(encodeURIComponent).join("/")}`,
    image: getOptionalField(data, "image", file.filePath),
    modifiedAt: file.modifiedAt,
    slug,
    title: getRequiredField(data, "title", file.filePath),
  };
}

function getSortTimestamp(post: { date?: string; modifiedAt: number }): number {
  return getDateTimestamp(post.date) ?? post.modifiedAt;
}

function getDateTimestamp(date?: string): number | null {
  if (!date) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return Date.UTC(year, month - 1, day);
}

function getSlug(filePath: string): string[] {
  return path
    .relative(BLOG_DIRECTORY, filePath)
    .replace(/\.md$/, "")
    .split(path.sep);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getRequiredField(
  data: Record<string, unknown>,
  fieldName: string,
  filePath: string,
): string {
  const value = data[fieldName];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Expected ${fieldName} to be a non-empty string in ${filePath}`);
  }

  return value.trim();
}

function getOptionalField(
  data: Record<string, unknown>,
  fieldName: string,
  filePath: string,
): string | undefined {
  const value = data[fieldName];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`Expected ${fieldName} to be a string in ${filePath}`);
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function getOptionalDateField(
  data: Record<string, unknown>,
  fieldName: string,
  filePath: string,
): string | undefined {
  const value = data[fieldName];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : undefined;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  throw new Error(`Expected ${fieldName} to be a string or date in ${filePath}`);
}
