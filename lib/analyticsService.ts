import { getOrders } from "./orderService";
import { supabase } from "./supabase";
import { getRecentReviews } from "./reviewService";
export async function getAnalytics() {
  const orders = await getOrders();

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum: number, order: any) => sum + order.total,
    0
  );

  const customers = new Set(
    orders.map((o: any) => o.user_id || o.email)
  ).size;

  const labels: string[] = [];
  const revenue: number[] = [];

  const today = new Date();

  // Last 7 Days Revenue
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(today.getDate() - i);

    labels.push(
      day.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    );

    const dayRevenue = orders
      .filter((order: any) => {
        if (!order.created_at) return false;

        return (
          new Date(order.created_at).toDateString() ===
          day.toDateString()
        );
      })
      .reduce(
        (sum: number, order: any) => sum + order.total,
        0
      );

    revenue.push(dayRevenue);
  }

  // Today's Revenue
  const todayString = today.toLocaleDateString("en-CA");

const todayRevenue = orders
  .filter((order: any) => {
    if (!order.created_at) return false;

    const orderDate = new Date(order.created_at);

    return (
      orderDate.toLocaleDateString("en-CA") ===
      todayString
    );
  })
  .reduce(
    (sum: number, order: any) => sum + order.total,
    0
  );

  // Weekly Revenue
  const weekRevenue = orders
    .filter((order: any) => {
      if (!order.created_at) return false;

      const diff =
        (today.getTime() -
          new Date(order.created_at).getTime()) /
        (1000 * 60 * 60 * 24);

      return diff <= 7;
    })
    .reduce((sum: number, order: any) => sum + order.total, 0);

  // Monthly Revenue
  const monthRevenue = orders
    .filter((order: any) => {
      if (!order.created_at) return false;

      const d = new Date(order.created_at);

      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum: number, order: any) => sum + order.total, 0);

  // ============================
  // Top Selling Products
  // ============================

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("product_name, quantity, price");

  const map = new Map<
    string,
    {
      sold: number;
      revenue: number;
    }
  >();

  orderItems?.forEach((item: any) => {
    const existing = map.get(item.product_name);

    if (existing) {
      existing.sold += item.quantity;
      existing.revenue += item.quantity * item.price;
    } else {
      map.set(item.product_name, {
        sold: item.quantity,
        revenue: item.quantity * item.price,
      });
    }
  });

  const topProducts = [...map.entries()]
    .map(([name, value]) => ({
      name,
      sold: value.sold,
      revenue: value.revenue,
    }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);
const recentReviews = await getRecentReviews();
  return {


    orders,

    totalOrders,
    totalRevenue,
    customers,

    todayRevenue,
    weekRevenue,
    monthRevenue,

    labels,
    revenue,

    topProducts,
    recentReviews,

    pending: orders.filter(
      (o: any) => o.status === "Pending"
    ).length,

    confirmed: orders.filter(
      (o: any) => o.status === "Confirmed"
    ).length,

    processing: orders.filter(
      (o: any) => o.status === "Processing"
    ).length,

    shipped: orders.filter(
      (o: any) => o.status === "Shipped"
    ).length,

    delivered: orders.filter(
      (o: any) => o.status === "Delivered"
    ).length,
  };
}