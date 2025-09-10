import { useEffect } from "react";

export default function Modal({ open, onClose, className = "", children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      {/* Content */}
      <div
        className={`relative z-10 w-full max-w-4xl rounded-xl border bg-white shadow-xl
                    border-gray-200 dark:border-gray-700 dark:bg-gray-800 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
