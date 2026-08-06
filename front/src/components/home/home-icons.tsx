import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function NavHomeIcon(props: IconProps) {
  return (
    <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

export function NavPathIcon(props: IconProps) {
  return (
    <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path d="M4 18 9 13l4 3 7-9" />
      <path d="M15 7h5v5" />
      <circle cx="4" cy="18" r="1" />
      <circle cx="9" cy="13" r="1" />
    </svg>
  );
}

export function NavCourseIcon(props: IconProps) {
  return (
    <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H21v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M4 5.5v16" />
      <path d="M8 7h9" />
      <path d="M8 11h7" />
    </svg>
  );
}

export function NavCaseIcon(props: IconProps) {
  return (
    <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path d="M9 7V5.5A2.5 2.5 0 0 1 11.5 3h3A2.5 2.5 0 0 1 17 5.5V7" />
      <path d="M4 7h18v14H4z" />
      <path d="M4 12h18" />
      <path d="M10 12v2h4v-2" />
    </svg>
  );
}

export function NavEventIcon(props: IconProps) {
  return (
    <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path d="M7 3v4" />
      <path d="M17 3v4" />
      <path d="M4.5 6h17v16h-17z" />
      <path d="M4.5 10h17" />
      <path d="M8 14h3" />
      <path d="M14 14h3" />
      <path d="M8 18h3" />
    </svg>
  );
}

export function NavLiveIcon(props: IconProps) {
  return (
    <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8 6 4-6 4z" />
    </svg>
  );
}

export function NavGiftIcon(props: IconProps) {
  return (
    <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path d="M4 11h18v5H4z" />
      <path d="M6 16v6h16v-6" />
      <path d="M12 11v11" />
      <path d="M12 7.5c0-2-1.6-3.5-3.6-3.5C6.8 4 6 5.1 6 6.2 6 8.8 9.2 9 12 9z" />
      <path d="M12 7.5c0-2 1.6-3.5 3.6-3.5 1.6 0 2.4 1.1 2.4 2.2C18 8.8 14.8 9 12 9z" />
    </svg>
  );
}

export function NavRankIcon(props: IconProps) {
  return (
    <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path d="M5 21V9" />
      <path d="M12 21V4" />
      <path d="M19 21v-7" />
      <path d="M3.5 21h17" />
      <path d="m9 7 3-3 3 3" />
    </svg>
  );
}

export function NavSubmitIcon(props: IconProps) {
  return (
    <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path d="m4 12 16-8-5 16-3-7z" />
      <path d="m12 13 8-9" />
    </svg>
  );
}

export function NavAboutIcon(props: IconProps) {
  return (
    <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M15 5.5a3 3 0 0 1 0 5.8" />
      <path d="M17 14a5 5 0 0 1 4.5 5" />
    </svg>
  );
}

export function NavMoreIcon(props: IconProps) {
  return (
    <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <rect x="5.2" y="5.2" width="5.4" height="5.4" rx="1.35" />
      <rect x="13.4" y="5.2" width="5.4" height="5.4" rx="1.35" />
      <rect x="5.2" y="13.4" width="5.4" height="5.4" rx="1.35" />
      <path d="M15 16.1h4" />
      <path d="M17 14.1v4" />
    </svg>
  );
}

export function LearnersIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20c1.4-4 4-6 7.5-6s6.1 2 7.5 6" />
    </svg>
  );
}

export function ViewsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export const NAV_ICON_MAP = {
  home: NavHomeIcon,
  path: NavPathIcon,
  course: NavCourseIcon,
  case: NavCaseIcon,
  event: NavEventIcon,
  live: NavLiveIcon,
  gift: NavGiftIcon,
  rank: NavRankIcon,
  submit: NavSubmitIcon,
  about: NavAboutIcon,
} as const;
