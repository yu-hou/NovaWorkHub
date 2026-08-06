"use client";

import { usePathname } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import {
  NavCourseIcon,
  NavGiftIcon,
  NavHomeIcon,
  NavMoreIcon,
  NavPathIcon,
} from "@/components/home/home-icons";

const BASE_ITEMS = [
  { href: "/home", label: "首页", match: "/home", Icon: NavHomeIcon },
  {
    href: "/learning-paths",
    label: "路线",
    match: "/learning-paths",
    Icon: NavPathIcon,
  },
  { href: "/learning", label: "课程", match: "/learning", Icon: NavCourseIcon },
  { href: "/benefits", label: "福利", match: "/benefits", Icon: NavGiftIcon },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const items = [
    ...BASE_ITEMS,
    isLoggedIn
      ? {
          href: "/account/security",
          label: "账户",
          match: "/account/security",
          Icon: NavMoreIcon,
          more: true,
        }
      : { href: "/login", label: "登录", match: "/login", Icon: NavMoreIcon, more: true },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="移动端主导航">
      {items.map((item) => {
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
