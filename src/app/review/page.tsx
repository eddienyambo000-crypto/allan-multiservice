import type { Metadata } from "next";
import ReviewForm from "@/components/ReviewForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Leave a Review",
  description: "Share your experience with Allan Multiservice Group.",
  alternates: { canonical: "/review" },
};

export default function ReviewPage() {
  return (
    <div className="container-x max-w-2xl pt-28 pb-24 sm:pt-32">
      <p className="eyebrow">We&apos;d love your feedback</p>
      <h1 className="mt-2 text-[clamp(2rem,5vw,3.2rem)] font-bold leading-tight">Leave a review</h1>
      <p className="mt-4 text-[var(--color-ink-soft)]">
        Did {SITE.shortName} help you buy, rent, or find a place? A few words from you helps the next family
        trust us — and it only takes a minute.
      </p>
      <div className="mt-8"><ReviewForm /></div>
    </div>
  );
}
