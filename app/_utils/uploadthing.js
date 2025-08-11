import { createUploadthing } from "uploadthing/server";
import { z } from "zod"; // ✅ ADD this

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f({
    blob: { maxFileSize: "10MB" },
  })
    // ✅ Add Zod validation for input
    .input(
      z.object({
        email: z.string().email(),
        username: z.string().min(1),
      })
    )
    .onUploadComplete(async ({ file, metadata }) => {
      try {
        console.log("✅ Upload complete:", file.url);
        console.log("✅ Metadata received:", metadata); // ✅ check email, username

        // Optional: Add MongoDB insert here using metadata
      } catch (err) {
        console.error("❌ Error in onUploadComplete:", err);
      }
    }),
};
  