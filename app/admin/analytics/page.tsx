"use client";

import { useEffect, useState } from "react";

import {
  getAnalytics,
  getTopSellingProducts,
} from "@/lib/orderService";

import { getLowStockProducts } from "@/lib/productService";

import RevenueChart from "@/components/admin/RevenueChart";
import LoadingAnimation from "@/components/LoadingAnimation";

/* =========================================
   ANALYTICS TYPE
========================================= */

type Analytics = {
  totalRevenue: number;
  todayRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  monthlyOrders: number;
  averageOrder: number;
  monthlyRevenueChart: any;
};

/* =========================================
   TOP SELLING PRODUCT TYPE
========================================= */

type TopSellingProduct = {
  id: number;
  name: string;
  image: string;
  price: number;
  sold: number;
  stock: number;
};

/* =========================================
   LOW STOCK PRODUCT TYPE
========================================= */

type LowStockProduct = {
  id: number;
  name: string;
  image: string;
  price: number;
  stock: number;
};

/* =========================================
   ANALYTICS PAGE
========================================= */

export default function AnalyticsPage() {
  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [topProducts, setTopProducts] =
    useState<TopSellingProduct[]>([]);

  const [lowStock, setLowStock] =
    useState<LowStockProduct[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================================
     LOAD ANALYTICS
  ========================================= */

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);

        /* -------------------------------------
           STORE ANALYTICS
        ------------------------------------- */

        const analyticsData =
          await getAnalytics();

        setAnalytics(analyticsData);

        /* -------------------------------------
           TOP SELLING PRODUCTS
        ------------------------------------- */

        const products =
          await getTopSellingProducts();

        setTopProducts(
          (products ?? []).map((product: any) => ({
            id: Number(product.id),
            name: product.name ?? "",
            image: product.image ?? "",
            price: Number(product.price ?? 0),
            sold: Number(product.sold ?? 0),
            stock: Number(product.stock ?? 0),
          }))
        );

        /* -------------------------------------
           LOW STOCK PRODUCTS
        ------------------------------------- */

        const stock =
          await getLowStockProducts();

        setLowStock(
          (stock ?? []).map((product: any) => ({
            id: Number(product.id),
            name: product.name ?? "",
            image: product.image ?? "",
            price: Number(product.price ?? 0),
            stock: Number(product.stock ?? 0),
          }))
        );
      } catch (error) {
        console.error(
          "Failed to load analytics:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  /* =========================================
     LOADING STATE
  ========================================= */

  if (loading || !analytics) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-transparent px-6">
        <LoadingAnimation size="lg" text="LOADING ANALYTICS" subtext="EXRONIX STORE TELEMETRY" />
      </main>
    );
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Sales Analytics
          </h1>

          <p className="mt-2 text-sm text-gray-400 md:text-base">
            Overview of your store performance.
          </p>
        </div>

        {/* =====================================
            STATISTICS
        ===================================== */}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">

          {/* Total Revenue */}

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-5 shadow md:p-8 text-white">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              💰 Total Revenue
            </p>

            <h2 className="mt-2 break-words text-2xl font-black text-white md:mt-3 md:text-4xl">
              NPR{" "}
              {analytics.totalRevenue.toLocaleString()}
            </h2>
          </div>

          {/* Today's Revenue */}

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-5 shadow md:p-8 text-white">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              📅 Today's Revenue
            </p>

            <h2 className="mt-2 break-words text-2xl font-black text-white md:mt-3 md:text-4xl">
              NPR{" "}
              {analytics.todayRevenue.toLocaleString()}
            </h2>
          </div>

          {/* Monthly Revenue */}

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-5 shadow md:p-8 text-white">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              📆 Monthly Revenue
            </p>

            <h2 className="mt-2 break-words text-2xl font-black text-white md:mt-3 md:text-4xl">
              NPR{" "}
              {analytics.monthlyRevenue.toLocaleString()}
            </h2>
          </div>

          {/* Total Orders */}

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-5 shadow md:p-8 text-white">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              📦 Total Orders
            </p>

            <h2 className="mt-2 text-2xl font-black text-white md:mt-3 md:text-4xl">
              {analytics.totalOrders}
            </h2>
          </div>

          {/* Monthly Orders */}

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-5 shadow md:p-8 text-white">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              📈 Monthly Orders
            </p>

            <h2 className="mt-2 text-2xl font-black text-white md:mt-3 md:text-4xl">
              {analytics.monthlyOrders}
            </h2>
          </div>

          {/* Average Order */}

          <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-5 shadow md:p-8 text-white">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              🛒 Average Order Value
            </p>

            <h2 className="mt-2 break-words text-2xl font-black text-white md:mt-3 md:text-4xl">
              NPR{" "}
              {analytics.averageOrder.toFixed(0)}
            </h2>
          </div>
        </div>

        {/* =====================================
            REVENUE CHART
        ===================================== */}

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0e1219] p-5 shadow md:mt-10 md:p-8 text-white">

          <h2 className="mb-5 text-2xl font-bold text-white md:mb-6 md:text-3xl">
            Monthly Revenue
          </h2>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px] md:min-w-0">
              <RevenueChart
                revenue={
                  analytics.monthlyRevenueChart
                }
              />
            </div>
          </div>
        </div>

        {/* =====================================
            TOP SELLING PRODUCTS
        ===================================== */}

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0e1219] p-5 shadow md:mt-10 md:p-8 text-white">

          <h2 className="mb-6 text-2xl font-bold text-white md:mb-8 md:text-3xl">
            🔥 Top Selling Products
          </h2>

          {topProducts.length === 0 ? (
            <p className="text-gray-400">
              No sales data available yet.
            </p>
          ) : (
            <div className="space-y-4 md:space-y-5">

              {topProducts.map(
                (product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 border-b border-white/5 pb-4 last:border-b-0 md:gap-4 text-white"
                  >

                    {/* Product Image */}

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-14 w-14 shrink-0 rounded-xl border border-white/10 bg-[#080a0f] object-cover md:h-16 md:w-16"
                    />

                    {/* Product Information */}

                    <div className="min-w-0 flex-1">

                      <h3 className="truncate text-sm font-bold text-white md:text-lg">
                        {index + 1}.{" "}
                        {product.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400 md:text-sm">
                        Product ID:{" "}
                        {product.id}
                      </p>

                    </div>

                    {/* Sold */}

                    <div className="shrink-0 text-right">

                      <p className="text-xl font-black text-white md:text-2xl">
                        {product.sold}
                      </p>

                      <p className="text-xs text-gray-400 md:text-sm">
                        Sold
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>
          )}
        </div>

        {/* =====================================
            LOW STOCK ALERT
        ===================================== */}

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0e1219] p-5 shadow md:mt-10 md:p-8 text-white">

          <h2 className="mb-6 text-2xl font-bold text-white md:mb-8 md:text-3xl">
            ⚠ Low Stock Alert
          </h2>

          {lowStock.length === 0 ? (

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <p className="font-semibold text-emerald-300">
                ✅ All products have healthy stock levels.
              </p>
            </div>

          ) : (

            <div className="space-y-4 md:space-y-5">

              {lowStock.map(
                (product) => (

                  <div
                    key={product.id}
                    className="flex items-center gap-3 border-b border-white/5 pb-4 last:border-b-0 md:gap-4 text-white"
                  >

                    {/* Product Image */}

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-14 w-14 shrink-0 rounded-xl border border-white/10 bg-[#080a0f] object-cover md:h-16 md:w-16"
                    />

                    {/* Product Information */}

                    <div className="min-w-0 flex-1">

                      <h3 className="truncate text-sm font-bold text-white md:text-lg">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400 md:text-sm">
                        NPR{" "}
                        {product.price.toLocaleString()}
                      </p>

                    </div>

                    {/* Stock */}

                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm ${
                        product.stock === 0
                          ? "border border-red-500/30 bg-red-500/15 text-red-300"
                          : "border border-amber-500/30 bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : `${product.stock} Left`}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>
    </main>
  );
}