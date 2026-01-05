import { useEffect, useState } from "react";

// Online placeholder images (stable). Want local? Put files in /public/images and replace URLs with "/images/1.jpg" etc.
const IMAGES = [
  "https://picsum.photos/id/1015/1200/500",
  "https://picsum.photos/id/1016/1200/500",
  "https://picsum.photos/id/1018/1200/500",
  "https://picsum.photos/id/1020/1200/500",
];

export default function Slider({ intervalMs = 2000 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return (
    <div className="relative w-full h-[320px] sm:h-[420px] overflow-hidden rounded-2xl shadow-lg">
      <div
        className="flex h-full transition-transform duration-700"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {IMAGES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`slide-${i}`}
            className="w-full h-full flex-shrink-0 object-cover"
            loading="eager"
          />
        ))}
      </div>

      {/* dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              index === i ? "bg-white" : "bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
