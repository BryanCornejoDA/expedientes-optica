export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`
        w-full min-h-[96px] resize-y rounded-md border px-3 py-2 text-sm transition
        border-gray-300 bg-white text-gray-900 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
        dark:focus:ring-blue-400 dark:focus:border-blue-400
        ${className}
      `}
      {...props}
    />
  );
}
