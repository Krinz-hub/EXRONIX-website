"use client";

type Props = {
  sort: string;
  setSort: (value: string) => void;
};

export default function SortDropdown({
  sort,
  setSort,
}: Props) {
  return (
    <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">

      <span className="shrink-0 text-sm font-medium text-gray-500 sm:text-base">
        Sort By
      </span>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        aria-label="Sort products"
        className="min-h-11 min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 outline-none transition focus:border-black focus:ring-1 focus:ring-black sm:w-52 sm:flex-none sm:px-4 sm:text-base"
      >
        <option value="newest">
          Newest
        </option>

        <option value="priceLow">
          Price: Low → High
        </option>

        <option value="priceHigh">
          Price: High → Low
        </option>

        <option value="name">
          A → Z
        </option>
      </select>

    </div>
  );
}