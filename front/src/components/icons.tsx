import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M4 10h10.2M10.8 5.8 15 10l-4.2 4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CourseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" {...props}>
      <path d="M4.8 5.6c0-1 .8-1.8 1.8-1.8h10.8c1 0 1.8.8 1.8 1.8v13.8H6.6a1.8 1.8 0 0 1-1.8-1.8v-12Z" />
      <path d="M8.2 7.4h7.2M8.2 10.4h5.8M6.8 19.4v-2.2h12.4" />
    </svg>
  );
}

export function LiveIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" {...props}>
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="m10.2 8.6 4.6 2.4-4.6 2.4V8.6ZM9 20h6M12 16v4" />
    </svg>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" {...props}>
      <path d="M8 4h8v2h3v2.5c0 2.5-1.6 4.4-3.9 4.9A5 5 0 0 1 13 15.7V18h3v2H8v-2h3v-2.3a5 5 0 0 1-2.1-2.3C6.6 12.9 5 11 5 8.5V6h3V4Z" />
      <path d="M8 8H6.8v.6c0 1.2.6 2.1 1.7 2.6M16 8h1.2v.6c0 1.2-.6 2.1-1.7 2.6" />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" {...props}>
      <path d="M5.4 15.3a7.2 7.2 0 1 1 3.3 3.2L5 19.2l.4-3.9Z" />
      <path d="M8.6 10.2h6.8M8.6 13h4.7" />
    </svg>
  );
}

export function FolderIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" {...props}>
      <path d="M5 7.2c0-1 .8-1.8 1.8-1.8h3.3l1.6 1.8h5.5c1 0 1.8.8 1.8 1.8v8.6c0 1-.8 1.8-1.8 1.8H6.8c-1 0-1.8-.8-1.8-1.8V7.2Z" />
      <path d="M8.2 11.2h7.6M8.2 14.2h5.4" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" {...props}>
      <path d="M12 20s6-5.2 6-10a6 6 0 0 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

export function CrownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path d="m3.5 7.5 4.7 4.2L12 5l3.8 6.7 4.7-4.2-1.8 11H5.3z" />
      <path d="M5.8 18.5h12.4" />
    </svg>
  );
}
