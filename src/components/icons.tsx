// Lightweight Lucide-style SVG icons (no emoji-as-icon).
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

export const IconHome = (p: P) => (
  <svg {...base(p)}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-6h6v6" /></svg>
);
export const IconKey = (p: P) => (
  <svg {...base(p)}><circle cx="7.5" cy="15.5" r="4.5" /><path d="m10.5 12.5 8-8" /><path d="m16 6 2.5 2.5" /><path d="m19 3 2 2" /></svg>
);
export const IconMap = (p: P) => (
  <svg {...base(p)}><path d="M9 3 3 5.5v15L9 18l6 3 6-2.5v-15L15 6 9 3Z" /><path d="M9 3v15" /><path d="M15 6v15" /></svg>
);
export const IconCar = (p: P) => (
  <svg {...base(p)}><path d="M5 13 6.5 7.5A2 2 0 0 1 8.4 6h7.2a2 2 0 0 1 1.9 1.5L19 13" /><path d="M3 13h18v5H3z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></svg>
);
export const IconPin = (p: P) => (
  <svg {...base(p)}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
export const IconBed = (p: P) => (
  <svg {...base(p)}><path d="M3 7v11" /><path d="M3 13h18v5" /><path d="M21 18v-4a3 3 0 0 0-3-3H9v2" /><path d="M3 11h4a2 2 0 0 1 2 2" /></svg>
);
export const IconBath = (p: P) => (
  <svg {...base(p)}><path d="M4 12V6a2 2 0 0 1 3.4-1.4L9 6" /><path d="M3 12h18v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2Z" /><path d="M7 18v2M17 18v2" /></svg>
);
export const IconRuler = (p: P) => (
  <svg {...base(p)}><path d="m3 15 6 6 12-12-6-6L3 15Z" /><path d="m7 11 1.5 1.5M10 8l1.5 1.5M13 5l1.5 1.5" /></svg>
);
export const IconGauge = (p: P) => (
  <svg {...base(p)}><path d="M12 14 16 9" /><path d="M4 18a8 8 0 1 1 16 0" /><circle cx="12" cy="14" r="1" /></svg>
);
export const IconCalendar = (p: P) => (
  <svg {...base(p)}><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></svg>
);
export const IconGear = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></svg>
);
export const IconFuel = (p: P) => (
  <svg {...base(p)}><path d="M3 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" /><path d="M2 21h13" /><path d="M13 8h3l2.5 2.5V18a2 2 0 0 0 2-2v-4l-3-3" /></svg>
);
export const IconShield = (p: P) => (
  <svg {...base(p)}><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const IconCheck = (p: P) => (
  <svg {...base(p)}><path d="M20 6 9 17l-5-5" /></svg>
);
export const IconStar = (p: P) => (
  <svg {...base(p)}><path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6L12 17.8 6.6 19.6l1-6L3.3 9.4l6-.9L12 3Z" /></svg>
);
export const IconSearch = (p: P) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);
export const IconArrow = (p: P) => (
  <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconPhone = (p: P) => (
  <svg {...base(p)}><path d="M22 16.9v2.6a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1A19.5 19.5 0 0 1 4.7 13a19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 3.6 2h2.6a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L7.1 9.8a16 16 0 0 0 6 6l1.4-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.8 2Z" /></svg>
);
export const IconMenu = (p: P) => (
  <svg {...base(p)}><path d="M3 6h18M3 12h18M3 18h18" /></svg>
);
export const IconClose = (p: P) => (
  <svg {...base(p)}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const IconGlobe = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9Z" /></svg>
);
export const IconBell = (p: P) => (
  <svg {...base(p)}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
);
export const IconHeart = (p: P) => (
  <svg {...base(p)}><path d="M19.5 4.5a5 5 0 0 0-7 0L12 5l-.5-.5a5 5 0 0 0-7 7L12 19l7.5-7.5a5 5 0 0 0 0-7Z" /></svg>
);
export const IconShare = (p: P) => (
  <svg {...base(p)}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></svg>
);
export const IconVideo = (p: P) => (
  <svg {...base(p)}><rect x="2" y="6" width="14" height="12" rx="2" /><path d="m16 10 6-3v10l-6-3" /></svg>
);
export const IconCalc = (p: P) => (
  <svg {...base(p)}><rect x="4" y="2.5" width="16" height="19" rx="2" /><path d="M8 6h8M8 10h2M12 10h2M16 10h.01M8 14h2M12 14h2M16 14v4M8 18h6" /></svg>
);
export const IconDoc = (p: P) => (
  <svg {...base(p)}><path d="M14 2.5H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5Z" /><path d="M14 2.5v5h5M9 13h6M9 17h6" /></svg>
);
export const IconWhatsApp = (p: P) => (
  <svg width={p.width ?? 24} height={p.height ?? 24} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.07-.13-.27-.2-.57-.35Z" />
    <path d="M12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.1 1.52 5.83L.06 24l6.35-1.63A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0Zm0 21.94a9.94 9.94 0 0 1-5.07-1.39l-.36-.21-3.77.97 1-3.67-.24-.38A9.94 9.94 0 1 1 12 21.94Z" />
  </svg>
);
