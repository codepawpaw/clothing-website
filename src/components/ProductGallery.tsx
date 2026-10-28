"use client";

import { useState } from "react";
import { ProductImage } from "./ProductImage";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];

  return (
    <div className="relative aspect-square bg-tile lg:aspect-auto lg:h-[calc(100vh-84px)] lg:min-h-[620px]">
      <ProductImage
        src={current}
        alt={name}
        sizes="(min-width: 1024px) 50vw, 100vw"
        preload
        className="object-contain"
      />
      {images.length > 1 && (
        <ul className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 lg:bottom-auto lg:left-5 lg:top-5 lg:max-h-[calc(100%-40px)] lg:translate-x-0 lg:flex-col lg:overflow-y-auto">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index}
                className={`relative block size-2.5 overflow-hidden rounded-full lg:size-12 lg:rounded-none lg:bg-tile ${
                  i === index ? "bg-ink lg:opacity-100" : "bg-line lg:opacity-50 lg:hover:opacity-100"
                }`}
              >
                <span className="hidden lg:block">
                  <ProductImage src={src} alt="" sizes="48px" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
