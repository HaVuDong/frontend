import Image from "next/image";

export default function ImageGallery() {
  const images = [
    { src: "/image/san5.jpg", alt: "Sân 5" },
    { src: "/image/san7.jpg", alt: "Sân 7" },
    { src: "/image/baixe.jpg", alt: "Bãi giữ xe" },
  ];

  return (
    <section className="max-w-6xl mx-auto py-12 px-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        Hình ảnh sân bóng
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((img, i) => (
          <div key={i} className="rounded-xl overflow-hidden shadow-md">
            <Image
              src={img.src}
              width={600}
              height={400}
              alt={img.alt}
              className="object-cover w-full h-60"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
