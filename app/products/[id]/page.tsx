import type { Metadata } from "next";

import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductActions from "@/components/ProductActions";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import SaveRecentlyViewed from "@/components/product/SaveRecentlyViewed";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductRating from "@/components/product/ProductRating";
import {
  getProductById,
  getProductImages,
} from "@/lib/productService";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

/* =====================================================
   METADATA
===================================================== */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

  const product = await getProductById(
    Number(id)
  );

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const productImages =
    getProductImages(product);

  return {
    title: product.name,

    description:
      product.description ||
      `Buy ${product.name} from EXRONIX — Engineered Beyond Limits.`,

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.exronix.store"}/products/${product.id}`,
    },

    openGraph: {
      title: product.name,

      description:
        product.description ||
        "Precision 3D printed model from EXRONIX — Engineered Beyond Limits.",

      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.exronix.store"}/products/${product.id}`,

      images: productImages.map(
        (image) => ({
          url: image,
          width: 1200,
          height: 1500,
          alt: product.name,
        })
      ),

      type: "website",
    },

    twitter: {
      card: "summary_large_image",

      title: product.name,

      description:
        product.description ||
        "Precision 3D printed model from EXRONIX — Engineered Beyond Limits.",

      images: productImages,
    },
  };
}

/* =====================================================
   PRODUCT PAGE
===================================================== */

export default async function ProductPage({
  params,
}: Props) {
  const { id } = await params;

  const product =
    await getProductById(
      Number(id)
    );

  /* =====================================================
     PRODUCT NOT FOUND
  ===================================================== */

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Product Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            The product you're looking for
            doesn't exist.
          </p>
        </div>
      </main>
    );
  }

  /* =====================================================
     PRODUCT IMAGES
  ===================================================== */

  const productImages =
    getProductImages(product);

  /* =====================================================
     PRODUCT STRUCTURED DATA
  ===================================================== */

  const productSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "Product",

    name:
      product.name,

    image:
      productImages,

    description:
      product.description,

    sku:
      String(product.id),

    brand: {
      "@type":
        "Brand",

      name:
        "EXRONIX",
    },

    offers: {
      "@type":
        "Offer",

      url:
        `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.exronix.store"}/products/${product.id}`,

      priceCurrency:
        "NPR",

      price:
        product.price,

      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",

      itemCondition:
        "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      {/* =================================================
          PRODUCT SCHEMA
      ================================================= */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              productSchema
            ),
        }}
      />

      <main className="w-full overflow-x-hidden bg-white px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-10 lg:pt-36">
        <div className="mx-auto max-w-7xl">

          {/* =================================================
              PRODUCT SECTION
          ================================================= */}

          <section className="grid w-full min-w-0 grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 lg:gap-20">

            {/* =================================================
                LEFT — PRODUCT IMAGE GALLERY
            ================================================= */}

            <div className="w-full min-w-0">
              <ProductImageGallery
                images={productImages}
                productName={product.name}
              />
            </div>

            {/* =================================================
                RIGHT — PRODUCT INFORMATION
            ================================================= */}

            <div className="w-full min-w-0">

              {/* Category */}

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500 sm:text-xs sm:tracking-[0.35em]">
                {product.category}
              </p>

              {/* Product Name */}

              <h1 className="mt-3 break-words text-3xl font-bold leading-tight tracking-tight sm:mt-4 sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              {/* Real Product Rating */}

              <ProductRating productId={product.id} />

              {/* Price */}

              <p className="mt-5 text-2xl font-bold sm:mt-6 sm:text-3xl lg:text-4xl">
                NPR{" "}
                {product.price.toLocaleString()}
              </p>

              {/* Description */}

              <p className="mt-5 text-sm leading-7 text-gray-600 sm:mt-6 sm:text-base sm:leading-8">
                {product.description}
              </p>

              {/* Stock */}

              <div className="mt-6 sm:mt-8">

                {product.stock <= 0 ? (
                  <div className="rounded-xl bg-red-100 px-4 py-3.5 text-sm font-semibold text-red-700 sm:px-5 sm:py-4 sm:text-base">
                    ❌ Out of Stock
                  </div>
                ) : product.stock <= 5 ? (
                  <div className="rounded-xl bg-yellow-100 px-4 py-3.5 text-sm font-semibold text-yellow-700 sm:px-5 sm:py-4 sm:text-base">
                    🔥 Only{" "}
                    {product.stock}{" "}
                    left
                  </div>
                ) : (
                  <div className="rounded-xl bg-green-100 px-4 py-3.5 text-sm font-semibold text-green-700 sm:px-5 sm:py-4 sm:text-base">
                    ✅ In Stock (
                    {product.stock})
                  </div>
                )}

              </div>

              {/* Product Actions */}

              <div className="mt-6 sm:mt-8">
                <ProductActions
                  product={product}
                />
              </div>

            </div>
          </section>

          {/* =================================================
              REVIEWS
          ================================================= */}

          <section className="mt-16 sm:mt-20 lg:mt-24">
            <ProductReviews
              productId={
                product.id
              }
            />
          </section>

          {/* =================================================
              RELATED PRODUCTS
          ================================================= */}

          <section className="mt-16 sm:mt-20 lg:mt-24">
            <RelatedProducts
              productId={
                product.id
              }
              category={
                product.category
              }
            />
          </section>

          {/* =================================================
              RECENTLY VIEWED
          ================================================= */}

          <section className="mt-16 sm:mt-20 lg:mt-24">
            <RecentlyViewed
              currentProductId={
                product.id
              }
            />
          </section>

          {/* =================================================
              SAVE RECENTLY VIEWED
          ================================================= */}

          <SaveRecentlyViewed
            product={product}
          />

        </div>
      </main>
    </>
  );
}