"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditImage({ id, initialImage, initialDescription }) {
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState(initialDescription);
  const [currentImage, setCurrentImage] = useState(initialImage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile);
      }
      formData.append("description", description);
      formData.append("currentImage", currentImage); // Needed for file deletion if replacing

      const res = await fetch(`/api/image/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update image");
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
    <div className="max-w-md mx-auto p-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="mb-4">
        <p className="font-semibold mb-2">Current Image:</p>
        <img 
          src={currentImage} 
          alt="Current" 
          className="w-full h-48 object-cover rounded-md mb-2"
        />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block mb-2 font-medium">New Image (leave empty to keep current):</label>
          <input
            onChange={(e) => setImageFile(e.target.files[0])}
            className="border border-slate-500 px-4 py-2 w-full"
            type="file"
            accept="image/*"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Description:</label>
          <input
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="border border-slate-500 px-4 py-2 w-full"
            type="text"
            placeholder="Image Description"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 font-bold text-white py-3 px-6 w-fit disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update Image"}
        </button>
      </form>
    </div>
  );
}