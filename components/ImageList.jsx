"use client";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import ImageRemove from "./ImageRemove";
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import { useEffect, useState } from "react";

export default function ImageList() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/image");
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = await response.json();
      setImages(data.images);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageDeleted = (deletedId) => {
    setImages(images.filter((img) => img._id !== deletedId));
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) return <div className="text-center py-4">Loading images...</div>;
  if (error) return <div className="text-red-500 py-4">Error: {error}</div>;
  if (!images.length) return <div className="py-4">No images found</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img) => (
          <div
            key={img._id}
            className="flex flex-col border border-black rounded-sm p-4"
          >
            <div className="flex-1">
              <Image
                src={img.image}
                alt={img.description}
                width={800} 
                height={600} 
                quality={85} 
                className="w-full h-48 object-cover rounded-md"
                priority={images.indexOf(img) < 3}
                style={{
                  objectFit: "cover", 
                }}
              />
              <h4 className="text-center mt-2">{img.description}</h4>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <ImageRemove id={img._id} onDelete={handleImageDeleted} />
              <Link href={`/editImage/${img._id}`}>
                <HiPencilAlt size={24} className="hover:text-blue-500" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Toaster position="bottom-center" />
    </>
  );
}
