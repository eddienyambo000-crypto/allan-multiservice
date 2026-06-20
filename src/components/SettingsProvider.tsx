"use client";

import { createContext, useContext, type ReactNode } from "react";
import { SITE, waLink as buildWa } from "@/lib/site";

export interface PublicSettings {
  phone: string;
  whatsapp: string;
  email: string;
}

const Ctx = createContext<PublicSettings>({
  phone: SITE.phone,
  whatsapp: SITE.whatsapp,
  email: SITE.email,
});

export function SettingsProvider({ value, children }: { value: PublicSettings; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Live contact settings (admin-editable), falling back to SITE defaults. */
export function useSettings(): PublicSettings & { wa: (msg: string) => string } {
  const s = useContext(Ctx);
  return { ...s, wa: (msg: string) => `https://wa.me/${s.whatsapp}?text=${encodeURIComponent(msg)}` };
}

export { buildWa };
