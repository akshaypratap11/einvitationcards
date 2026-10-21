/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { nanoid } from "nanoid";

interface UploadingTask {
  id: string;
  file: File;
  previewUrl: string;
  status: "optimizing" | "uploading" | "error";
  statusText: string;
  errorMessage?: string;
}

interface SingleModeProps {
  mode: "single";
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  placeholderText?: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "auto";
  tempId?: string;
  className?: string;
}

interface MultiModeProps {
  mode: "multi";
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  helperText?: string;
  maxFiles?: number;
  tempId?: string;
  className?: string;
}

export type PhotoUploaderProps = SingleModeProps | MultiModeProps;

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function isValidImageFile(file: File): boolean {
  if (ALLOWED_MIME_TYPES.includes(file.type)) return true;
  const fileName = file.name.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

export default function PhotoUploader(props: PhotoUploaderProps) {
  const { mode, label, helperText, tempId = "session", className = "" } = props;
  const maxFiles = mode === "multi" ? props.maxFiles ?? 12 : 1;

  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tasks, setTasks] = useState<UploadingTask[]>([]);
  const [draggedGalleryIdx, setDraggedGalleryIdx] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress and upload single file pipeline
  const processAndUploadFile = useCallback(
    async (file: File, taskId: string) => {
      // Step 1: Compress via browser-image-compression
      let compressedFile: File;
      try {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: "optimizing", statusText: "Optimizing..." }
              : t
          )
        );

        const compressionOptions = {
          maxSizeMB: 0.4,
          maxWidthOrHeight: 1400,
          useWebWorker: true,
          fileType: "image/webp",
        };

        compressedFile = await imageCompression(file, compressionOptions);
      } catch (compErr) {
        console.warn("Compression warning, proceeding with original file", compErr);
        compressedFile = file;
      }

      // Step 2: Upload to Supabase Storage bucket 'card-photos'
      try {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: "uploading", statusText: "Uploading..." }
              : t
          )
        );

        // Upload to admin /api/upload endpoint
        const formData = new FormData();
        formData.append("file", compressedFile);
        formData.append("tempId", tempId);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.status === 401) {
          alert("Session expired, please log in again");
          window.location.href = `/admin/login?from=${encodeURIComponent(window.location.pathname)}`;
          return;
        }

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.success) {
          throw new Error(uploadJson.error || "Failed to upload photo.");
        }

        const publicUrl = uploadJson.url;

        // Cleanup task and update form value
        setTasks((prev) => {
          const target = prev.find((t) => t.id === taskId);
          if (target?.previewUrl) {
            URL.revokeObjectURL(target.previewUrl);
          }
          return prev.filter((t) => t.id !== taskId);
        });

        if (props.mode === "single") {
          props.onChange(publicUrl);
        } else {
          const currentList = props.value || [];
          if (currentList.length < maxFiles) {
            props.onChange([...currentList, publicUrl]);
          }
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to upload photo. Please check connection and retry.";
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: "error",
                  statusText: "Upload failed",
                  errorMessage: message,
                }
              : t
          )
        );
      }
    },
    [maxFiles, props, tempId]
  );

  // Handle incoming raw files from drag or file input
  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      setErrorMessage(null);
      const incomingList = Array.from(files);

      if (incomingList.length === 0) return;

      // Validate allowed file types
      const invalidFiles = incomingList.filter((f) => !isValidImageFile(f));
      if (invalidFiles.length > 0) {
        setErrorMessage(
          "Only JPG, PNG, and WebP images are allowed. Other formats were skipped."
        );
      }

      const validFiles = incomingList.filter((f) => isValidImageFile(f));
      if (validFiles.length === 0) return;

      if (mode === "single") {
        const file = validFiles[0];
        const previewUrl = URL.createObjectURL(file);
        const taskId = nanoid(6);
        const newTask: UploadingTask = {
          id: taskId,
          file,
          previewUrl,
          status: "optimizing",
          statusText: "Optimizing...",
        };
        setTasks([newTask]);
        processAndUploadFile(file, taskId);
      } else {
        const currentCount = (props.value || []).length;
        const availableSlots = maxFiles - currentCount - tasks.length;

        if (availableSlots <= 0) {
          setErrorMessage(`Maximum ${maxFiles} photos allowed in gallery.`);
          return;
        }

        const filesToUpload = validFiles.slice(0, availableSlots);
        if (filesToUpload.length < validFiles.length) {
          setErrorMessage(
            `Added ${filesToUpload.length} photos. Reached maximum gallery limit of ${maxFiles}.`
          );
        }

        filesToUpload.forEach((file) => {
          const previewUrl = URL.createObjectURL(file);
          const taskId = nanoid(6);
          const newTask: UploadingTask = {
            id: taskId,
            file,
            previewUrl,
            status: "optimizing",
            statusText: "Optimizing...",
          };
          setTasks((prev) => [...prev, newTask]);
          processAndUploadFile(file, taskId);
        });
      }
    },
    [maxFiles, mode, processAndUploadFile, props.value, tasks.length]
  );

  const handleRetryTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    processAndUploadFile(task.file, taskId);
  };

  const handleCancelTask = (taskId: string) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === taskId);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((t) => t.id !== taskId);
    });
  };

  // Drag and drop events for the dropzone
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Multi-mode reordering handlers
  const handleMoveGalleryItem = (fromIdx: number, toIdx: number) => {
    if (props.mode !== "multi") return;
    const items = [...props.value];
    if (toIdx < 0 || toIdx >= items.length) return;
    const [moved] = items.splice(fromIdx, 1);
    items.splice(toIdx, 0, moved);
    props.onChange(items);
  };

  const handleRemoveGalleryItem = (idxToRemove: number) => {
    if (props.mode !== "multi") return;
    props.onChange(props.value.filter((_, idx) => idx !== idxToRemove));
  };

  const aspectRatioClass =
    props.mode === "single" && props.aspectRatio === "portrait"
      ? "aspect-[3/4]"
      : props.mode === "single" && props.aspectRatio === "landscape"
      ? "aspect-[16/9]"
      : props.mode === "single" && props.aspectRatio === "square"
      ? "aspect-square"
      : "aspect-square";

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header Label */}
      {(label || helperText) && (
        <div className="flex items-center justify-between">
          <div>
            {label && (
              <label className="block text-xs uppercase tracking-wider text-festive-gold font-semibold">
                {label}
              </label>
            )}
            {helperText && (
              <p className="text-[11px] text-festive-cream/70 mt-0.5">
                {helperText}
              </p>
            )}
          </div>

          {mode === "multi" && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-festive-gold/15 border border-festive-gold/30 text-festive-goldLight">
              {props.value.length} / {maxFiles}
            </span>
          )}
        </div>
      )}

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-300 hover:text-white text-xs font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* SINGLE PHOTO MODE */}
      {mode === "single" && (
        <div>
          {props.value ? (
            /* Uploaded Single Image Thumbnail */
            <div
              className={`relative rounded-2xl overflow-hidden border-2 border-festive-gold/40 shadow-md group ${aspectRatioClass} max-w-sm`}
            >
              <img
                src={props.value}
                alt={label || "Uploaded photo"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Action buttons overlay */}
              <div className="absolute inset-0 bg-festive-wine/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs p-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-festive-gold text-festive-wine font-semibold text-xs shadow-md hover:bg-festive-goldLight transition-colors"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => props.onChange("")}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/90 text-white font-semibold text-xs shadow-md hover:bg-rose-500 transition-colors"
                >
                  Remove
                </button>
              </div>

              {/* Floating remove icon in corner for easy touch on mobile */}
              <button
                type="button"
                onClick={() => props.onChange("")}
                aria-label="Remove photo"
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-festive-wine/90 border border-festive-gold/50 text-rose-300 hover:text-rose-100 flex items-center justify-center text-xs shadow-md"
              >
                ✕
              </button>
            </div>
          ) : tasks.length > 0 ? (
            /* Upload in progress for Single mode */
            <div
              className={`relative rounded-2xl overflow-hidden border-2 border-festive-gold/50 shadow-md flex items-center justify-center bg-festive-maroon/70 ${aspectRatioClass} max-w-sm`}
            >
              <img
                src={tasks[0].previewUrl}
                alt="Optimizing photo"
                className="w-full h-full object-cover opacity-40 blur-xs"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-2 bg-festive-wine/60 backdrop-blur-xs">
                {tasks[0].status === "error" ? (
                  <>
                    <span className="text-2xl">⚠️</span>
                    <p className="text-xs text-rose-300 font-semibold max-w-xs">
                      {tasks[0].errorMessage || "Upload failed"}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleRetryTask(tasks[0].id)}
                        className="px-3 py-1 rounded-lg bg-festive-gold text-festive-wine text-xs font-bold shadow"
                      >
                        Retry
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelTask(tasks[0].id)}
                        className="px-3 py-1 rounded-lg bg-festive-wine border border-festive-gold/40 text-festive-cream text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Animated golden spinner */}
                    <div className="w-8 h-8 rounded-full border-2 border-festive-gold/30 border-t-festive-gold animate-spin" />
                    <span className="text-xs font-semibold text-festive-goldLight tracking-wider uppercase">
                      {tasks[0].statusText}
                    </span>
                    <span className="text-[11px] text-festive-cream/70">
                      Compressing WebP format for fast loading
                    </span>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Dropzone Empty State */
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              className={`rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-2 select-none ${
                isDragging
                  ? "border-festive-gold bg-festive-gold/15 scale-[1.01]"
                  : "border-festive-gold/30 hover:border-festive-gold/60 bg-festive-maroon/40 hover:bg-festive-maroon/60"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-festive-gold/15 border border-festive-gold/40 flex items-center justify-center text-2xl text-festive-gold mb-1">
                📷
              </div>
              <p className="text-xs font-bold text-festive-goldLight">
                {props.placeholderText || "Tap to select or drag photo here"}
              </p>
              <p className="text-[11px] text-festive-cream/60">
                Supports JPG, PNG, WebP • Auto-compressed for high speed
              </p>
            </div>
          )}
        </div>
      )}

      {/* MULTI PHOTO MODE (GALLERY) */}
      {mode === "multi" && (
        <div className="space-y-4">
          {/* Gallery Items Grid */}
          {(props.value.length > 0 || tasks.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {/* Existing Uploaded Gallery Photos */}
              {props.value.map((imgUrl, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => setDraggedGalleryIdx(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedGalleryIdx !== null) {
                      handleMoveGalleryItem(draggedGalleryIdx, index);
                      setDraggedGalleryIdx(null);
                    }
                  }}
                  className={`group relative aspect-square rounded-xl overflow-hidden border border-festive-gold/30 bg-festive-wine shadow-sm hover:border-festive-gold transition-all cursor-grab active:cursor-grabbing ${
                    draggedGalleryIdx === index ? "opacity-50 ring-2 ring-festive-gold" : ""
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />

                  {/* Position Badge */}
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-festive-wine/80 border border-festive-gold/40 text-festive-goldLight shadow">
                    #{index + 1}
                  </span>

                  {/* Top Right Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveGalleryItem(index);
                    }}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-festive-wine/90 border border-festive-gold/40 text-rose-300 hover:text-rose-100 hover:bg-rose-900/60 flex items-center justify-center text-xs shadow transition-colors"
                    title="Remove photo"
                  >
                    ✕
                  </button>

                  {/* Touch screen move left/right controls */}
                  <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-festive-wine/80 backdrop-blur-xs rounded-lg p-1 border border-festive-gold/30">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveGalleryItem(index, index - 1)}
                      className="px-1.5 py-0.5 text-xs text-festive-goldLight disabled:opacity-30 hover:bg-festive-gold/20 rounded"
                      title="Move backward"
                    >
                      ←
                    </button>
                    <span className="text-[10px] text-festive-cream/70 font-mono">
                      Drag / Reorder
                    </span>
                    <button
                      type="button"
                      disabled={index === props.value.length - 1}
                      onClick={() => handleMoveGalleryItem(index, index + 1)}
                      className="px-1.5 py-0.5 text-xs text-festive-goldLight disabled:opacity-30 hover:bg-festive-gold/20 rounded"
                      title="Move forward"
                    >
                      →
                    </button>
                  </div>
                </div>
              ))}

              {/* Tasks currently uploading */}
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="relative aspect-square rounded-xl overflow-hidden border border-festive-gold/40 bg-festive-maroon flex items-center justify-center shadow-inner"
                >
                  <img
                    src={task.previewUrl}
                    alt="Upload thumbnail"
                    className="w-full h-full object-cover opacity-40 blur-xs"
                  />

                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-festive-wine/60 backdrop-blur-xs">
                    {task.status === "error" ? (
                      <div className="space-y-1">
                        <span className="text-lg">⚠️</span>
                        <p className="text-[10px] text-rose-300 font-semibold line-clamp-2">
                          {task.errorMessage || "Failed"}
                        </p>
                        <div className="flex items-center justify-center gap-1 pt-1">
                          <button
                            type="button"
                            onClick={() => handleRetryTask(task.id)}
                            className="px-2 py-0.5 rounded bg-festive-gold text-festive-wine text-[10px] font-bold shadow"
                          >
                            Retry
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelTask(task.id)}
                            className="px-1.5 py-0.5 rounded bg-festive-wine border border-festive-gold/40 text-festive-cream text-[10px]"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-5 h-5 rounded-full border-2 border-festive-gold/30 border-t-festive-gold animate-spin mb-1" />
                        <span className="text-[10px] font-bold text-festive-goldLight uppercase tracking-wider">
                          {task.statusText}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Gallery Dropzone (if slots remain) */}
          {props.value.length + tasks.length < maxFiles ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              className={`rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-2 select-none ${
                isDragging
                  ? "border-festive-gold bg-festive-gold/15 scale-[1.01]"
                  : "border-festive-gold/30 hover:border-festive-gold/60 bg-festive-maroon/40 hover:bg-festive-maroon/60"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-festive-gold/15 border border-festive-gold/40 flex items-center justify-center text-xl text-festive-gold">
                +
              </div>
              <p className="text-xs font-bold text-festive-goldLight">
                {props.value.length === 0
                  ? "Tap or drag photos to build your gallery"
                  : `Add more photos (${maxFiles - props.value.length - tasks.length} slots remaining)`}
              </p>
              <p className="text-[11px] text-festive-cream/60">
                Select multiple files from your computer or camera roll (JPG, PNG, WebP)
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-festive-wine/80 border border-festive-gold/20 text-center text-xs text-festive-goldLight">
              ✨ Gallery limit of {maxFiles} photos reached. You can remove or reorder photos above.
            </div>
          )}
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={mode === "multi"}
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(e.target.files);
          }
          // Reset input value so re-selecting the same file triggers onChange
          e.target.value = "";
        }}
        className="hidden"
      />

      {/* Mandatory Tip Note as per requirement */}
      <p className="text-[11px] text-festive-goldLight/70 italic flex items-center gap-1.5 pt-1">
        <span>💡</span>
        <span>Tip: use clear, bright photos. Max 12 in gallery.</span>
      </p>
    </div>
  );
}
