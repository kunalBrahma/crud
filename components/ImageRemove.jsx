"use client";

import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ImageRemove({ id, onDelete }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this image?");
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/image`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      toast.success("Image deleted successfully");
      
      // Try multiple refresh strategies
      if (typeof onDelete === 'function') {
        // Option 1: Call parent component's callback
        onDelete(id);
      } else {
        // Option 2: Hard refresh
        window.location.reload();
        
        // Option 3: Navigate away and back (if above doesn't work)
        // router.push('/another-route');
        // setTimeout(() => router.push('/current-route'), 100);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete image");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
      aria-label="Delete image"
    >
      <HiOutlineTrash size={24} />
      {isDeleting && <span className="sr-only">Deleting...</span>}
    </button>
  );
}