import Image from "next/image";

type Product = {
  id: number;
  name: string;
  image: string;
  sold: number;
};

export default function TopSellingProducts({
  products,
}: {
  products: Product[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-6 text-white shadow-sm">

      <h2 className="mb-6 text-2xl font-bold text-white">
        🔥 Top Selling Products
      </h2>

      <div className="space-y-4">

        {products.length === 0 ? (
          <p className="text-gray-400">
            No sales yet.
          </p>
        ) : (
          products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between border-b border-white/5 pb-4 last:border-b-0"
            >
              <div className="flex items-center gap-4">

                <span className="text-xl font-black text-[#1677FF] w-8">
                  {index + 1}
                </span>

                <Image
                  src={product.image}
                  alt={product.name}
                  width={60}
                  height={60}
                  className="rounded-xl border border-white/10 bg-[#080a0f] object-cover"
                />

                <div>
                  <p className="font-bold text-white">
                    {product.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {product.sold} Sold
                  </p>
                </div>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}