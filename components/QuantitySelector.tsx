"use client";

import { toast } from "sonner";
import { Minus, Plus } from "lucide-react";

type Props = {
  quantity: number;
  stock: number;
  setQuantity: React.Dispatch<
    React.SetStateAction<number>
  >;
};

export default function QuantitySelector({
  quantity,
  stock,
  setQuantity,
}: Props) {
  function increase() {
    if (quantity >= stock) {
      toast.error(
        `Only ${stock} item${stock > 1 ? "s" : ""} available.`
      );
      return;
    }

    setQuantity((prev) => prev + 1);
  }

  function decrease() {
    setQuantity((prev) =>
      prev > 1 ? prev - 1 : 1
    );
  }

  return (
    <div className="w-full">

      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-200">
        Quantity
      </h3>

      <div className="flex w-fit items-center overflow-hidden rounded-xl border border-white/20 bg-white/5 text-white backdrop-blur-md shadow-sm">

        {/* Decrease */}

        <button
          type="button"
          onClick={decrease}
          disabled={quantity === 1}
          aria-label="Decrease quantity"
          className="flex h-11 w-11 items-center justify-center text-gray-300 transition hover:bg-white/10 hover:text-white active:bg-white/15 disabled:cursor-not-allowed disabled:text-gray-600 sm:h-12 sm:w-12"
        >
          <Minus size={16} />
        </button>

        {/* Quantity */}

        <div
          aria-live="polite"
          className="flex h-11 min-w-[52px] items-center justify-center border-x border-white/20 px-4 text-base font-bold text-white sm:h-12 sm:min-w-[60px] sm:px-5"
        >
          {quantity}
        </div>

        {/* Increase */}

        <button
          type="button"
          onClick={increase}
          disabled={quantity >= stock}
          aria-label="Increase quantity"
          className="flex h-11 w-11 items-center justify-center text-gray-300 transition hover:bg-white/10 hover:text-white active:bg-white/15 disabled:cursor-not-allowed disabled:text-gray-600 sm:h-12 sm:w-12"
        >
          <Plus size={16} />
        </button>

      </div>

      {/* Stock */}

      <p className="mt-2.5 text-xs text-gray-400">
        Available Stock:{" "}
        <span className="font-semibold text-white">
          {stock} units
        </span>
      </p>

    </div>
  );
}