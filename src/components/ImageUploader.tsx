"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, Image as ImageIcon, X, Check } from "lucide-react";
import Button from "@/components/ui/Button";

interface ImageUploaderProps {
  onImageReady: (dataUrl: string) => void;
  currentImage?: string;
}

export default function ImageUploader({ onImageReady, currentImage }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
        setConfirmed(false);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleConfirm = () => {
    if (preview) {
      onImageReady(preview);
      setConfirmed(true);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setConfirmed(false);
    onImageReady("");
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          isDragging
            ? "border-purple-500 bg-purple-50"
            : "border-purple-200 hover:border-purple-400 hover:bg-purple-50/50"
        }`}
      >
        {preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 rounded-2xl object-cover mx-auto shadow-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 flex items-center justify-center">
              <Upload size={28} className="text-purple-500" />
            </div>
            <div>
              <p className="font-medium text-purple-900">
                Arrastra una imagen o haz clic para subir
              </p>
              <p className="text-sm text-purple-500 mt-1">
                PNG, JPG o GIF - máximo 2MB
              </p>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="hidden"
        />
      </div>

      {preview && !confirmed && (
        <Button variant="gold" className="w-full" onClick={handleConfirm}>
          <Check size={18} /> Usar esta imagen
        </Button>
      )}

      {confirmed && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-700 text-center font-medium flex items-center justify-center gap-1.5">
          <Check size={16} /> Imagen guardada como avatar personalizado
        </div>
      )}
    </div>
  );
}
