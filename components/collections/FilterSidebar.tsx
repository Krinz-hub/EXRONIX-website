"use client";

type Props = {
  category: string;
  setCategory: (value: string) => void;
};

const categories = [
  "All",
  "Computer Mice",
  "PC Cabinets",
  "Headphone Stands",
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
                className={`min-h-10 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 ${
                  active
                    ? "border-[#1677FF] bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.4)]"
                    : "border-white/15 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10 hover:text-white"
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

      <aside className="hidden rounded-2xl border border-white/15 liquid-glass p-6 text-white shadow-xl backdrop-blur-xl lg:block">

        <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#1677FF]">
          Hardware Categories
        </h2>

        <div className="space-y-2">

          {categories.map((item) => {
            const active = category === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`flex min-h-11 w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "bg-[#1677FF] text-white font-semibold shadow-[0_0_15px_rgba(22,119,255,0.35)]"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item}</span>
                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </button>
            );
          })}

        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            ENGINEERING SPEC
          </p>
          <p className="mt-2 text-xs leading-5 text-gray-400">
            Precision-milled PC accessories with ultra-low tolerances and verified durability.
          </p>
        </div>

      </aside>
    </>
  );
}