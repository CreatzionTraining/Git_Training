"use client";
import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiCopy, FiCheck, FiLock, FiMail } from "react-icons/fi";

export default function UploadedFilePreview({ files, onGoBack }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Track password/email per file
  const [fileStates, setFileStates] = useState([]);

  useEffect(() => {
    setFileStates(
      files.map(() => ({
        passwordEnabled: false,
        password: "",
        emailTo: "",
        saved: false,
        loading: false
      }))
    );
  }, [files]);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const togglePassword = (idx) => {
    setFileStates((prev) =>
      prev.map((state, i) =>
        i === idx ? { ...state, passwordEnabled: !state.passwordEnabled, saved: false } : state
      )
    );
  };

  const setPassword = (idx, value) => {
    setFileStates((prev) =>
      prev.map((state, i) =>
        i === idx ? { ...state, password: value, saved: false } : state
      )
    );
  };

  const setEmail = (idx, value) => {
    setFileStates((prev) =>
      prev.map((state, i) =>
        i === idx ? { ...state, emailTo: value, saved: false } : state
      )
    );
  };

  const saveSettings = async (idx) => {
    const file = files[idx];
    const state = fileStates[idx];

    if (!file?.id) {
      alert("Missing file ID from server.");
      return;
    }

    if (state.passwordEnabled && !state.password) {
      alert("Please enter a password before saving.");
      return;
    }

    setFileStates((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, loading: true } : s))
    );

    try {
      const res = await fetch(`/api/get-file/${file.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passwordEnabled: state.passwordEnabled,
          password: state.password,
          emailTo: state.emailTo
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Save failed");
      }

      setFileStates((prev) =>
        prev.map((s, i) =>
          i === idx ? { ...s, loading: false, saved: true } : s
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
      setFileStates((prev) =>
        prev.map((s, i) => (i === idx ? { ...s, loading: false } : s))
      );
    }
  };

  return (
    <div className="flex flex-col items-center animate-fadeIn">
      {/* Back Button */}
      <div className="w-full flex justify-start">
        <button
          onClick={onGoBack}
          className="group flex items-center px-3 py-2 rounded-full 
            bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
            shadow-md hover:shadow-lg transition-all duration-300 
            overflow-hidden w-[42px] hover:w-[160px]"
        >
          <FiArrowLeft size={18} className="flex-shrink-0" /> 
          <span
            className="ml-2 whitespace-nowrap opacity-0 group-hover:opacity-100 
              transition-opacity duration-300"
          >
            Go To Upload
          </span>
        </button>
      </div>

      {/* Scrollable list */}
      <div className="w-full max-h-[70vh] overflow-y-auto space-y-6 mt-4">
        {files.map((file, index) => {
          const state = fileStates[index] || {};
          return (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/50 backdrop-blur-md rounded-2xl border shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              {/* Left: File Preview */}
              <div className="flex flex-col items-center bg-gray-50/60 backdrop-blur-sm p-5 rounded-xl shadow-sm">
                {file.type.startsWith("image/") ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="max-w-[85%] max-h-52 object-contain rounded-lg shadow-md border border-gray-200"
                  />
                ) : (
                  <div className="flex items-center justify-center w-36 h-36 rounded-lg bg-gray-200 text-gray-500 text-sm">
                    {file.type}
                  </div>
                )}
                <div className="mt-4 text-center">
                  <p className="text-base font-semibold text-gray-800 break-words">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {file.size} • {file.type}
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col justify-between space-y-5">
                {/* Short URL */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Short URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={file.shortUrl || ""}
                      className="border px-3 py-2 rounded-lg w-full text-gray-700 text-sm focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      onClick={() => copyToClipboard(file.shortUrl, index)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                      title="Copy Link"
                    >
                      {copiedIndex === index ? (
                        <FiCheck size={16} className="text-green-500" />
                      ) : (
                        <FiCopy size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                    <input
                      type="checkbox"
                      checked={state.passwordEnabled}
                      onChange={() => togglePassword(index)}
                      className="w-4 h-4"
                    />
                    <FiLock className="text-gray-500" />
                    Enable Password?
                  </label>
                  {state.passwordEnabled && (
                    <input
                      type="password"
                      value={state.password}
                      onChange={(e) => setPassword(index, e.target.value)}
                      placeholder="Enter password"
                      className="border px-3 py-2 rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-400"
                    />
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                    <FiMail className="text-gray-500" />
                    Send to Email
                  </label>
                  <input
                    type="email"
                    value={state.emailTo}
                    onChange={(e) => setEmail(index, e.target.value)}
                    placeholder="example@email.com"
                    className="border px-3 py-2 rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => saveSettings(index)}
                    disabled={state.loading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:opacity-90 text-sm shadow-md transition"
                  >
                    {state.loading
                      ? "Saving..."
                      : state.saved
                      ? "Saved ✓"
                      : "Save"}
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:opacity-90 text-sm shadow-md transition">
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
