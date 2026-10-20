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
      <main className="flex min-h-screen items-center justify-center px-6 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Product Not Found
          </h1>

          <p className="mt-3 text-gray-400">
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

      <main className="w-full overflow-x-hidden text-white px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-7xl">

          {/* =================================================
              PRODUCT SECTION
          ================================================= */}

          <section className="grid w-full min-w-0 grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16">

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

            <div className="w-full min-w-0 flex flex-col justify-center">

              {/* Category */}

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1677FF]">
                {product.category}
              </p>

              {/* Product Name */}

              <h1 className="mt-2.5 break-words text-3xl font-extrabold leading-tight tracking-tight text-white sm:mt-3 sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              {/* Real Product Rating */}

              <ProductRating productId={product.id} />

              {/* Price */}

              <p className="mt-4 text-2xl font-black text-[#1677FF] sm:mt-5 sm:text-3xl lg:text-4xl">
                NPR{" "}
                {product.price.toLocaleString()}
              </p>

              {/* Description */}

              <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:mt-5 sm:text-base sm:leading-7">
                {product.description}
              </p>

              {/* Stock */}

              <div className="mt-5 sm:mt-6">

                {product.stock <= 0 ? (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-red-500/15 border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-400">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    Out of Stock
                  </div>
                ) : product.stock <= 5 ? (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-amber-500/15 border border-amber-500/30 px-4 py-2.5 text-sm font-semibold text-amber-300">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                    Only {product.stock} units remaining
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-4 py-2.5 text-sm font-semibold text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    In Stock ({product.stock} units ready to ship)
                  </div>
                )}

              </div>

              {/* Product Actions */}

              <div className="mt-6 sm:mt-8">
                <ProductActions
                  product={product}
                />
              </div>

              {/* Technical Specifications */}

              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="mt-8 border-t border-white/10 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200 mb-3">
                    Technical Specifications
                  </h3>
                  <div className="rounded-xl border border-white/10 divide-y divide-white/10 overflow-hidden bg-white/[0.04] backdrop-blur-md">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm">
                        <span className="font-semibold text-gray-400">{key}</span>
                        <span className="font-mono text-gray-200 text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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