import { createUploadthing } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f({
    any: { maxFileSize: "10MB" },
  }).onUploadComplete(async ({ file }) => {
    console.log("✅ Upload complete:", file.url);
  }),
};
