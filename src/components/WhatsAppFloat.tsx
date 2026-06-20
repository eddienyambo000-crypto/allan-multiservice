"use client";

import { SITE } from "@/lib/site";
import { useSettings } from "@/components/SettingsProvider";
import { IconWhatsApp } from "@/components/icons";

export default function WhatsAppFloat() {
  const { wa } = useSettings();
  return (
    <a
      href={wa(`Hi ${SITE.shortName}, I'd like to ask about a listing.`)}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.45)] transition-transform duration-200 hover:scale-110"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
      <IconWhatsApp className="relative h-7 w-7" />
    </a>
  );
}
