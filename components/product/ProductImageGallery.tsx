"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  /* =====================================================
     CLEAN IMAGES
  ===================================================== */

  const validImages = Array.from(
    new Set(
      (images ?? []).filter(
        (image): image is string =>
          typeof image === "string" &&
          image.trim().length > 0
      )
    )
  );

  const [selectedImage, setSelectedImage] =
    useState(0);

  /* =====================================================
     NO IMAGE
  ===================================================== */

  if (validImages.length === 0) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl border border-white/10 bg-[#0e1219]/70 text-gray-400 sm:rounded-3xl">
        No Image Available
      </div>
    );
  }

  /* =====================================================
     SAFE IMAGE INDEX
  ===================================================== */

  const safeSelectedImage =
    selectedImage >= validImages.length
      ? 0
      : selectedImage;

  /* =====================================================
     PREVIOUS IMAGE
  ===================================================== */

  const goToPrevious = () => {
    setSelectedImage((current) => {
      if (current === 0) {
        return validImages.length - 1;
      }

      return current - 1;
    });
  };

  /* =====================================================
     NEXT IMAGE
  ===================================================== */

  const goToNext = () => {
    setSelectedImage((current) => {
      if (
        current ===
        validImages.length - 1
      ) {
        return 0;
      }

      return current + 1;
    });
  };

  return (
    <div className="w-full min-w-0">
      {/* =================================================
          MAIN IMAGE CONTAINER
      ================================================= */}

      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/15 bg-[#0e1219]/80 liquid-glass shadow-2xl sm:rounded-3xl">
        <Image
          key={validImages[safeSelectedImage]}
          src={validImages[safeSelectedImage]}
          alt={`${productName} - Image ${
            safeSelectedImage + 1
          }`}
          fill
          priority={safeSelectedImage === 0}
          sizes="
            (max-width: 640px) 100vw,
            (max-width: 1024px) 70vw,
            50vw
          "
          className="object-cover transition-opacity duration-300"
        />

        {/* =================================================
            PREVIOUS BUTTON
        ================================================= */}

        {validImages.length > 1 && (
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous product image"
            className="
              absolute
              left-3
              top-1/2
              z-20
              flex
              h-10
              w-10
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/20
              bg-black/60
              text-2xl
              font-medium
              text-white
              shadow-lg
              backdrop-blur-md
              transition
              hover:bg-[#1677FF]
              hover:border-[#1677FF]
              active:scale-95
              sm:h-11
              sm:w-11
            "
          >
            ‹
          </button>
        )}

        {/* =================================================
            NEXT BUTTON
        ================================================= */}

        {validImages.length > 1 && (
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next product image"
            className="
              absolute
              right-3
              top-1/2
              z-20
              flex
              h-10
              w-10
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/20
              bg-black/60
              text-2xl
              font-medium
              text-white
              shadow-lg
              backdrop-blur-md
              transition
              hover:bg-[#1677FF]
              hover:border-[#1677FF]
              active:scale-95
              sm:h-11
              sm:w-11
            "
          >
            ›
          </button>
        )}

        {/* =================================================
            IMAGE COUNTER
        ================================================= */}

        {validImages.length > 1 && (
          <div
            className="
              absolute
              bottom-3
              right-3
              z-20
              rounded-full
              bg-black/70
              px-3
              py-1.5
              text-xs
              font-semibold
              text-white
              backdrop-blur
            "
          >
            {safeSelectedImage + 1} /{" "}
            {validImages.length}
          </div>
        )}
      </div>

      {/* =================================================
          THUMBNAILS
      ================================================= */}

      {validImages.length > 1 && (
        <div
          className="
            mt-4
            w-full
            overflow-x-auto
            pb-2
            scrollbar-none
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          <div className="flex w-max gap-3">
            {validImages.map(
              (image, index) => {
                const isActive =
                  index ===
                  safeSelectedImage;

                return (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setSelectedImage(index)
                    }
                    aria-label={`View ${productName} image ${
                      index + 1
                    }`}
                    aria-current={
                      isActive
                        ? "true"
                        : undefined
                    }
                    className={`
                      relative
                      h-20
                      w-16
                      flex-shrink-0
                      overflow-hidden
                      rounded-xl
                      border-2
                      bg-[#0e1219]/90
                      transition
                      active:scale-95
                      sm:h-24
                      sm:w-20
                      ${
                        isActive
                          ? "border-[#1677FF] shadow-[0_0_15px_rgba(22,119,255,0.4)]"
                          : "border-white/10 hover:border-white/30"
                      }
                    `}
                  >
                    <Image
                      src={image}
                      alt={`${productName} thumbnail ${
                        index + 1
                      }`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />

                    {/* Active border */}

                    {isActive && (
                      <div className="pointer-events-none absolute inset-0 border-2 border-[#1677FF]" />
                    )}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* =================================================
          MOBILE DOTS
      ================================================= */}

      {validImages.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5 sm:hidden">
          {validImages.map(
            (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setSelectedImage(index)
                }
                aria-label={`Go to product image ${
                  index + 1
                }`}
                className={`
                  h-1.5
                  rounded-full
                  transition-all
                  ${
                    index ===
                    safeSelectedImage
                      ? "w-5 bg-[#1677FF]"
                      : "w-1.5 bg-white/20"
                  }
                `}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}