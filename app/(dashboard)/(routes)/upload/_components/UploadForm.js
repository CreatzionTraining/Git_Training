"use client";
import React, { useState } from "react";
import AlertMsg from "./AlertMsg";
import FilePreview from "./FilePreview";

import { uploadToUploadThing } from "../../../../_utils/uploadFileClient";


function UploadForm() {
  const [file, setFile] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [uploading, setUploading] = useState(false);

  const onFileSelect = (file) => {
    if (file && file.size > 2000000) {
      setErrorMsg("File size exceeds 2MB");
      return;
    }
    setErrorMsg(null);
    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadToUploadThing(file);
      console.log("✅ Uploaded:", res);
      alert("File uploaded!");
      setFile(null);
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-12 h-12 mb-4 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021A4 4 0 0 0 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-lg md:text-2xl text-gray-500">
              <span className="font-semibold">Click to upload</span> or{" "}
              <strong className="text-primary">drag</strong> and{" "}
              <strong className="text-primary">drop</strong>
            </p>
            <p className="text-xs text-gray-500">Any file under 2MB</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={(event) => onFileSelect(event.target.files[0])}
          />
        </label>
      </div>

      {errorMsg ? <AlertMsg msg={errorMsg} /> : null}

      {file ? <FilePreview file={file} removeFile={() => setFile(null)} /> : null}

      <button
        disabled={!file || uploading}
        className="p-2 bg-primary text-white w-[30%] rounded-full mt-5 disabled:bg-gray-500"
        onClick={handleUpload}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default UploadForm;
