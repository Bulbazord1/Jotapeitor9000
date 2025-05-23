export function Button({ children, onClick, size = "md", variant = "default" }) {
  const base = "px-4 py-2 rounded text-white";
  const sizeClass = size === "lg" ? "text-lg" : "text-sm";
  const variantClass = variant === "outline"
    ? "border border-blue-500 text-blue-500 bg-transparent"
    : "bg-blue-600";
  return (
    <button onClick={onClick} className={`${base} ${sizeClass} ${variantClass}`}>
      {children}
    </button>
  );
}
