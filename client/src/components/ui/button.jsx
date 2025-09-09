export function Button({ children, className = "", variant = "default", ...props }) {
  const base = "btn";
  const byVariant = {
    default: "btn-blue",
    outline: "btn-outline",
    destructive: "btn-red",
    success: "btn-green",
  };
  return (
    <button className={`${base} ${byVariant[variant] || ""} ${className}`} {...props}>
      {children}
    </button>
  );
}
