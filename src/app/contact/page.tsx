import type { Metadata } from "next";
import { SITE, waLink } from "@/lib/site";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { IconPin, IconPhone, IconWhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact Allan Multiservice Group, Kigali",
  description:
    "Talk to Allan Multiservice Group about buying, renting, or selling property, land, and cars in Kigali. We reply within the hour.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container-x pt-28 pb-24 sm:pt-32">
      <Reveal className="mb-10 max-w-2xl">
        <p className="eyebrow">Get in touch</p>
        <h1 className="mt-2 text-[clamp(2rem,5vw,3.4rem)] font-bold leading-tight">Talk to our team</h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">
          Buying, renting, or selling — tell us what you need. We reply to every message,
          usually within the hour.
        </p>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-4">
          <InfoRow icon={<IconPin className="h-5 w-5" />} label="Office" value={SITE.address} />
          <a href={`tel:${SITE.phone}`} className="block">
            <InfoRow icon={<IconPhone className="h-5 w-5" />} label="Phone" value={SITE.phoneDisplay} />
          </a>
          <a href={waLink(`Hi ${SITE.shortName}, I'd like to ask a question.`)} target="_blank" rel="noopener" className="block">
            <InfoRow icon={<IconWhatsApp className="h-5 w-5" />} label="WhatsApp" value="Chat with us now" accent />
          </a>
          <div className="mt-2 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)]">
            <iframe
              title="Allan Multiservice Group location"
              src="https://www.google.com/maps?q=Kigali%20Nyarugenge&output=embed"
              width="100%"
              height="260"
              loading="lazy"
              style={{ border: 0, display: "block" }}
            />
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}

function InfoRow({
  icon, label, value, accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-4 shadow-[var(--shadow-soft)] transition-colors hover:border-[var(--color-sky)]">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${accent ? "bg-[#E7F7EF] text-[#1FA971]" : "bg-[var(--color-sky-soft)] text-[var(--color-sky)]"}`}>
        {icon}
      </span>
      <div>
        <p className="font-[family-name:var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
        <p className="font-semibold text-[var(--color-ink)]">{value}</p>
      </div>
    </div>
  );
}
