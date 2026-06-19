import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Allan Multiservice Group handles your information — in plain language.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    h: "The short version",
    p: "We only ask for what we need to help you — like your name and phone number — so we can reply about a property, car, plot, or your search. We don't sell your information. Ever.",
  },
  {
    h: "What we collect",
    p: "When you send an inquiry, request a viewing, ask for listing alerts, or message us, we collect the details you choose to share: your name, phone number, optionally an email, and your message. That's it.",
  },
  {
    h: "Why we collect it",
    p: "Purely to serve you: to answer your question, arrange a viewing, send you listings that match what you want, and follow up on a deal. Nothing more.",
  },
  {
    h: "Who can see it",
    p: "Only the Allan Multiservice Group team. We never sell, rent, or trade your details to advertisers or third parties. We use trusted services (such as secure hosting and a database) to run the website, and they only process your data on our behalf.",
  },
  {
    h: "Your choices",
    p: "You can ask us to update or delete your information at any time — just message us. If you signed up for listing alerts and want to stop, reply STOP or tell us and we'll remove you immediately.",
  },
  {
    h: "Keeping it safe",
    p: "Your information is stored securely and access is limited to our team. We hold it only for as long as we need it to help you.",
  },
  {
    h: "A note on listings",
    p: "We do our best to keep prices, photos, and details accurate and to verify listings, but availability and terms can change. We'll always confirm the latest details with you before you commit to anything.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="container-x max-w-3xl pt-28 pb-24 sm:pt-32">
      <p className="eyebrow">Your privacy</p>
      <h1 className="mt-2 text-[clamp(2rem,5vw,3.2rem)] font-bold leading-tight">Privacy you can feel good about</h1>
      <p className="mt-4 text-[var(--color-ink-soft)]">
        We keep this simple and honest. Here&apos;s exactly what we do — and don&apos;t do — with your information.
      </p>

      <div className="mt-10 flex flex-col gap-6">
        {SECTIONS.map((s) => (
          <section key={s.h} className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">{s.h}</h2>
            <p className="mt-2 leading-relaxed text-[var(--color-ink-soft)]">{s.p}</p>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm text-[var(--color-muted)]">
        Questions about your privacy? Call us on {SITE.phoneDisplay} or message us on WhatsApp — a real person will help.
      </p>
    </div>
  );
}
