"use client";

type Props = {
  category: string;
  setCategory: (value: string) => void;
};

const categories = [
  "All",
  "T-Shirts",
  "Oversized",
  "Hoodies",
  "Linen Pants",
];

export default function FilterSidebar({
  category,
  setCategory,
}: Props) {
  return (
    <>
      {/* =========================
          MOBILE FILTERS
      ========================= */}

      <div className="mb-6 -mx-4 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:hidden">
        <div className="flex w-max gap-2">

          {categories.map((item) => {
            const active = category === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`min-h-10 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all active:scale-95 ${
                  active
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            );
          })}

        </div>
      </div>

      {/* =========================
          DESKTOP FILTERS
      ========================= */}

      <aside className="hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:block">

        <h2 className="mb-5 text-xl font-bold">
          Filters
        </h2>

        <div className="space-y-2">

          {categories.map((item) => {
            const active = category === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`block min-h-11 w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            );
          })}

        </div>

      </aside>
    </>
  );
}