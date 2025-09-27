export default function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div className="mb-3">
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
