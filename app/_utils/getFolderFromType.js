export function getFolderFromType(mimeType) {
  if (mimeType.startsWith("image/")) return "images";
  if (mimeType.startsWith("video/")) return "videos";
  if (mimeType.includes("pdf") || mimeType.includes("msword") || mimeType.includes("officedocument"))
    return "documents";
  if (mimeType.startsWith("audio/")) return "audio";
  return "others";
}
