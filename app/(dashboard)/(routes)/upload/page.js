"use client";
import React, { useState } from "react";
import UploadForm from "./_components/UploadForm";

function Upload() {
  const [isUploaded, setIsUploaded] = useState(false);

  return (
    <div className="p-5 px-8 md:px-28">
      

      <UploadForm
        isUploaded={isUploaded}
        onUploadComplete={() => setIsUploaded(true)}
        onGoBack={() => setIsUploaded(false)} // reset to start view
      />
    </div>
  );
}

export default Upload;
