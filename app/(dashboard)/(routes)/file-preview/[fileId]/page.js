"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getFileById } from "@/lib/actions";
import Image from "next/image";
import { FaRegCopy } from "react-icons/fa";

export default function FilePreviewPage() {
  const { fileId } = useParams();
  const [file, setFile] = useState(null);

  useEffect(() => {
    async function fetchFile() {
      const data = await getFileById(fileId);
      setFile(data);
    }
    fetchFile();
  }, [fileId]);

  if (!file) {
    return <p className="text-center mt-10 text-gray-600">Loading preview...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">File Preview</h1>

      {file.type.startsWith("image/") ? (
        <Image
          src={file.url}
          alt={file.name}
          width={600}
          height={400}
          className="rounded-lg object-contain mx-auto"
        />
      ) : (
        <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-500 rounded">
          No image preview available
        </div>
      )}

      <div className="mt-4 space-y-2">
        <p><strong>File Name:</strong> {file.name}</p>
        <p><strong>File Type:</strong> {file.type}</p>
        <p><strong>File Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
        <div className="flex items-center space-x-2">
          <strong>File URL:</strong>
          <input
            type="text"
            readOnly
            value={file.url}
            className="flex-1 border rounded px-2 py-1 text-sm"
          />
          <button
            onClick={() => navigator.clipboard.writeText(file.url)}
            className="text-blue-600 hover:text-blue-800"
            title="Copy URL"
          >
            <FaRegCopy />
          </button>
        </div>
      </div>
    </div>
  );
}
    