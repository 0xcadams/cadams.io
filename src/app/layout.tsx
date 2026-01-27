import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter, Rock_Salt } from "next/font/google";
import { Button } from "./button";
import { cn } from "./cn";
import { FireHoverMedia } from "./fire-hover-media";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const rockSalt = Rock_Salt({
  subsets: ["latin"],
  variable: "--font-rock-salt",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Chase Adams",
  description: "Chase Adams",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen-safe w-full">
      <body
        className={cn(
          `${sans.variable} ${rockSalt.variable} h-full w-full antialiased transition-with-reduce overflow-hidden relative`,
        )}
      >
        <div
          className={cn(
            "grid grid-rows-[20px_1fr_20px] max-h-full overflow-y-auto items-center justify-items-center h-full w-full p-8 gap-16 sm:p-10 font-sans text-white",
          )}
        >
          <main
            className={cn(
              "grid lg:grid-cols-[1.05fr_0.95fr] row-start-2 w-full gap-10 max-w-6xl",
            )}
          >
            <div className="max-w-lg">{children}</div>
            <FireHoverMedia />
          </main>
          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center animate-rise-in [animation-delay:620ms]">
            <a
              className="flex items-center gap-2"
              href="https://github.com/0xcadams"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="default">
                Github
              </Button>
            </a>
            <a
              className="flex items-center gap-2"
              href="https://x.com/0xcadams"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="default">
                X
              </Button>
            </a>
            <a
              className="flex items-center gap-2"
              href="https://www.linkedin.com/in/0xcadams/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="default">
                LinkedIn
              </Button>
            </a>
          </footer>

          <Analytics
            scriptSrc="https://cadams.io/api/data/script.js"
            endpoint="https://cadams.io/api/data"
          />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 blur pointer-events-none select-none -z-10 animate-rise-in [animation-delay:4700ms] max-w-150 w-full">
          <svg
            className="w-full"
            viewBox="0 0 762 192"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g mask="url(#fireEdgeFade)">
              <g filter="url(#filter0_f_1_22)">
                <ellipse
                  cx="462"
                  cy="195.5"
                  rx="136"
                  ry="27.5"
                  fill="url(#fireGlowPrimary)"
                  fillOpacity="0.6"
                />
              </g>
              <g filter="url(#filter1_f_1_22)">
                <ellipse
                  cx="299"
                  cy="195.5"
                  rx="136"
                  ry="27.5"
                  fill="url(#fireGlowSecondary)"
                  fillOpacity="0.7"
                />
              </g>
              <g filter="url(#filter2_f_1_22)">
                <path
                  d="M80 192 C120 135 170 120 230 90 C310 30 370 150 450 70 C520 10 600 140 670 90 C700 70 710 120 700 160 C680 210 600 220 520 220 C410 220 300 210 220 215 C150 220 105 210 80 192 Z"
                  fill="url(#fireTongue)"
                  fillOpacity="0.3"
                />
              </g>
            </g>
            <defs>
              <radialGradient
                id="fireEdgeFadeGradient"
                cx="381"
                cy="190"
                r="380"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="40%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <mask
                id="fireEdgeFade"
                maskUnits="userSpaceOnUse"
                x="-120"
                y="-220"
                width="1002"
                height="520"
              >
                <rect
                  x="-120"
                  y="-220"
                  width="1002"
                  height="520"
                  fill="url(#fireEdgeFadeGradient)"
                />
              </mask>
              <radialGradient id="fireGlowPrimary" cx="50%" cy="0%" r="75%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#fcd34d" stopOpacity="0.75" />
                <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.2" />
              </radialGradient>
              <radialGradient id="fireGlowSecondary" cx="50%" cy="0%" r="80%">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.8" />
                <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.65" />
                <stop offset="80%" stopColor="#d97706" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#92400e" stopOpacity="0.15" />
              </radialGradient>
              <linearGradient id="fireTongue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.3" />
              </linearGradient>
              <filter
                id="filter0_f_1_22"
                x="171"
                y="13"
                width="582"
                height="365"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="77.5"
                  result="effect1_foregroundBlur_1_22"
                />
              </filter>
              <filter
                id="filter1_f_1_22"
                x="8"
                y="13"
                width="582"
                height="365"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="77.5"
                  result="effect1_foregroundBlur_1_22"
                />
              </filter>
              <filter
                id="filter2_f_1_22"
                x="-80"
                y="-160"
                width="922"
                height="420"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="40"
                  result="effect1_foregroundBlur_1_22"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </body>
    </html>
  );
}
