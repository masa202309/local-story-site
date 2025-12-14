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

  const { data } = supabase.storage
    .from(STORY_IMAGE_BUCKET)
    .getPublicUrl(objectPath);

  return { publicUrl: data.publicUrl, objectPath };
}

