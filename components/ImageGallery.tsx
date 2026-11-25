"use client";
import { useState, useEffect, useRef } from "react";

type ImageData = { key: string; url: string };

export default function ImageGallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    const res = await fetch("/api/fotos");
    const data = await res.json();
    if (Array.isArray(data)) setImages(data);
  };

  useEffect(() => {
    let isMounted = true;
    const loadInitialImages = async () => {
      const res = await fetch("/api/fotos");
      const data = await res.json();
      if (isMounted && Array.isArray(data)) {
        setImages(data);
      }
    };

    loadInitialImages();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("foto", file);

    await fetch("/api/fotos", { method: "POST", body: formData });
    if (fileInputRef.current) fileInputRef.current.value = "";
    await fetchImages();
    setIsUploading(false);
  };

  const handleDelete = async (key: string) => {
    if (!confirm("¿Seguro que quieres eliminar esta foto?")) return;
    await fetch(`/api/fotos?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
    });
    await fetchImages();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4 bg-gray-100 p-4 rounded-lg">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleUpload}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        {isUploading && (
          <span className="text-blue-600 font-semibold">Subiendo...</span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.key}
            className="relative group border rounded-lg overflow-hidden shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="S3" className="w-full h-40 object-cover" />
            <button
              onClick={() => handleDelete(img.key)}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              X
            </button>
          </div>
        ))}
      </div>

      {images.length === 0 && !isUploading && (
        <p className="text-center text-gray-500 mt-10">
          No hay fotos en el bucket.
        </p>
      )}
    </div>
  );
}
