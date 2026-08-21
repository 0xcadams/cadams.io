"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const REVEAL_RADIUS = 96;
const DIMENSION_RADIUS = 224;

type EmberPosition = {
  x: number;
  y: number;
};

type EmberRecord = EmberPosition & {
  circle: SVGCircleElement;
};

type DimensionRecord = {
  line: SVGLineElement;
  text: SVGTextElement;
};

type MeasurementSpec =
  | {
      kind: "width";
      label: string;
      target: string;
    }
  | {
      from: string;
      kind: "vertical-gap";
      label: string;
      to: string;
    };

type ConstructionSpec = {
  measurements: MeasurementSpec[];
  outlines: string[];
};

type ConstructionRecord = {
  elements: SVGElement[];
  measure: () => void;
  targets: HTMLElement[];
};

type EmberIlluminationContextValue = {
  removeEmber: (id: string) => void;
  reportEmber: (id: string, position: EmberPosition) => void;
};

type EmberIlluminationProviderProps = {
  children: ReactNode;
};

const EmberIlluminationContext =
  createContext<EmberIlluminationContextValue | null>(null);

const createSvgElement = <K extends keyof SVGElementTagNameMap>(name: K) =>
  document.createElementNS(SVG_NAMESPACE, name);

const setLine = (
  line: SVGLineElement,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => {
  line.setAttribute("x1", x1.toFixed(2));
  line.setAttribute("y1", y1.toFixed(2));
  line.setAttribute("x2", x2.toFixed(2));
  line.setAttribute("y2", y2.toFixed(2));
};

const setVisibility = (elements: SVGElement[], visible: boolean) => {
  for (const element of elements) {
    element.setAttribute("visibility", visible ? "visible" : "hidden");
  }
};

const getConstructionSpec = (pathname: string): ConstructionSpec => {
  if (pathname === "/") {
    return {
      outlines: ["content-column"],
      measurements: [
        { kind: "width", label: "one column", target: "content-column" },
        {
          from: "home-introduction",
          kind: "vertical-gap",
          label: "two groups",
          to: "home-grounding",
        },
      ],
    };
  }

  if (pathname === "/projects") {
    return {
      outlines: ["projects-list"],
      measurements: [
        { kind: "width", label: "four rows", target: "projects-list" },
        {
          from: "project-0",
          kind: "vertical-gap",
          label: "rows",
          to: "project-1",
        },
      ],
    };
  }

  if (pathname === "/principles") {
    return {
      outlines: ["principles-accordion"],
      measurements: [
        {
          kind: "width",
          label: "one accordion",
          target: "principles-accordion",
        },
        {
          from: "principle-0",
          kind: "vertical-gap",
          label: "rows",
          to: "principle-1",
        },
      ],
    };
  }

  if (pathname === "/writing") {
    return {
      outlines: ["writing-list"],
      measurements: [
        { kind: "width", label: "post list", target: "writing-list" },
        {
          from: "writing-first-title",
          kind: "vertical-gap",
          label: "title and date",
          to: "writing-first-date",
        },
      ],
    };
  }

  if (pathname.startsWith("/writing/")) {
    return {
      outlines: ["article-body", "article-image"],
      measurements: [
        { kind: "width", label: "reading column", target: "article-body" },
        {
          from: "article-heading",
          kind: "vertical-gap",
          label: "heading and body",
          to: "article-body",
        },
      ],
    };
  }

  return {
    outlines: ["content-column"],
    measurements: [],
  };
};

const createWidthMeasurement = (
  layer: SVGGElement,
  target: HTMLElement,
  label: string,
): ConstructionRecord => {
  const dimension = createSvgElement("line");
  const startExtension = createSvgElement("line");
  const endExtension = createSvgElement("line");
  const startTick = createSvgElement("line");
  const endTick = createSvgElement("line");
  const text = createSvgElement("text");
  const elements = [
    dimension,
    startExtension,
    endExtension,
    startTick,
    endTick,
    text,
  ];

  dimension.setAttribute("class", "construction-line");
  startExtension.setAttribute("class", "construction-extension");
  endExtension.setAttribute("class", "construction-extension");
  startTick.setAttribute("class", "construction-line");
  endTick.setAttribute("class", "construction-line");
  text.setAttribute("class", "construction-label");
  text.setAttribute("text-anchor", "middle");
  layer.append(...elements);

  return {
    elements,
    targets: [target],
    measure: () => {
      const bounds = target.getBoundingClientRect();
      const placeAbove = bounds.top >= 28;
      const y = placeAbove ? bounds.top - 12 : bounds.bottom + 12;
      const edgeY = placeAbove ? bounds.top : bounds.bottom;

      setVisibility(elements, bounds.width > 0 && bounds.height > 0);
      setLine(dimension, bounds.left, y, bounds.right, y);
      setLine(startExtension, bounds.left, y, bounds.left, edgeY);
      setLine(endExtension, bounds.right, y, bounds.right, edgeY);
      setLine(startTick, bounds.left, y - 4, bounds.left, y + 4);
      setLine(endTick, bounds.right, y - 4, bounds.right, y + 4);
      text.setAttribute("x", (bounds.left + bounds.width / 2).toFixed(2));
      text.setAttribute("y", (placeAbove ? y - 6 : y + 13).toFixed(2));
      text.textContent = `${label} / ${Math.round(bounds.width)}px wide`;
    },
  };
};

const createVerticalGapMeasurement = (
  layer: SVGGElement,
  first: HTMLElement,
  second: HTMLElement,
  label: string,
): ConstructionRecord => {
  const dimension = createSvgElement("line");
  const startExtension = createSvgElement("line");
  const endExtension = createSvgElement("line");
  const startTick = createSvgElement("line");
  const endTick = createSvgElement("line");
  const text = createSvgElement("text");
  const elements = [
    dimension,
    startExtension,
    endExtension,
    startTick,
    endTick,
    text,
  ];

  dimension.setAttribute("class", "construction-line");
  startExtension.setAttribute("class", "construction-extension");
  endExtension.setAttribute("class", "construction-extension");
  startTick.setAttribute("class", "construction-line");
  endTick.setAttribute("class", "construction-line");
  text.setAttribute("class", "construction-label");
  layer.append(...elements);

  return {
    elements,
    targets: [first, second],
    measure: () => {
      const firstBounds = first.getBoundingClientRect();
      const secondBounds = second.getBoundingClientRect();
      const upper = firstBounds.top <= secondBounds.top ? firstBounds : secondBounds;
      const lower = upper === firstBounds ? secondBounds : firstBounds;
      const start = upper.bottom;
      const end = lower.top;
      const gap = end - start;
      const rightEdge = Math.max(upper.right, lower.right);
      const leftEdge = Math.min(upper.left, lower.left);
      const placeRight = rightEdge + 112 < window.innerWidth;
      const x = placeRight ? rightEdge + 14 : Math.max(12, leftEdge - 14);
      const extensionStart = placeRight ? rightEdge : leftEdge;

      setVisibility(elements, gap >= 0);

      if (gap < 0) {
        return;
      }

      setLine(dimension, x, start, x, end);
      setLine(startExtension, extensionStart, start, x, start);
      setLine(endExtension, extensionStart, end, x, end);
      setLine(startTick, x - 4, start, x + 4, start);
      setLine(endTick, x - 4, end, x + 4, end);
      text.setAttribute("x", (placeRight ? x + 8 : x - 8).toFixed(2));
      text.setAttribute("y", (start + gap / 2 + 4).toFixed(2));
      text.setAttribute("text-anchor", placeRight ? "start" : "end");
      text.textContent = `${label} / ${Math.round(gap)}px apart`;
    },
  };
};

export function EmberIlluminationProvider({
  children,
}: EmberIlluminationProviderProps) {
  const pathname = usePathname();
  const lensesRef = useRef<SVGGElement | null>(null);
  const constructionRef = useRef<SVGGElement | null>(null);
  const dimensionsRef = useRef<SVGGElement | null>(null);
  const embersRef = useRef(new Map<string, EmberRecord>());
  const requestVisualUpdateRef = useRef(() => {});

  const reportEmber = useCallback((id: string, { x, y }: EmberPosition) => {
    let ember = embersRef.current.get(id);

    if (!ember) {
      const circle = createSvgElement("circle");

      circle.setAttribute("r", String(REVEAL_RADIUS));
      circle.setAttribute("fill", "url(#ember-illumination-gradient)");
      lensesRef.current?.append(circle);
      ember = { circle, x, y };
      embersRef.current.set(id, ember);
    }

    ember.x = x;
    ember.y = y;
    ember.circle.setAttribute("cx", x.toFixed(2));
    ember.circle.setAttribute("cy", y.toFixed(2));
    requestVisualUpdateRef.current();
  }, []);

  const removeEmber = useCallback((id: string) => {
    const ember = embersRef.current.get(id);

    if (!ember) {
      return;
    }

    ember.circle.remove();
    embersRef.current.delete(id);
    requestVisualUpdateRef.current();
  }, []);

  useEffect(() => {
    let visualFrame = 0;
    const dimensionsByPair = new Map<string, DimensionRecord>();

    const updateDimensions = (embers: Array<[string, EmberRecord]>) => {
      const dimensionsLayer = dimensionsRef.current;

      if (!dimensionsLayer) {
        return;
      }

      const candidates: Array<{
        distance: number;
        first: [string, EmberRecord];
        key: string;
        second: [string, EmberRecord];
      }> = [];

      for (let firstIndex = 0; firstIndex < embers.length; firstIndex += 1) {
        for (
          let secondIndex = firstIndex + 1;
          secondIndex < embers.length;
          secondIndex += 1
        ) {
          const first = embers[firstIndex];
          const second = embers[secondIndex];
          const distance = Math.hypot(
            first[1].x - second[1].x,
            first[1].y - second[1].y,
          );

          if (distance <= DIMENSION_RADIUS) {
            const ids = [first[0], second[0]].sort();

            candidates.push({
              distance,
              first,
              key: `${ids[0]}:${ids[1]}`,
              second,
            });
          }
        }
      }

      candidates.sort(
        (left, right) =>
          left.distance - right.distance || left.key.localeCompare(right.key),
      );

      const pairedEmbers = new Set<string>();
      const activePairs = new Set<string>();

      for (const candidate of candidates) {
        const [firstId, first] = candidate.first;
        const [secondId, second] = candidate.second;

        if (pairedEmbers.has(firstId) || pairedEmbers.has(secondId)) {
          continue;
        }

        pairedEmbers.add(firstId);
        pairedEmbers.add(secondId);
        activePairs.add(candidate.key);

        let dimension = dimensionsByPair.get(candidate.key);

        if (!dimension) {
          const line = createSvgElement("line");
          const text = createSvgElement("text");

          line.setAttribute("class", "ember-dimension-line");
          text.setAttribute("class", "ember-dimension-text");
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("dominant-baseline", "central");
          dimensionsLayer.append(line, text);
          dimension = { line, text };
          dimensionsByPair.set(candidate.key, dimension);
        }

        setLine(dimension.line, first.x, first.y, second.x, second.y);
        dimension.text.setAttribute("x", ((first.x + second.x) / 2).toFixed(2));
        dimension.text.setAttribute("y", ((first.y + second.y) / 2).toFixed(2));
        dimension.text.textContent = `${Math.round(candidate.distance)}px`;
      }

      for (const [key, dimension] of dimensionsByPair) {
        if (!activePairs.has(key)) {
          dimension.line.remove();
          dimension.text.remove();
          dimensionsByPair.delete(key);
        }
      }
    };

    const updateVisuals = () => {
      visualFrame = 0;
      updateDimensions(Array.from(embersRef.current.entries()));
    };

    const requestVisualUpdate = () => {
      if (!visualFrame) {
        visualFrame = window.requestAnimationFrame(updateVisuals);
      }
    };

    requestVisualUpdateRef.current = requestVisualUpdate;

    return () => {
      requestVisualUpdateRef.current = () => {};
      window.cancelAnimationFrame(visualFrame);

      for (const dimension of dimensionsByPair.values()) {
        dimension.line.remove();
        dimension.text.remove();
      }

      dimensionsByPair.clear();
    };
  }, []);

  useEffect(() => {
    const constructionLayer = constructionRef.current;

    if (!constructionLayer) {
      return;
    }

    let setupFrame = 0;
    let layoutFrame = 0;
    let settleTimer = 0;
    let resizeObserver: ResizeObserver | null = null;
    let records: ConstructionRecord[] = [];

    const requestLayout = () => {
      if (!layoutFrame) {
        layoutFrame = window.requestAnimationFrame(() => {
          layoutFrame = 0;

          for (const record of records) {
            record.measure();
          }
        });
      }
    };

    const setup = () => {
      const nodes = new Map<string, HTMLElement>();

      for (const node of document.querySelectorAll<HTMLElement>(
        "[data-construction-node]",
      )) {
        const name = node.dataset.constructionNode;

        if (name && !nodes.has(name)) {
          nodes.set(name, node);
        }
      }

      const spec = getConstructionSpec(pathname);

      for (const outlineName of spec.outlines) {
        const target = nodes.get(outlineName);

        if (!target) {
          continue;
        }

        const element = createSvgElement("rect");

        element.setAttribute("class", "ember-illumination-outline");
        constructionLayer.append(element);
        records.push({
          elements: [element],
          targets: [target],
          measure: () => {
            const bounds = target.getBoundingClientRect();
            const borderRadius = Number.parseFloat(
              window.getComputedStyle(target).borderTopLeftRadius,
            );

            element.setAttribute("x", bounds.left.toFixed(2));
            element.setAttribute("y", bounds.top.toFixed(2));
            element.setAttribute("width", bounds.width.toFixed(2));
            element.setAttribute("height", bounds.height.toFixed(2));
            element.setAttribute(
              "rx",
              Number.isFinite(borderRadius) ? String(borderRadius) : "0",
            );
          },
        });
      }

      for (const measurement of spec.measurements) {
        if (measurement.kind === "width") {
          const target = nodes.get(measurement.target);

          if (target) {
            records.push(
              createWidthMeasurement(
                constructionLayer,
                target,
                measurement.label,
              ),
            );
          }
        } else if (measurement.kind === "vertical-gap") {
          const first = nodes.get(measurement.from);
          const second = nodes.get(measurement.to);

          if (first && second) {
            records.push(
              createVerticalGapMeasurement(
                constructionLayer,
                first,
                second,
                measurement.label,
              ),
            );
          }
        }
      }

      resizeObserver = new ResizeObserver(requestLayout);
      const observedTargets = new Set(
        records.flatMap((record) => record.targets),
      );

      for (const target of observedTargets) {
        resizeObserver.observe(target);
      }

      document.addEventListener("scroll", requestLayout, true);
      window.addEventListener("resize", requestLayout, { passive: true });
      requestLayout();
      settleTimer = window.setTimeout(requestLayout, 800);
    };

    setupFrame = window.requestAnimationFrame(setup);

    return () => {
      document.removeEventListener("scroll", requestLayout, true);
      window.removeEventListener("resize", requestLayout);
      resizeObserver?.disconnect();
      window.clearTimeout(settleTimer);
      window.cancelAnimationFrame(setupFrame);
      window.cancelAnimationFrame(layoutFrame);

      for (const record of records) {
        for (const element of record.elements) {
          element.remove();
        }
      }

      records = [];
    };
  }, [pathname]);

  useEffect(
    () => () => {
      for (const ember of embersRef.current.values()) {
        ember.circle.remove();
      }

      embersRef.current.clear();
    },
    [],
  );

  return (
    <EmberIlluminationContext.Provider value={{ removeEmber, reportEmber }}>
      {children}
      <svg
        aria-hidden="true"
        className="ember-illumination"
        focusable="false"
      >
        <defs>
          <radialGradient id="ember-illumination-gradient">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="83.333%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask
            id="ember-illumination-mask"
            height="100%"
            maskContentUnits="userSpaceOnUse"
            maskUnits="userSpaceOnUse"
            width="100%"
            x="0"
            y="0"
          >
            <g ref={lensesRef} />
          </mask>
        </defs>
        <g mask="url(#ember-illumination-mask)">
          <g ref={constructionRef} />
        </g>
        <g ref={dimensionsRef} />
      </svg>
    </EmberIlluminationContext.Provider>
  );
}

export function useEmberIllumination() {
  const context = useContext(EmberIlluminationContext);

  if (!context) {
    throw new Error(
      "useEmberIllumination must be used inside EmberIlluminationProvider",
    );
  }

  return context;
}
