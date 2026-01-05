function Gallery() {
  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-xl shadow-lg transform hover:-translate-y-6 transition duration-300"
        >
          <img
            src={`https://picsum.photos/400/300?random=${i}`}
            alt={`Gallery ${i}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-bold text-xl transition">
            Image {i + 1}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Gallery;

