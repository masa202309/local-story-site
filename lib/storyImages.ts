import { supabase } from "./supabase";

export const STORY_IMAGE_BUCKET =
  process.env.NEXT_PUBLIC_STORY_IMAGE_BUCKET || "story-images";

function getFileExtension(file: File) {
  const name = file.name || "";
  const ext = name.includes(".") ? name.split(".").pop() : "";
  if (ext && /^[a-zA-Z0-9]+$/.test(ext)) return ext.toLowerCase();

  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";
  if (file.type === "image/jpeg") return "jpg";

  return "jpg";
}

function getUuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function uploadStoryImage(args: { file: File; userId: string }) {
  const extension = getFileExtension(args.file);
  const objectPath = `${args.userId}/${getUuid()}.${extension}`;

  const { error } = await supabase.storage
    .from(STORY_IMAGE_BUCKET)
    .upload(objectPath, args.file, {
      contentType: args.file.type || "image/*",
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  // Prefer a long-lived signed URL so images remain accessible even if the bucket is private
  // (e.g. when public access isn't enabled). Fallback to the public URL for public buckets.
  const { data: signedData } = await supabase.storage
    .from(STORY_IMAGE_BUCKET)
    .createSignedUrl(objectPath, 60 * 60 * 24 * 365 * 5);

  if (signedData?.signedUrl) {
    return { publicUrl: signedData.signedUrl, objectPath };
  }

  const { data } = supabase.storage
    .from(STORY_IMAGE_BUCKET)
    .getPublicUrl(objectPath);

  return { publicUrl: data.publicUrl, objectPath };
}

export async function ensureSignedStoryImageUrl(
  imageUrl: string | null | undefined
) {
  if (!imageUrl) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return imageUrl;

  // Already a signed URL or not a Supabase URL
  if (
    imageUrl.includes("/storage/v1/object/sign/") ||
    !imageUrl.startsWith(`${supabaseUrl}/storage/v1/object/`)
  ) {
    return imageUrl;
  }

  // Convert a public URL to a signed one for private buckets
  const publicPrefix = `${supabaseUrl}/storage/v1/object/public/`;
  if (!imageUrl.startsWith(publicPrefix)) return imageUrl;

  const remainder = imageUrl.slice(publicPrefix.length);
  const [bucket, ...pathParts] = remainder.split("/");
  const objectPath = pathParts.join("/");
  if (!bucket || !objectPath) return imageUrl;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(objectPath, 60 * 60 * 24 * 365 * 5);

  if (error || !data?.signedUrl) return imageUrl;
  return data.signedUrl;
}
