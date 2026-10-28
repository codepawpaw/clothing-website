"use client";

import { useRef, useState } from "react";
import { ProductImage } from "./ProductImage";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const current = images[index] ?? images[0];

  const scrollTo = (i: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    // min-w-0 stops the carousel's scroll width from stretching the page grid.
    <div className="min-w-0">
      {/* Mobile: swipeable carousel with dots below, as on lacoste.com */}
      <div
        ref={track}
        onScroll={(e) => {
          const el = e.currentTarget;
          const i = Math.round(el.scrollLeft / el.clientWidth);
          if (i !== index) setIndex(i);
        }}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
      >
        {(images.length ? images : [null]).map((src, i) => (
          <div key={src ?? i} className="relative aspect-square w-full shrink-0 snap-center bg-tile">
            <ProductImage src={src} alt={i === 0 ? name : ""} sizes="100vw" preload={i === 0} className="object-contain" />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="flex justify-center gap-2.5 pt-4 lg:hidden">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`size-2 rounded-full border ${i === index ? "border-ink bg-ink" : "border-[#b5b5b5] bg-white"}`}
            />
          ))}
        </div>
      )}

      {/* Desktop: main image with a vertical thumbnail strip */}
      <div className="relative hidden bg-tile lg:block lg:h-[calc(100vh-84px)] lg:min-h-[620px]">
        <ProductImage
          src={current}
          alt={name}
          sizes="50vw"
          className="object-contain"
        />
        {images.length > 1 && (
          <ul className="absolute left-5 top-5 flex max-h-[calc(100%-40px)] flex-col gap-2 overflow-y-auto">
            {images.map((src, i) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === index}
                  className={`relative block size-12 overflow-hidden bg-tile ${
                    i === index ? "opacity-100" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <ProductImage src={src} alt="" sizes="48px" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
