export default function TournamentCard({ tournament }) {
  return (
    <div className="p-6 rounded-xl shadow-lg bg-blue-50">
      <h3 className="text-lg font-bold">{tournament.title}</h3>
      <p className="text-gray-600">Thời gian: {tournament.date}</p>
      <span
        className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
          tournament.status === "Đã diễn ra"
            ? "bg-gray-300 text-gray-700"
            : "bg-green-200 text-green-700"
        }`}
      >
        {tournament.status}
      </span>
    </div>
  );
}
