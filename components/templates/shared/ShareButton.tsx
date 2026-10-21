import React, { useState } from "react";

export interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  slug?: string;
  copiedText?: string;
  className?: string;
  id?: string;
  showToast?: boolean;
}

export function ShareButton({
  title,
  text,
  url,
  slug,
  copiedText = "Invitation link copied to clipboard!",
  className = "share-btn",
  id = "share",
  showToast = true,
}: ShareButtonProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleShare = async () => {
    const targetUrl =
      url ||
      (typeof window !== "undefined" && window.location.href
        ? window.location.href
        : slug
        ? `/c/${slug}`
        : "");

    const shareData: ShareData = {
      title,
      text: text || title,
      url: targetUrl,
    };

    const copyFallback = async () => {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(targetUrl);
          if (showToast) {
            setToastMessage(copiedText);
            setTimeout(() => setToastMessage(null), 2500);
          } else {
            alert(copiedText);
          }
        } else {
          const ta = document.createElement("textarea");
          ta.value = targetUrl;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          if (showToast) {
            setToastMessage(copiedText);
            setTimeout(() => setToastMessage(null), 2500);
          } else {
            alert(copiedText);
          }
        }
      } catch {
        prompt("Copy this link to share your invitation:", targetUrl);
      }
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          await copyFallback();
        }
      }
    } else {
      await copyFallback();
    }
  };

  return (
    <>
      <button
        id={id}
        className={className}
        onClick={handleShare}
        aria-label="Share Invitation"
      >
        ⤴
      </button>
      {toastMessage && <div className="toast">{toastMessage}</div>}
    </>
  );
}
