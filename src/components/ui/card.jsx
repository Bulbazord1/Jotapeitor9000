export function Card({ children, className }) {
  return <div className={`border rounded shadow-sm ${className}`}>{children}</div>;
}

export function CardContent({ children, className }) {
  return <div className={className}>{children}</div>;
}
