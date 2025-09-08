import * as React from "react";

export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
