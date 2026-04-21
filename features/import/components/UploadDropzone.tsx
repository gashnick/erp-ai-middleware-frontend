"use client";

import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  isDisabled?: boolean;
}

const MAX_FILE_SIZE_MB = 10;

export function UploadDropzone({
  onFileSelect,
  selectedFile,
  onClear,
  isDisabled = false,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function validateFile(file: File): string | null {
    if (!file.name.endsWith(".csv")) return "Only CSV files are supported";
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024)
      return `File must be under ${MAX_FILE_SIZE_MB}MB`;
    return null;
  }

  function handleFile(file: File) {
    const err = validateFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onFileSelect(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (isDisabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ""; // reset input
  }

  if (selectedFile) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-100">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        {!isDisabled && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-md p-1 text-gray-400 hover:bg-blue-100 hover:text-gray-600 transition-colors"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => !isDisabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isDisabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 transition-colors",
          isDisabled
            ? "cursor-not-allowed border-gray-200 bg-gray-50"
            : isDragging
              ? "cursor-copy border-blue-400 bg-blue-50"
              : "cursor-pointer border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50",
        )}
        role="button"
        aria-label="Upload CSV file"
        tabIndex={isDisabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <UploadCloud className="h-6 w-6 text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            Drop your CSV file here, or{" "}
            <span className="text-blue-600">browse</span>
          </p>
          <p className="mt-0.5 text-xs text-gray-400">
            CSV files only · Max {MAX_FILE_SIZE_MB}MB
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleChange}
        className="hidden"
        disabled={isDisabled}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
