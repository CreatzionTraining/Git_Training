import { connectDB } from "./mongo";
import Upload from "@/models/Upload";

export async function getFileById(fileId) {
  try {
    await connectDB();

    const file = await Upload.findById(fileId).lean();
    if (!file) return null;

    return {
      _id: file._id.toString(),
      name: file.fileName,
      type: file.fileType,
      size: file.fileSize,
      url: file.fileUrl,
      shortUrl: `https://yourdomain.com/d/${file._id}`, // optional
    };
  } catch (err) {
    console.error("❌ Error in getFileById:", err);
    return null;
  }
}
