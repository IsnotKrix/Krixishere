import { memo, useState } from "react";
import type { UIMessage } from "./types";
import { cn } from "@/lib/utils";
import { ImageLightbox } from "./image-lightbox";

export type UserMessageProps = {
  message: UIMessage;
  className?: string;
  enableImagePreview?: boolean;
};

type MessagePart = UIMessage["parts"][number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTextPart(part: MessagePart): part is { type: "text"; text: string } {
  return (
    part.type === "text" &&
    typeof (part as { text?: unknown }).text === "string"
  );
}

function getImageUrlFromPart(part: unknown): string | null {
  if (!isRecord(part)) return null;
  const type = part.type;
  if (typeof type !== "string") return null;

  if (type === "image") {
    const imagePart = part as { url?: string; image?: string };
    return imagePart.url ?? imagePart.image ?? null;
  }

  if (type === "data-image") {
    const dataPart = part as { data?: { url?: string } };
    return dataPart.data?.url ?? null;
  }

  if (type === "file") {
    const filePart = part as { mimeType?: string; url?: string; data?: string };
    if (filePart.mimeType?.startsWith("image/")) {
      if (filePart.url) return filePart.url;
      if (filePart.data) {
        return `data:${filePart.mimeType};base64,${filePart.data}`;
      }
    }
  }

  return null;
}

type FilePart = {
  type: "file";
  filename?: string;
  name?: string;
  fileName?: string;
  size?: number;
  mimeType?: string;
  url?: string;
};

function getFileFromPart(part: unknown) {
  if (!isRecord(part)) return null;
  if (part.type !== "file") return null;
  const filePart = part as FilePart;
  const filename =
    filePart.filename || filePart.name || filePart.fileName || "Attachment";
  const isImage = filePart.mimeType?.startsWith("image/") ?? false;
  if (isImage) return null;
  return {
    filename,
    size: filePart.size,
  };
}

export const UserMessage = memo(function UserMessage({
  message,
  className,
  enableImagePreview = true,
}: UserMessageProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const textParts = message.parts?.filter(isTextPart) ?? [];
  const text = textParts.map((p) => p.text).join("");

  const images: string[] = [];
  const files: Array<{ filename: string; size?: number }> = [];
  for (const part of message.parts ?? []) {
    const imageUrl = getImageUrlFromPart(part);
    if (imageUrl) images.push(imageUrl);
    const file = getFileFromPart(part);
    if (file) files.push(file);
  }

  if (!text && images.length === 0 && files.length === 0) return null;

  const lightboxImages = images.map((url, i) => ({
    id: `${message.id}-img-${i}`,
    url,
    filename: `image-${i + 1}`,
  }));

  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      {images.length > 0 &&
        images.map((url, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[200px] p-1.5 bg-white/4 rounded-xl",
              enableImagePreview && "cursor-pointer",
            )}
            onClick={enableImagePreview ? () => setLightboxIndex(i) : undefined}
          >
            <img
              src={url}
              alt="attachment"
              className="block object-cover max-w-[184px] max-h-[120px] rounded-lg"
            />
          </div>
        ))}
      {enableImagePreview && lightboxImages.length > 0 && (
        <ImageLightbox
          open={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          images={lightboxImages}
          initialIndex={lightboxIndex ?? 0}
        />
      )}
      {files.length > 0 && (
        <div className="flex flex-col items-end gap-2">
          {files.map((file, i) => (
            <div
              key={`${file.filename}-${i}`}
              className="px-3 py-2 bg-[#2a2a2a] rounded-xl text-xs text-zinc-400"
            >
              {file.filename}
              {file.size && (
                <span className="ml-1 text-zinc-600">
                  ({Math.round(file.size / 1024)}KB)
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      {text && (
        <div className="max-w-[calc(95%-40px)] ms-[70px]">
          <div className="px-3.5 py-2 text-sm rounded-[20px] bg-[#2a2a2a] text-zinc-200">
            <p className="leading-5 whitespace-pre-wrap break-words">{text}</p>
          </div>
        </div>
      )}
    </div>
  );
});
