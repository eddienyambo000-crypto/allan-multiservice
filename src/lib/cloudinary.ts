// Cloudinary unsigned upload — free ~25 GB media storage + CDN, no secret key
// in the browser. Configure with two public env vars:
//   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
//   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET  (an "unsigned" preset)

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryConfigured = Boolean(CLOUD && PRESET);

/** Upload a file (image or video) to Cloudinary; returns its secure URL. */
export async function uploadToCloudinary(file: File): Promise<string> {
  if (!CLOUD || !PRESET) throw new Error("Cloudinary is not configured.");
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", PRESET);
  // `auto` accepts both images and video.
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Cloudinary upload failed (${res.status}).`);
  const data = (await res.json()) as { secure_url?: string };
  if (!data.secure_url) throw new Error("Cloudinary upload returned no URL.");
  return data.secure_url;
}
