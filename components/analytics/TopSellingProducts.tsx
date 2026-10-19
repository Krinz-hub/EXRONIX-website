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
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        🔥 Top Selling Products
      </h2>

      <div className="space-y-5">

        {products.length === 0 ? (
          <p className="text-gray-500">
            No sales yet.
          </p>
        ) : (
          products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">

                <span className="text-2xl font-bold w-8">
                  {index + 1}
                </span>

                <Image
                  src={product.image}
                  alt={product.name}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />

                <div>
                  <p className="font-semibold">
                    {product.name}
                  </p>

                  <p className="text-sm text-gray-500">
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