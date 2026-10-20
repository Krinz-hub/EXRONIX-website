"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Zap, Radio } from "lucide-react";

import { getProducts, Product } from "@/lib/productService";
import QuickViewModal from "@/components/modals/QuickViewModal";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedQuickProduct, setSelectedQuickProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
    }
    load();
  }, []);

  const flagshipProduct = products.find((p) => p.id === 1) || products[0];
  const newDrops = products.filter((p) => p.id !== 1);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-transparent text-white px-4 pb-28 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            EDITORIAL HERO & DROP HEADER
        ===================================================== */}
        <div className="mb-14 text-center sm:mb-20">
          <div className="liquid-glass-subtle mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#1677FF] sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF] animate-ping" />
            BATCH 01 // 2026 HARDWARE DROPS
          </div>

          <h1 className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            NEW HARDWARE RELEASES
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-xs font-medium leading-6 text-gray-300 sm:text-sm sm:leading-7 md:text-base">
            First-look access to newest generation gaming peripherals, architectural PC chassis, and aerospace desk equipment.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#1677FF]" /> 100% Precision QA
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5">
              <Zap size={16} className="text-[#1677FF]" /> Zero Latency Architecture
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5">
              <Radio size={16} className="text-[#1677FF]" /> Limited Production Runs
            </span>
          </div>
        </div>

        {/* =====================================================
            SPOTLIGHT PRODUCT HERO (MAGNESIUM APEX MOUSE)
        ===================================================== */}
        {flagshipProduct && (
          <section className="mb-20 lg:mb-28">
            <div className="relative overflow-hidden rounded-3xl border border-white/20 liquid-glass p-6 sm:p-10 lg:p-14 backdrop-blur-2xl shadow-2xl">
              <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
                {/* Visual */}
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-[#050608]/70 lg:col-span-6">
                  <Image
                    src={flagshipProduct.image}
                    alt={flagshipProduct.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition duration-700 hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full border border-[#1677FF]/60 bg-[#1677FF]/20 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#1677FF] backdrop-blur-md">
                    FLAGSHIP DROP
                  </div>
                </div>

                {/* Editorial Specs Breakdown */}
                <div className="flex flex-col justify-center lg:col-span-6">
                  <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#1677FF]">
                    <Sparkles size={14} /> NEWEST ADDITION // OCTOBER 2026
                  </div>

                  <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {flagshipProduct.name}
                  </h2>

                  <p className="mt-4 text-xs leading-6 text-gray-300 sm:text-sm sm:leading-7">
                    {flagshipProduct.description}
                  </p>

                  {/* Tech Specs Grid */}
                  <div className="my-6 grid grid-cols-2 gap-3 border-y border-white/10 py-6 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Sensor Engine</p>
                      <p className="mt-1 text-xs font-bold text-white sm:text-sm">PAW3395 26,000 DPI</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Total Weight</p>
                      <p className="mt-1 text-xs font-bold text-white sm:text-sm">49 Grams (Magnesium)</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Polling Rate</p>
                      <p className="mt-1 text-xs font-bold text-white sm:text-sm">4,000 Hz Hyper-Polling</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Battery Life</p>
                      <p className="mt-1 text-xs font-bold text-white sm:text-sm">80 Hours Wireless</p>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400">Launch Price</p>
                      <p className="text-2xl font-black text-[#1677FF] sm:text-3xl">
                        NPR {flagshipProduct.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedQuickProduct(flagshipProduct)}
                        className="rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-[#1677FF]/60 hover:bg-[#1677FF]/20"
                      >
                        Quick Spec
                      </button>

                      <Link
                        href={`/products/${flagshipProduct.id}`}
                        className="flex items-center gap-2 rounded-full bg-[#1677FF] px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 hover:scale-105 active:scale-95"
                      >
                        View Product <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            EDITORIAL LOOKBOOK GRID (RECENT DROPS)
        ===================================================== */}
        <section>
          <div className="mb-10 flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1677FF]">
                CATALOGUE TIMELINE
              </p>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                Recent Hardware Additions
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold uppercase tracking-wider text-gray-400 transition hover:text-[#1677FF]"
            >
              Browse Complete Shop →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {newDrops.map((product) => (
              <article
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/15 liquid-glass-card p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#1677FF]/55 hover:shadow-[0_16px_36px_rgba(22,119,255,0.25)] sm:p-5"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#050608]/50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#1677FF] backdrop-blur-md">
                    {product.category}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between pt-4">
                  <div>
                    <h3 className="line-clamp-2 text-base font-bold text-white transition group-hover:text-[#1677FF]">
                      {product.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs text-gray-300 leading-5">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <p className="text-lg font-black text-[#1677FF]">
                      NPR {product.price.toLocaleString()}
                    </p>

                    <Link
                      href={`/products/${product.id}`}
                      className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#1677FF]"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {selectedQuickProduct && (
        <QuickViewModal
          open={!!selectedQuickProduct}
          onClose={() => setSelectedQuickProduct(null)}
          product={selectedQuickProduct}
        />
      )}
    </main>
  );
}
