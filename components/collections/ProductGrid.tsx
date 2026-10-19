import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
};

export default function ProductGrid({
  products,
}: {
  products: Product[];
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-white px-6 py-16 text-center">
        <h2 className="text-xl font-semibold">
          No products found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Try changing your category or sorting option.
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-7">
      {products.map((product) => (
        <div
          key={product.id}
          className="min-w-0"
        >
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