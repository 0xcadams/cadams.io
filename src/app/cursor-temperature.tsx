"use client";

import { useEffect, useRef } from "react";
import { PRESENCE_NAME_EVENT } from "../presence-protocol";

const interactiveSelector = [
  "a[href]",
  "button",
  "summary",
  '[role="button"]',
  '[role="link"]',
  ".cursor-pointer",
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
].join(",");

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function CursorTemperature() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const pulseRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const pulse = pulseRef.current;
    const name = nameRef.current;

    if (!cursor || !pulse || !name) {
      return;
    }

    const root = document.documentElement;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let animationFrame = 0;
    let enabled = false;
    let interactive = false;
    let pressed = false;
    let visible = false;
    let x = -100;
    let y = -100;
    let previousX = x;
    let previousY = y;
    let previousMoveAt = 0;
    let lastMoveAt = 0;
    let lastFrameAt = 0;
    let speed = 0;
    let heat = 0.45;

    const isEligible = () => finePointer.matches && !reducedMotion.matches;

    const setVisible = (nextVisible: boolean) => {
      visible = nextVisible;
      cursor.dataset.visible = String(nextVisible);
    };

    const updateInteractiveTarget = (target: EventTarget | null) => {
      const candidate =
        target instanceof Element ? target.closest(interactiveSelector) : null;

      interactive = Boolean(
        candidate &&
          !candidate.matches(':disabled, [aria-disabled="true"], [data-disabled]'),
      );
      cursor.dataset.interactive = String(interactive);
    };

    const render = (timestamp: number) => {
      if (!enabled) {
        return;
      }

      const frameDuration = lastFrameAt
        ? clamp(timestamp - lastFrameAt, 1, 64)
        : 1000 / 60;
      const frameRatio = frameDuration / (1000 / 60);
      lastFrameAt = timestamp;

      speed *= Math.pow(0.82, frameRatio);

      const idleHeat = clamp((timestamp - lastMoveAt - 50) / 300, 0, 1);
      const movementCooling = clamp(speed / 1.1, 0, 1);
      const targetHeat = clamp(
        0.4 +
          idleHeat * 0.55 -
          movementCooling * 0.35 +
          (interactive ? 0.1 : 0) +
          (pressed ? 0.05 : 0),
        0.05,
        1,
      );
      const heatResponse = 1 - Math.pow(0.82, frameRatio);

      heat += (targetHeat - heat) * heatResponse;

      const scale = 0.75 + heat * 0.625 + (interactive ? 0.125 : 0);
      const lightness = 60 + heat * 24;
      const hue = 45 + heat * 35;
      const opacity = 0.45 + heat * 0.45;
      const glow = 1 + heat * 17;
      const glowOpacity = 0.04 + heat * 0.28;

      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      cursor.style.setProperty("--cursor-scale", scale.toFixed(3));
      cursor.style.setProperty("--cursor-opacity", opacity.toFixed(3));
      cursor.style.setProperty("--cursor-glow", `${glow.toFixed(2)}px`);
      cursor.style.setProperty(
        "--cursor-color",
        `oklch(${lightness.toFixed(2)}% 0.188 ${hue.toFixed(2)})`,
      );
      cursor.style.setProperty(
        "--cursor-glow-color",
        `oklch(76.9% 0.188 70.08 / ${glowOpacity.toFixed(3)})`,
      );

      animationFrame = window.requestAnimationFrame(render);
    };

    const enable = () => {
      if (enabled || !isEligible()) {
        return;
      }

      enabled = true;
      root.classList.add("temperature-cursor-enabled");
      lastFrameAt = performance.now();
      animationFrame = window.requestAnimationFrame(render);
    };

    const disable = () => {
      if (!enabled) {
        return;
      }

      enabled = false;
      interactive = false;
      pressed = false;
      setVisible(false);
      root.classList.remove("temperature-cursor-enabled");
      window.cancelAnimationFrame(animationFrame);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !isEligible()) {
        return;
      }

      enable();

      const timestamp = performance.now();

      if (visible && previousMoveAt > 0) {
        const elapsed = Math.max(timestamp - previousMoveAt, 1);
        const distance = Math.hypot(
          event.clientX - previousX,
          event.clientY - previousY,
        );
        const instantaneousSpeed = distance / elapsed;

        speed = speed * 0.65 + instantaneousSpeed * 0.35;
      } else {
        speed = 0;
      }

      x = event.clientX;
      y = event.clientY;
      previousX = x;
      previousY = y;
      previousMoveAt = timestamp;
      lastMoveAt = timestamp;
      updateInteractiveTarget(event.target);
      setVisible(true);
    };

    const handlePointerOver = (event: PointerEvent) => {
      if (enabled && event.pointerType === "mouse") {
        updateInteractiveTarget(event.target);
      }
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && !event.relatedTarget) {
        interactive = false;
        pressed = false;
        setVisible(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!enabled || event.pointerType !== "mouse") {
        return;
      }

      pressed = true;
      pulse.style.setProperty("--cursor-pulse-x", `${event.clientX}px`);
      pulse.style.setProperty("--cursor-pulse-y", `${event.clientY}px`);
      pulse.classList.remove("is-active");
      void pulse.offsetWidth;
      pulse.classList.add("is-active");
    };

    const handlePointerUp = () => {
      pressed = false;
    };

    const handlePreferenceChange = () => {
      if (!isEligible()) {
        disable();
      }
    };

    const handleWindowBlur = () => {
      pressed = false;
      setVisible(false);
    };

    const handlePresenceName = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;

      name.textContent = typeof detail === "string" ? detail : "";
    };

    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });
    document.addEventListener("pointerout", handlePointerOut, {
      passive: true,
    });
    document.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    document.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.addEventListener("pointercancel", handlePointerUp, {
      passive: true,
    });
    finePointer.addEventListener("change", handlePreferenceChange);
    reducedMotion.addEventListener("change", handlePreferenceChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener(PRESENCE_NAME_EVENT, handlePresenceName);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
      finePointer.removeEventListener("change", handlePreferenceChange);
      reducedMotion.removeEventListener("change", handlePreferenceChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener(PRESENCE_NAME_EVENT, handlePresenceName);
      root.classList.remove("temperature-cursor-enabled");
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="cursor-temperature"
        data-interactive="false"
        data-visible="false"
        ref={cursorRef}
      >
        <span className="cursor-temperature-core" />
        <span className="cursor-temperature-name" ref={nameRef} />
      </div>
      <div
        aria-hidden="true"
        className="cursor-temperature-pulse"
        ref={pulseRef}
      />
    </>
  );
}
