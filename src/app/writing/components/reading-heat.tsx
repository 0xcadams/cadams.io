"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "../../cn";

type ReadingHeatProps = {
  children: ReactNode;
  className?: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function ReadingHeat({ children, className }: ReadingHeatProps) {
  const articleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const article = articleRef.current;

    if (!article) {
      return;
    }

    const targets = Array.from(
      article.querySelectorAll<HTMLElement>("[data-reading-heat]"),
    );

    if (targets.length === 0) {
      return;
    }

    const scrollContainer = article.closest<HTMLElement>("[data-page-scroll]");
    const scrollTarget: HTMLElement | Window = scrollContainer ?? window;
    let activeTarget: HTMLElement | null = null;
    let animationFrame: number | null = null;

    const update = () => {
      animationFrame = null;

      const scrollBounds = scrollContainer?.getBoundingClientRect();
      const viewportTop = scrollBounds?.top ?? 0;
      const viewportHeight = scrollBounds?.height ?? window.innerHeight;
      const readingLine = viewportTop + viewportHeight * 0.3;
      const isAtTop = scrollContainer
        ? scrollContainer.scrollTop <= 2
        : window.scrollY <= 2;
      const isAtBottom = scrollContainer
        ? scrollContainer.scrollHeight -
            scrollContainer.scrollTop -
            scrollContainer.clientHeight <=
          2
        : document.documentElement.scrollHeight -
            window.scrollY -
            window.innerHeight <=
          2;
      let closestTarget = targets[0];
      let closestDistance = Number.POSITIVE_INFINITY;

      if (isAtTop) {
        closestTarget = targets[0];
      } else if (isAtBottom) {
        closestTarget = targets[targets.length - 1];
      } else {
        for (const target of targets) {
          const bounds = target.getBoundingClientRect();
          const distance =
            readingLine < bounds.top
              ? bounds.top - readingLine
              : readingLine > bounds.bottom
                ? readingLine - bounds.bottom
                : 0;

          if (distance < closestDistance) {
            closestTarget = target;
            closestDistance = distance;
          }
        }
      }

      if (closestTarget !== activeTarget) {
        activeTarget?.removeAttribute("data-reading-active");
        closestTarget.setAttribute("data-reading-active", "true");
        activeTarget = closestTarget;
      }

      const articleBounds = article.getBoundingClientRect();
      let progress = 0;

      if (!isAtTop) {
        progress = isAtBottom
          ? 1
          : clamp(
              (readingLine - articleBounds.top) /
                Math.max(articleBounds.height, 1),
              0,
              1,
            );
      }

      article.style.setProperty(
        "--reading-progress",
        `${(progress * 100).toFixed(3)}%`,
      );
    };

    const requestUpdate = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(update);
      }
    };

    const resizeObserver = new ResizeObserver(requestUpdate);

    resizeObserver.observe(article);
    if (scrollContainer) {
      resizeObserver.observe(scrollContainer);
    }

    scrollTarget.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    requestUpdate();

    return () => {
      activeTarget?.removeAttribute("data-reading-active");
      resizeObserver.disconnect();
      scrollTarget.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div className={cn("reading-heat w-full", className)} ref={articleRef}>
      <span aria-hidden="true" className="reading-heat-rail">
        <span className="reading-heat-progress" />
        <span className="reading-heat-ember" />
      </span>
      {children}
    </div>
  );
}
