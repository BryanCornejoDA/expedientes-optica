import React from 'react';

export default function Loading({ size = 48, label = 'Cargando...' }) {
  const px = Math.max(12, Math.min(64, size));
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <svg
        className="animate-spin text-slate-600"
        style={{ height: px, width: px }}
        viewBox="0 0 50 50"
        aria-hidden="true"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          opacity="0.25"
        />
        <path
          fill="currentColor"
          d="M25 5a20 20 0 0 1 0 40 20 20 0 0 1 0-40"
          opacity="0.9"
        />
      </svg>
      <span className="mt-3 text-sm text-slate-500">{label}</span>
    </div>
  );
}
