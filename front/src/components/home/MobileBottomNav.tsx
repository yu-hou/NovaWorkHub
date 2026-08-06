"use client";

import { usePathname } from "next/navigation";

import {
  NavCourseIcon,
  NavHomeIcon,
  NavMoreIcon,
  NavPathIcon,
  NavRankIcon,
} from "@/components/home/home-icons";

const ITEMS = [
  { href: "/home", label: "首页", match: "/home", Icon: NavHomeIcon },
  {
    href: "/learning-paths",
    label: "路线",
    match: "/learning-paths",
    Icon: NavPathIcon,
  },
  { href: "/learning", label: "课程", match: "/learning", Icon: NavCourseIcon },
  {
    href: "/token-rank",
    label: "Token",
    match: "/token-rank",
    Icon: NavRankIcon,
  },
  { href: "/about", label: "更多", match: "/about", Icon: NavMoreIcon, more: true },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav" aria-label="移动端主导航">
      {ITEMS.map((item) => {
        const active =
          pathname === item.match ||
          (item.match !== "/home" && pathname.startsWith(`${item.match}/`));
        const Icon = item.Icon;
        return (
          <a
            key={item.href}
            className={`mobile-bottom-item${"more" in item && item.more ? " mobile-bottom-more" : ""}${
              active ? " active" : ""
            }`}
            href={item.href}
            aria-current={active ? "page" : undefined}
          >
            <span className="mobile-bottom-icon">
              <Icon />
            </span>
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
