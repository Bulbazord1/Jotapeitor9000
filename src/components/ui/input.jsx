export function Input({ type = "text", value, onChange }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded"
    />
  );
}
