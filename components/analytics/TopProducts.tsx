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
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        Top Selling Products
      </h2>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
          No sales yet.
        </div>
      ) : (
        <div className="space-y-5">
          {products.map((product, index) => (
            <div
              key={product.name}
              className="flex items-center justify-between rounded-xl bg-gray-50 p-5"
            >
              <div>
                <p className="text-lg font-semibold">
                  #{index + 1} {product.name}
                </p>

                <p className="text-sm text-gray-500">
                  {product.sold} sold
                </p>
              </div>

              <p className="text-xl font-bold">
                NPR {product.revenue.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}