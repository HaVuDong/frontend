export default function FieldCard({ field }) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-md transition">
      <h3 className="font-bold text-lg">{field.name}</h3>
      <p>Loại: {field.type}</p>
      <p>Giá/giờ: {field.pricePerHour} VNĐ</p>
      <p>Trạng thái: 
        <span className={`ml-2 px-2 py-1 text-sm rounded 
          ${field.status === "available" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
          {field.status}
        </span>
      </p>
      <p className="text-sm text-gray-500 mt-2">{field.location}</p>
    </div>
  );
}
