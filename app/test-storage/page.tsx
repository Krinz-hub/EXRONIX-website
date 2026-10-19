"use client";

import { useState } from "react";
import { uploadProductImage } from "@/lib/storageService";

export default function TestStoragePage() {
  const [image, setImage] = useState("");

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = await uploadProductImage(file);

    console.log(url);

    setImage(url);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <input
        type="file"
        onChange={handleUpload}
      />

      {image && (
        <img
          src={image}
          className="h-72 rounded-xl"
          alt="Uploaded"
        />
      )}
    </div>
  );
}