"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "allan:favorites";
const RECENT_KEY = "allan:recent";

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}
function write(key: string, val: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new CustomEvent("allan:fav-change"));
  } catch {
    /* ignore quota */
  }
}

/** Hook: is `slug` favorited + a toggle. */
export function useFavorite(slug: string) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    const sync = () => setFav(read(KEY).includes(slug));
    sync();
    window.addEventListener("allan:fav-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("allan:fav-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);

  const toggle = useCallback(() => {
    const cur = read(KEY);
    const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [slug, ...cur].slice(0, 60);
    write(KEY, next);
  }, [slug]);

  return { fav, toggle };
}

export function useFavoriteCount() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const sync = () => setN(read(KEY).length);
    sync();
    window.addEventListener("allan:fav-change", sync);
    return () => window.removeEventListener("allan:fav-change", sync);
  }, []);
  return n;
}

/** Hook: the full list of favorited slugs (most-recent first). */
export function useFavorites(): { slugs: string[]; ready: boolean } {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => { setSlugs(read(KEY)); setReady(true); };
    sync();
    window.addEventListener("allan:fav-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("allan:fav-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { slugs, ready };
}

/** Hook: recently-viewed slugs (most-recent first). */
export function useRecent(): string[] {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => { setSlugs(read(RECENT_KEY)); }, []);
  return slugs;
}

export function pushRecent(slug: string) {
  if (typeof window === "undefined") return;
  const cur = read(RECENT_KEY).filter((s) => s !== slug);
  write(RECENT_KEY, [slug, ...cur].slice(0, 12));
}
