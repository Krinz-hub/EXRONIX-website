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

      <h3 className="mb-4 text-base font-semibold sm:text-lg">
        Quantity
      </h3>

      <div className="flex w-fit items-center overflow-hidden rounded-xl border border-gray-300">

        {/* Decrease */}

        <button
          type="button"
          onClick={decrease}
          disabled={quantity === 1}
          aria-label="Decrease quantity"
          className="flex h-12 w-12 items-center justify-center transition hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-300 sm:h-13 sm:w-13"
        >
          <Minus size={18} />
        </button>

        {/* Quantity */}

        <div
          aria-live="polite"
          className="flex h-12 min-w-[56px] items-center justify-center border-x border-gray-300 px-4 text-lg font-semibold sm:h-13 sm:min-w-[64px] sm:px-5"
        >
          {quantity}
        </div>

        {/* Increase */}

        <button
          type="button"
          onClick={increase}
          disabled={quantity >= stock}
          aria-label="Increase quantity"
          className="flex h-12 w-12 items-center justify-center transition hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-300 sm:h-13 sm:w-13"
        >
          <Plus size={18} />
        </button>

      </div>

      {/* Stock */}

      <p className="mt-3 text-sm text-gray-500">
        Available Stock:{" "}
        <span className="font-semibold text-black">
          {stock}
        </span>
      </p>

    </div>
  );
}