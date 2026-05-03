"use client";

import { useEffect, useRef, useState } from "react";
import { useImageKit } from "@/hooks/useImageKit";
import Image from "next/image";

type ImageKitUploadProps = {
  folder?: string;
  onUploadSuccess: (url: string) => void;
  label?: string;
  className?: string;
  imageUrl?: string | null;
};

export function ImageKitUpload({
  folder = "default",
  onUploadSuccess,
  label = "Upload Image",
  className = "",
  imageUrl = null,
}: ImageKitUploadProps) {
  const { uploadImage, loading } = useImageKit(folder);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 👉 Preview
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  // 👉 Upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    const uploadedUrl = await uploadImage(selectedFile);
    if (uploadedUrl) {
      onUploadSuccess(uploadedUrl);
      handleClear(); // reuse clear logic
    }
  };

  // 👉 Clear properly
  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);

    // 🔥 reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 👉 Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div
      className={`flex w-full flex-col gap-4 ${className} border shadow border-base-300 rounded-md p-3`}
    >
      <div className="flex items-center justify-between">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <label>{label}</label>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleChange}
            disabled={loading}
            className="block text-sm text-base-content/50
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-primary/90 transition-all"
          />
        </div>

        {/* Preview */}
        <div className="relative">
          {(previewUrl || imageUrl) && (
            <span
              onClick={handleClear}
              className="absolute z-10 size-5 text-xs flex items-center justify-center rounded-full bg-red-500 text-white top-0 right-0 cursor-pointer opacity-80 hover:opacity-100 transition-all"
            >
              x
            </span>
          )}

          <Image
            width={200}
            height={200}
            className="size-16 object-cover rounded-lg shadow"
            src={
              loading
                ? "/assets/uploading.svg"
                : previewUrl || imageUrl || "/assets/placeholder-image.svg"
            }
            alt="Preview"
          />
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className="btn btn-primary"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
