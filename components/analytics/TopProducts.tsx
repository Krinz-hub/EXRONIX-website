"use client";

type Product = {
  name: string;
  sold: number;
  revenue: number;
};

export default function TopProducts({
  products,
}: {
  products: Product[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-6 text-white shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Top Selling Products
      </h2>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-gray-400">
          No sales yet.
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product, index) => (
            <div
              key={product.name}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 text-white"
            >
              <div>
                <p className="text-base font-bold text-white">
                  #{index + 1} {product.name}
                </p>

                <p className="text-sm text-gray-400">
                  {product.sold} sold
                </p>
              </div>

              <p className="text-xl font-black text-white">
                NPR {product.revenue.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}