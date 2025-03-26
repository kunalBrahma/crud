"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddImage() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!image || !description) {
      setError("Image and description are required.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("description", description);

      const res = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      router.refresh();
      router.push("/");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <p className="text-red-500">{error}</p>}
      
      <input
        onChange={(e) => setImage(e.target.files[0])}
        className="border border-slate-500 px-8 py-2"
        type="file"
        accept="image/*"
        required
      />

      <input
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className="border border-slate-500 px-8 py-2"
        type="text"
        placeholder="Image Description"
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className="bg-green-600 font-bold text-white py-3 px-6 w-fit disabled:opacity-50"
      >
        {isLoading ? "Uploading..." : "Add Image"}
      </button>
    </form>
  );
}