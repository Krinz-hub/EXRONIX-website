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

      <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:text-sm">
        Sort By
      </span>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        aria-label="Sort products"
        className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/20 bg-[#12151B] px-3 py-2 text-sm font-medium text-white outline-none transition focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF] sm:w-52 sm:flex-none sm:px-4 sm:text-base cursor-pointer"
      >
        <option value="newest" className="bg-[#12151B] text-white">
          Newest Additions
        </option>

        <option value="priceLow" className="bg-[#12151B] text-white">
          Price: Low → High
        </option>

        <option value="priceHigh" className="bg-[#12151B] text-white">
          Price: High → Low
        </option>

        <option value="name" className="bg-[#12151B] text-white">
          Name: A → Z
        </option>
      </select>

    </div>
  );
}