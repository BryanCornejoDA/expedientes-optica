export function Label({ className = "", children, ...props }) {
  return (
    <label
      className={`block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
