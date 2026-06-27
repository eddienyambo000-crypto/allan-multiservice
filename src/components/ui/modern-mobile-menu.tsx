"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconSearch, IconKey, IconMap, IconHeart } from "@/components/icons";

type IconType = React.ElementType<{ className?: string }>;
interface NavItem { label: string; href: string; icon: IconType }

// Adapted from the "interactive menu" pattern → a real navigating bottom bar,
// styled in the Allan brand. Active item expands its label with a sky underline.
const ITEMS: NavItem[] = [
  { label: "home", href: "/", icon: IconHome },
  { label: "buy", href: "/properties", icon: IconSearch },
  { label: "rent", href: "/rentals", icon: IconKey },
  { label: "land", href: "/land", icon: IconMap },
  { label: "saved", href: "/saved", icon: IconHeart },
];

export function InteractiveMenu({ accentColor = "var(--color-sky)" }: { accentColor?: string }) {
  const pathname = usePathname();
  const activeIndex = Math.max(
    0,
    ITEMS.findIndex((it) => (it.href === "/" ? pathname === "/" : pathname.startsWith(it.href))),
  );
  const [active, setActive] = useState(activeIndex < 0 ? 0 : activeIndex);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const textRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => { setActive(activeIndex < 0 ? 0 : activeIndex); }, [activeIndex]);

  useEffect(() => {
    const set = () => {
      const item = itemRefs.current[active];
      const text = textRefs.current[active];
      if (item && text) item.style.setProperty("--lineWidth", `${text.offsetWidth}px`);
    };
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, [active]);

  return (
    <nav className="menu" role="navigation" style={{ "--component-active-color": accentColor } as React.CSSProperties}>
      {ITEMS.map((item, i) => {
        const isActive = i === active;
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className={`menu__item ${isActive ? "active" : ""}`}
            ref={(el) => { itemRefs.current[i] = el; }}
            style={{ "--lineWidth": "0px" } as React.CSSProperties}
          >
            <span className="menu__icon"><Icon className="icon" /></span>
            <strong className={`menu__text ${isActive ? "active" : ""}`} ref={(el) => { textRefs.current[i] = el; }}>
              {item.label}
            </strong>
          </Link>
        );
      })}
    </nav>
  );
}
