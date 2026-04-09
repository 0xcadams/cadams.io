import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { cn } from "../../cn";
import { linkVariants } from "../../link";

type MarkdownProps = {
  content: string;
  className?: string;
};

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-10 text-3xl font-semibold tracking-tight text-white first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 text-2xl font-semibold tracking-tight text-white">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-xl font-semibold tracking-tight text-white">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="mt-6 leading-7 text-white/80">{children}</p>,
  a: ({ children, href }) => {
    const isExternal = typeof href === "string" && /^https?:\/\//.test(href);

    return (
      <a
        className={cn(
          linkVariants(),
          "decoration-amber-300/60 hover:text-amber-100",
        )}
        href={href}
        rel={isExternal ? "noreferrer noopener" : undefined}
        target={isExternal ? "_blank" : undefined}
      >
        {children}
      </a>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="mt-8 border-l-2 border-amber-400/70 pl-4 text-white/75 italic">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="mt-6 list-disc space-y-2 pl-5 text-white/80 marker:text-amber-400/80">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-6 list-decimal space-y-2 pl-5 text-white/80 marker:text-amber-400/80">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1 leading-7">{children}</li>,
  img: ({ alt, src }) => {
    if (!src) {
      return null;
    }

    return (
      <img
        alt={alt ?? ""}
        className="mt-8 w-full rounded-3xl border border-white/10 object-cover shadow-[0_16px_50px_rgba(0,0,0,0.35)]"
        src={src}
      />
    );
  },
  hr: () => <hr className="mt-10 border-white/10" />,
  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90">
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }) => {
    const hasLanguageClass =
      typeof className === "string" && className.trim().length > 0;

    return (
      <code
        className={cn(
          "font-mono text-[0.95em]",
          hasLanguageClass
            ? "text-white/90"
            : "rounded bg-white/8 px-1.5 py-0.5 text-amber-100",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  strong: ({ children }) => (
    <strong className="font-semibold text-amber-200">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-white/75">{children}</em>,
};

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn("w-full text-left", className)}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
