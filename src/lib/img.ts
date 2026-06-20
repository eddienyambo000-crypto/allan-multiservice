/**
 * Deliver Cloudinary media already optimized (auto format + quality, width-capped)
 * straight from their CDN, so we don't double-optimize and risk Vercel's image cap.
 * Non-Cloudinary URLs pass through untouched.
 */
export function cld(url: string | undefined, width = 1200): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com/") || !url.includes("/upload/")) return url;
  if (/\/upload\/[^/]*(f_auto|q_auto)/.test(url)) return url; // already transformed
  return url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`);
}
