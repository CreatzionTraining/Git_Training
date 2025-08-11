// app/api/uploadthing/route.js
export const dynamic = "force-dynamic";

import { createUploadthing, createRouteHandler } from "uploadthing/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongo";
import Upload from "@/models/Upload";

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f({
    blob: { maxFileSize: "10MB" },
  })
    .input(
      z.object({
        email: z.string().email(),
        username: z.string().min(1),
      })
    )
    .middleware(async ({ input }) => {
      // metadata from client (email, username)
      console.log("📦 Middleware received input as metadata:", input);
      return input;
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Metadata received on server:", metadata);
      console.log("✅ File received on server:", file);

      await connectDB();

      // Create short URL code (first 8 chars of file.key or random)
      const shortCode =
        (file.key && file.key.slice(0, 8)) ||
        Math.random().toString(36).substring(2, 10);

      const newUpload = new Upload({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl: file.ufsUrl || file.url,
        folder: null,
        shortUrl: shortCode,

        // Security fields
        passwordEnabled: false,
        passwordHash: null,
        emailTo: null,

        // User info
        userEmail: metadata.email,
        username: metadata.username,
      });

      try {
        await newUpload.save();
        console.log("✅ Upload saved to MongoDB:", newUpload);
      } catch (error) {
        console.error("❌ Error saving to MongoDB:", error);
        throw error;
      }

      // ✅ Return MongoDB _id so frontend can use it later
      return {
        id: newUpload._id.toString(),
        uploadedUrl: file.ufsUrl || file.url,
        name: file.name,
        type: file.type,
        shortUrl: shortCode,
      };
    }),
};

const handler = createRouteHandler({
  router: ourFileRouter,
});

export { handler as GET, handler as POST };
