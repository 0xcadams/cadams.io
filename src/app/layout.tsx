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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body
        className={cn(
          `${sans.variable} ${rockSalt.variable} antialiased transition-with-reduce`,
        )}
      >
        <div
          className={cn(
            "grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-10 font-[family-name:var(--font-sans)] text-white",
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
          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
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

          <svg
            className="absolute left-4 -top-8 overflow-visible blur-lg pointer-events-none select-none -z-10 scale-150"
            width="762"
            height="192"
            viewBox="0 0 762 192"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_1_22)">
              <g filter="url(#filter0_f_1_22)">
                <ellipse
                  cx="462"
                  cy="-3.5"
                  rx="136"
                  ry="27.5"
                  className="fill-amber-300"
                  fillOpacity="0.6"
                />
              </g>
              <g filter="url(#filter1_f_1_22)">
                <ellipse
                  cx="299"
                  cy="-3.5"
                  rx="136"
                  ry="27.5"
                  fillOpacity="0.6"
                  className="fill-amber-300"
                />
              </g>
            </g>
            <defs>
              <filter
                id="filter0_f_1_22"
                x="171"
                y="-186"
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
                y="-186"
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
              <clipPath id="clip0_1_22">
                <rect width="762" height="192" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </body>
    </html>
  );
}
