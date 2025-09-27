"use client";
import Image from "next/image";

export default function Home() {
  const tournaments = [
    { title: "Giải Bóng Đá Sinh Viên 2024", date: "12/2024", status: "Đã diễn ra" },
    { title: "Giải Phong Trào Quận 7", date: "03/2025", status: "Đã diễn ra" },
    { title: "Giải Doanh Nghiệp HCM", date: "11/2025", status: "Sắp diễn ra" },
  ];

  const promotions = [
    { title: "Giảm 20% khi đặt sân buổi sáng", time: "06:00 - 09:00" },
    { title: "Miễn phí nước suối cho khách đặt sân trước 3 ngày", time: "Tháng 10/2025" },
    { title: "Combo thuê sân + đồng phục giá rẻ", time: "Đang áp dụng" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-80 to-blue-80">
      <section className="text-center py-16 bg-green-700 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Sân Bóng Đá NĐ
        </h1>
        <p className="text-lg md:text-xl">
          Chuyên tổ chức các giải bóng lớn nhỏ sân 5 và sân 7
        </p>
        <p className="text-lg md:text-xl">
          Cho thuê sân bóng đá - trọng tài - bán các dịch vụ đi kèm 
        </p>
      </section>

      
      <section className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Hình ảnh sân bóng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl overflow-hidden shadow-md">
            <Image src="/image/san5.jpg" width={600} height={400} alt="Sân 5" className="object-cover w-full h-60" />
          </div>
          <div className="rounded-xl overflow-hidden shadow-md">
            <Image src="/image/san7.jpg" width={600} height={400} alt="Sân 7" className="object-cover w-full h-60" />
          </div>
          <div className="rounded-xl overflow-hidden shadow-md">
            <Image src="/image/baixe.jpg" width={600} height={400} alt="Bãi giữ xe" className="object-cover w-full h-60" />
          </div>
        </div>
      </section>

      
      <section className="bg-white py-12 px-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Các giải đấu
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tournaments.map((t, i) => (
            <div key={i} className="p-6 rounded-xl shadow-lg bg-blue-50">
              <h3 className="text-lg font-bold">{t.title}</h3>
              <p className="text-gray-600">Thời gian: {t.date}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                  t.status === "Đã diễn ra" ? "bg-gray-300 text-gray-700" : "bg-green-200 text-green-700"
                }`}
              >
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      
      <section className="py-12 px-6 bg-green-50">
        <h2 className="text-2xl font-bold text-yellow-600 mb-6 text-center">
          Chương trình ưu đãi
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {promotions.map((p, i) => (
            <div key={i} className="p-6 rounded-xl shadow-md bg-white">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-500">Thời gian: {p.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white text-center py-6 mt-12">
        <p>&copy; 2025 Sân Bóng Đá HCM | Hotline: 0909 123 456</p>
      </footer>
    </main>
  );
}
