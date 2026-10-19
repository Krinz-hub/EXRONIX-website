import { supabase } from "./supabase";

export async function getDashboardStats() {
  const [{ count: products }, { count: orders }] =
    await Promise.all([
      supabase
        .from("products")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("orders")
        .select("*", { count: "exact", head: true }),
    ]);

  const { data: orderData } = await supabase
    .from("orders")
    .select("*");

  const revenue =
    orderData?.reduce(
      (sum, order) => sum + Number(order.total),
      0
    ) ?? 0;

  const customers = new Set(
    orderData?.map((o) => o.customer) ?? []
  ).size;

  return {
    products: products ?? 0,
    orders: orders ?? 0,
    revenue,
    customers,
    recentOrders: orderData?.slice(-5).reverse() ?? [],
  };
}