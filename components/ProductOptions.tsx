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
    <div className="space-y-6">

      {colors.length > 0 && (
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
              Select Finish
            </h3>

            <span className="text-xs font-semibold text-[#1677FF]">
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
                    ? "border-[#1677FF] bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] font-semibold"
                    : "border-white/15 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10 hover:text-white"
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
          <div className="mb-2.5 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
              Select Variant / Spec
            </h3>

            <span className="text-xs font-semibold text-[#1677FF]">
              {selectedSize}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => changeSize(size)}
                className={`min-h-11 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all active:scale-95 sm:px-5 ${
                  selectedSize === size
                    ? "border-[#1677FF] bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] font-semibold"
                    : "border-white/15 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10 hover:text-white"
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