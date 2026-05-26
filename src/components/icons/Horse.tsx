import { SVGProps } from "react";

/**
 * Stylised horse icon — Lucide doesn't ship one.
 * Inherits `currentColor` so it themes like the rest.
 */
export function Horse({ size = 18, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3.5 21c.5-3 2.5-5.5 5.5-6.5" />
      <path d="M20 21c-.4-3.6-2-6.4-4.4-8 1.6-1.4 2.5-3 2.4-5.4-.1-1.9-.9-3.1-1.7-3.6-.4 1.2-1.1 1.8-2 2-1.2.3-2.7-.2-4.3.7-2 1-3.2 3-3.5 5.3-.2 1.8.4 3.3 1.6 4.6" />
      <path d="M16 6.5c.4-.5 1.1-.7 1.7-.5" />
      <circle cx="15.5" cy="7.5" r=".6" fill="currentColor" />
    </svg>
  );
}
