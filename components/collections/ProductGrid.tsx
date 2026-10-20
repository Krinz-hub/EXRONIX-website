import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
};

interface ProductGridProps {
  products: Product[];
  onReset?: () => void;
  emptyTitle?: string;
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  onReset,
  emptyTitle = "No hardware gear found",
  emptyMessage = "No accessories match your active filters. Try selecting a different category or resetting sorting.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 liquid-glass bg-[#050608]/60 p-8 sm:p-12 text-center text-white backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl">
          🔍
        </div>
        <h3 className="text-lg font-bold text-white sm:text-xl">
          {emptyTitle}
        </h3>

        <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-gray-400 sm:text-sm">
          {emptyMessage}
        </p>

        {onReset && (
          <div className="mt-6">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-full border border-[#1677FF]/40 bg-[#1677FF]/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#1677FF] transition hover:bg-[#1677FF]/25 active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-7">
      {products.map((product) => (
        <div key={product.id} className="min-w-0">
          <ProductCard
            id={product.id}
            name={product.name}
            image={product.image}
            price={product.price}
          />
        </div>
      ))}
    </div>
  );
}