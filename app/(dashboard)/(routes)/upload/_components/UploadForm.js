"use client";
import React, { useEffect, useState, useRef } from "react";
import { uploadFiles } from "@/app/_utils/uploadthingClient";
import AlertMsg from "./AlertMsg";
import { useUser } from "@clerk/nextjs";
import { FiUploadCloud, FiX } from "react-icons/fi";
import UploadedFilePreview from "./UploadedFilePreview";

function UploadForm({ onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const { user, isLoaded } = useUser();
  const progressRef = useRef(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const onFileSelect = (newFiles) => {
    const validFiles = Array.from(newFiles).filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg(`"${file.name}" exceeds 10MB`);
        return false;
      }
      return true;
    });
    setFiles(validFiles);
    setProgress(0);
    setUploadedFiles([]);
    setErrorMsg(null);
  };

  const animateProgress = (target) => {
    cancelAnimationFrame(progressRef.current);
    const step = () => {
      setProgress((prev) => {
        if (prev >= target) return target;
        return prev + 1;
      });
      if (progress < target) {
        progressRef.current = requestAnimationFrame(step);
      }
    };
    step();
  };

  const handleUpload = async () => {
    if (files.length === 0) return setErrorMsg("No files selected.");
    if (!user || !isLoaded) return setErrorMsg("You must be signed in.");

    const email =
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      "unknown@example.com";
    const username = user?.fullName || user?.username || "Anonymous";

    setUploading(true);
    animateProgress(95);

    try {
      const res = await uploadFiles("fileUploader", {
        files,
        input: { email, username },
      });

      if (!res || res.length === 0) {
        setErrorMsg("Upload failed (no URLs)");
        setProgress(0);
        setUploading(false);
        return;
      }

      animateProgress(100);

      // ✅ Map files keeping the id from the server
      const fileDetails = res.map((serverFile, i) => ({
        id: serverFile.id || null, // Ensure id from backend is kept
        name: serverFile.name || files[i]?.name || "Untitled",
        size:
          serverFile.size != null
            ? (serverFile.size / 1024).toFixed(1) + " KB"
            : (files[i]?.size / 1024).toFixed(1) + " KB",
        type: serverFile.type || files[i]?.type || "Unknown",
        url: serverFile.uploadedUrl || serverFile.url || "",
        shortUrl: serverFile.shortUrl || "",
      }));

      setUploadedFiles(fileDetails);

      if (onUploadComplete) onUploadComplete();

      setTimeout(() => {
        setUploading(false);
      }, 400);
    } catch (err) {
      console.error("Upload failed:", err);
      setErrorMsg("Upload failed.");
      setProgress(0);
      setUploading(false);
    }
  };

  const handleGoBack = () => {
    setFiles([]);
    setProgress(0);
    setUploadedFiles([]);
    setErrorMsg(null);
  };

  return (
    <div className="text-center max-w-5xl mx-auto px-4">
      {uploadedFiles.length === 0 && (
        <h2 className="text-[20px] text-center m-5">
          Start <strong className="text-primary">Uploading</strong> File and{" "}
          <strong className="text-primary">Share</strong> it
        </h2>
      )}

      {uploadedFiles.length === 0 ? (
        <>
          {/* Dropzone */}
          <div
            className={`flex items-center justify-center w-full h-56 border-2 border-dashed rounded-2xl cursor-pointer
              bg-white/30 backdrop-blur-md shadow-lg transition-all duration-300
              ${dragOver ? "border-blue-500 bg-blue-50" : "border-blue-400"}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files.length > 0) {
                onFileSelect(e.dataTransfer.files);
              }
            }}
            onClick={() => document.getElementById("dropzone-file").click()}
          >
            <div className="flex flex-col items-center justify-center">
              <FiUploadCloud className="w-14 h-14 text-blue-500 mb-3" />
              <p className="mb-1 text-base md:text-lg text-gray-700 font-medium">
                <span className="font-semibold text-blue-600">
                  Click to upload
                </span>{" "}
                or <strong className="text-primary">drag & drop</strong>
              </p>
              <p className="text-xs text-gray-400">Max file size: 10MB each</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => onFileSelect(e.target.files)}
            />
          </div>

          {errorMsg && <AlertMsg msg={errorMsg} />}

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6 max-h-40 overflow-y-auto space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white/40 backdrop-blur-md border rounded-xl shadow px-4 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-800 break-all">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setFiles((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="p-1 hover:bg-gray-100 rounded-full transition"
                  >
                    <FiX size={16} className="text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {files.length > 0 && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="relative overflow-hidden p-3 text-white w-[50%] mt-8 rounded-full 
                font-medium shadow-lg transition-all duration-300 ease-in-out
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div
                className="absolute left-0 top-0 h-full bg-green-500 transition-all ease-in-out duration-300"
                style={{
                  width: `${progress}%`,
                  zIndex: 0,
                  borderRadius: "9999px",
                }}
              />
              <span className="relative z-10">
                {uploading
                  ? `Uploading... ${Math.floor(progress)}%`
                  : progress === 100
                  ? "✅ Uploaded"
                  : "Upload"}
              </span>
            </button>
          )}
        </>
      ) : (
        <UploadedFilePreview files={uploadedFiles} onGoBack={handleGoBack} />
      )}
    </div>
  );
}

export default UploadForm;
