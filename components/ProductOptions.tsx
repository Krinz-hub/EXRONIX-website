"use client";

import { useState } from "react";

type Props = {
  sizes?: string[];
  colors?: string[];
  onChange: (size: string, color: string) => void;
};

export default function ProductOptions({
  sizes = [],
  colors = [],
  onChange,
}: Props) {
  const [selectedSize, setSelectedSize] = useState(
    sizes[0] || ""
  );

  const [selectedColor, setSelectedColor] = useState(
    colors[0] || ""
  );

  function changeSize(size: string) {
    setSelectedSize(size);
    onChange(size, selectedColor);
  }

  function changeColor(color: string) {
    setSelectedColor(color);
    onChange(selectedSize, color);
  }

  return (
    <div className="space-y-7">

      {colors.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold sm:text-lg">
              Select Color
            </h3>

            <span className="text-sm text-gray-500">
              {selectedColor}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => changeColor(color)}
                className={`min-h-11 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all active:scale-95 sm:px-5 ${
                  selectedColor === color
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white hover:bg-gray-100"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold sm:text-lg">
              Select Size
            </h3>

            <span className="text-sm text-gray-500">
              {selectedSize}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => changeSize(size)}
                className={`min-h-11 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all active:scale-95 sm:min-w-16 sm:px-5 ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white hover:bg-gray-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}