export const uploadToUploadThing = async (file) => {
  const formData = new FormData();
  formData.append("files", file);

  const res = await fetch("/api/uploadthing", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json();
};
