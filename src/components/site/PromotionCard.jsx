export default function PromotionCard({ promo }) {
  return (
    <div className="p-6 rounded-xl shadow-md bg-white">
      <h3 className="text-lg font-semibold">{promo.title}</h3>
      <p className="text-sm text-gray-500">Thời gian: {promo.time}</p>
    </div>
  );
}
