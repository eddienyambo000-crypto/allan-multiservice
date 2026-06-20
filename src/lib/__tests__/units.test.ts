import { describe, it, expect } from "vitest";
import { formatRWF, formatUSD, compactUSD } from "../money";
import { slugify } from "../admin";
import { parseFilters } from "../params";
import { locationFromSlug } from "../locations";
import { cld } from "../img";

describe("money", () => {
  it("formats RWF with thousands separators", () => {
    expect(formatRWF(280000000)).toBe("RWF 280,000,000");
  });
  it("converts to USD at the given rate", () => {
    expect(formatUSD(1_330_000, 1330)).toBe("$1,000");
  });
  it("compacts large USD", () => {
    expect(compactUSD(133_000_000, 1330)).toBe("$100k");
  });
});

describe("slugify", () => {
  it("kebab-cases and strips punctuation", () => {
    expect(slugify("Modern 4-Bedroom Villa, Kiyovu!")).toBe("modern-4-bedroom-villa-kiyovu");
  });
});

describe("parseFilters", () => {
  it("parses numeric + string params and clamps sort", () => {
    const f = parseFilters("car", { make: "Toyota", maxPrice: "30000000", sort: "bogus" });
    expect(f.vertical).toBe("car");
    expect(f.make).toBe("Toyota");
    expect(f.maxPrice).toBe(30000000);
    expect(f.sort).toBeUndefined();
  });
});

describe("locations", () => {
  it("resolves a known slug", () => {
    expect(locationFromSlug("kamonyi")?.name).toBe("Kamonyi");
  });
  it("returns null for unknown", () => {
    expect(locationFromSlug("atlantis")).toBeNull();
  });
});

describe("cloudinary url", () => {
  it("injects transforms into cloudinary urls", () => {
    expect(cld("https://res.cloudinary.com/x/image/upload/abc.jpg", 800)).toContain("f_auto,q_auto");
  });
  it("leaves non-cloudinary urls alone", () => {
    const u = "https://images.unsplash.com/photo.jpg";
    expect(cld(u)).toBe(u);
  });
});
