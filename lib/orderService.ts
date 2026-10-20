import { supabase } from "./supabase";
import { clearCart } from "./cartService";
import { products as sampleProducts } from "@/components/data/products";

/* =========================================
   ORDER TYPE
========================================= */

export type Order = {
  id?: number;
  user_id?: string;

  customer: string;
  email: string;
  phone: string;

  address: string;
  province?: string;
  estimated_delivery?: string;

  items: any[];

  subtotal: number;
  shipping: number;
  total: number;

  payment: string;
  status: string;

  created_at?: string;

  courier?: string;
  tracking_number?: string;
  tracking_url?: string;
  admin_note?: string;

  stock_restored?: boolean;
};

/* =========================================
   CREATE ORDER
========================================= */

export async function createOrder(order: Order) {
  /*
    1. CHECK STOCK FIRST

    We check all products before creating
    the order. This prevents creating an
    order when stock is insufficient.
  */

  for (const item of order.items) {
    const { data: product, error: productError } =
      await supabase
        .from("products")
        .select("id, name, stock")
        .eq("id", item.id)
        .single();

    if (productError) {
      console.error(
        "Failed to check product stock:",
        productError
      );

      throw productError;
    }

    if (!product) {
      throw new Error(
        `Product ${item.id} not found.`
      );
    }

    const currentStock = Number(product.stock ?? 0);
    const requestedQuantity = Number(item.quantity ?? 0);

    if (
      !Number.isFinite(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      throw new Error(
        `Invalid quantity for ${item.name}.`
      );
    }

    if (currentStock < requestedQuantity) {
      throw new Error(
        `Insufficient stock for ${item.name}. Only ${currentStock} item(s) available.`
      );
    }
  }

  /*
    2. CREATE ORDER
  */

  const {
    data: createdOrder,
    error: orderError,
  } = await supabase
    .from("orders")
    .insert([
      {
        user_id: order.user_id,
        customer: order.customer,
        email: order.email,
        phone: order.phone,
        address: order.address,

        province: order.province,
        estimated_delivery:
          order.estimated_delivery,

        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,

        payment: order.payment,
        status: order.status,
      },
    ])
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  /*
    3. SAVE ORDER ITEMS
  */

  const orderItems = order.items.map((item) => ({
    order_id: createdOrder.id,

    product_id: item.id,
    product_name: item.name,
    product_image: item.image,

    quantity: item.quantity,
    price: item.price,

    size: item.size ?? null,
    color: item.color ?? null,
  }));

  if (orderItems.length > 0) {
    const {
      error: itemsError,
    } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      /*
        If order items fail, remove the
        empty order.
      */

      await supabase
        .from("orders")
        .delete()
        .eq("id", createdOrder.id);

      throw itemsError;
    }
  }

  /*
    4. REDUCE STOCK — ONLY ONCE

    IMPORTANT:
    Stock is reduced here only.

    Do NOT call decreaseProductStock()
    again from the checkout after createOrder().
  */

  for (const item of order.items) {
    const {
      data: product,
      error: productError,
    } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.id)
      .single();

    if (productError) {
      console.error(
        "Failed to get product stock:",
        productError
      );

      throw productError;
    }

    if (!product) {
      throw new Error(
        `Product ${item.id} not found.`
      );
    }

    const currentStock = Number(
      product.stock ?? 0
    );

    const quantity = Number(
      item.quantity ?? 0
    );

    /*
      Final safety check.
    */

    if (currentStock < quantity) {
      throw new Error(
        `Insufficient stock for ${item.name}.`
      );
    }

    const newStock =
      currentStock - quantity;

    console.log(
      "STOCK UPDATE",
      {
        productId: item.id,
        oldStock: currentStock,
        quantity,
        newStock,
      }
    );

    const {
      error: stockError,
    } = await supabase
      .from("products")
      .update({
        stock: Math.max(0, newStock),
      })
      .eq("id", item.id);

    if (stockError) {
      console.error(
        "Failed to update stock:",
        stockError
      );

      throw stockError;
    }
  }

  /*
    5. CLEAR USER CART
  */

  if (order.user_id) {
    await clearCart(order.user_id);
  }

  /*
    IMPORTANT:
    Confirmation email is NOT sent here.

    Checkout handles the email so we don't
    send duplicate confirmation emails.
  */

  return createdOrder;
}

/* =========================================
   GET ALL ORDERS
========================================= */

export async function getOrders() {
  const {
    data,
    error,
  } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Get Orders Error:",
      error
    );

    return [];
  }

  return data ?? [];
}

/* =========================================
   UPDATE ORDER STATUS
========================================= */

export async function updateOrderStatus(
  id: number,
  status: string
) {
  /*
    IMPORTANT:
    This function ONLY changes order status.

    It does NOT change stock.

    Stock restoration is handled only inside
    updateOrderDetails() when an order becomes
    Cancelled.
  */

  const {
    error,
  } = await supabase
    .from("orders")
    .update({
      status,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

/* =========================================
   DELETE ORDER
========================================= */

export async function deleteOrder(
  id: number
) {
  /*
    IMPORTANT:
    Deleting an order does NOT restore stock.

    Only cancelling an order restores stock.
  */

  const {
    error,
  } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

/* =========================================
   GET USER ORDERS
========================================= */

export async function getMyOrders(
  userId: string
) {
  const {
    data,
    error,
  } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Get My Orders Error:",
      error
    );

    return [];
  }

  return data ?? [];
}

/* =========================================
   GET SINGLE USER ORDER
========================================= */

export async function getOrder(
  orderId: number,
  userId: string
) {
  const {
    data,
    error,
  } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error(
      "Get Order Error:",
      error
    );

    return null;
  }

  return data;
}

/* =========================================
   GET ORDER ITEMS
========================================= */

export async function getOrderItems(
  orderId: number
) {
  const {
    data,
    error,
  } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (error) {
    console.error(
      "Get Order Items Error:",
      error
    );

    return [];
  }

  return data ?? [];
}

/* =========================================
   GET ORDER BY ID
   ADMIN
========================================= */

export async function getOrderById(
  id: number
) {
  const orderId = Number(id);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    console.error("Get Order By ID Error: Invalid order ID:", id);
    return null;
  }

  // Fetch the order separately.
  // This avoids relying on Supabase's nested relationship detection.
  const {
    data: order,
    error: orderError,
  } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError) {
    console.error("Get Order By ID Error:", {
      code: orderError.code,
      message: orderError.message,
      details: orderError.details,
      hint: orderError.hint,
    });
    return null;
  }

  if (!order) {
    console.error("Get Order By ID Error: Order not found:", orderId);
    return null;
  }

  // Fetch order items separately instead of using
  // .select(`*, order_items(*)`).
  const {
    data: items,
    error: itemsError,
  } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (itemsError) {
    console.error("Get Order Items For Order Error:", {
      code: itemsError.code,
      message: itemsError.message,
      details: itemsError.details,
      hint: itemsError.hint,
    });

    return {
      ...order,
      order_items: [],
    };
  }

  return {
    ...order,
    order_items: items ?? [],
  };
}

/* =========================================
   TOP SELLING PRODUCTS
========================================= */

export async function getTopSellingProducts() {
  try {
    const {
      data,
      error,
    } = await supabase
      .from("order_items")
      .select(`
        product_id,
        product_name,
        product_image,
        quantity
      `);

    if (error || !data || data.length === 0) {
      return sampleProducts.slice(0, 4).map((p, idx) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        sold: 140 - idx * 22,
      }));
    }

    const map = new Map();

    data.forEach((item: any) => {
      if (!map.has(item.product_id)) {
        map.set(item.product_id, {
          id: item.product_id,
          name: item.product_name,
          image: item.product_image,
          sold: 0,
        });
      }

      map.get(item.product_id).sold +=
        Number(item.quantity) || 0;
    });

    const result = [...map.values()]
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    if (result.length === 0) {
      return sampleProducts.slice(0, 4).map((p, idx) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        sold: 140 - idx * 22,
      }));
    }

    return result;
  } catch {
    return sampleProducts.slice(0, 4).map((p, idx) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      sold: 140 - idx * 22,
    }));
  }
}

/* =========================================
   UPDATE ORDER DETAILS
   ADMIN
========================================= */

export async function updateOrderDetails(
  id: number,
  values: {
    status?: string;
    courier?: string;
    tracking_number?: string;
    tracking_url?: string;
    admin_note?: string;
  }
) {
  /*
    Get current order information.
  */

  const {
    data: order,
    error: orderError,
  } = await supabase
    .from("orders")
    .select(
      "status, stock_restored"
    )
    .eq("id", id)
    .single();

  if (orderError) {
    throw orderError;
  }

  /*
    RESTORE STOCK ONLY WHEN:

    1. New status is Cancelled
    2. Stock has NOT already been restored

    This prevents stock from increasing
    multiple times.
  */

  if (
    values.status === "Cancelled" &&
    !order.stock_restored
  ) {
    console.log(
      "RESTORING STOCK FOR ORDER:",
      id
    );

    const {
      data: items,
      error: itemsError,
    } = await supabase
      .from("order_items")
      .select(
        "product_id, quantity"
      )
      .eq("order_id", id);

    if (itemsError) {
      throw itemsError;
    }

    for (const item of items ?? []) {
      const {
        data: product,
        error: productError,
      } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.product_id)
        .single();

      if (productError) {
        throw productError;
      }

      if (product) {
        const currentStock =
          Number(product.stock) || 0;

        const quantity =
          Number(item.quantity) || 0;

        const restoredStock =
          currentStock + quantity;

        console.log(
          "STOCK RESTORE",
          {
            productId:
              item.product_id,
            oldStock:
              currentStock,
            quantity,
            newStock:
              restoredStock,
          }
        );

        const {
          error: stockError,
        } = await supabase
          .from("products")
          .update({
            stock: restoredStock,
          })
          .eq(
            "id",
            item.product_id
          );

        if (stockError) {
          throw stockError;
        }
      }
    }

    /*
      Mark stock as restored.

      This is extremely important.
      If the admin edits the cancelled order
      again, stock will NOT be added again.
    */

    values = {
      ...values,
      stock_restored: true,
    } as any;
  }

  /*
    Update order.
  */

  const {
    error,
  } = await supabase
    .from("orders")
    .update(values)
    .eq("id", id);

  if (error) {
    throw error;
  }
}

/* =========================================
   GET CUSTOMERS
========================================= */

export async function getCustomers() {
  const {
    data,
    error,
  } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Get Customers Error:",
      error
    );

    return [];
  }

  const map = new Map();

  data?.forEach((order: any) => {
    if (!map.has(order.email)) {
      map.set(order.email, {
        customer: order.customer,
        email: order.email,
        phone: order.phone,
        orders: 0,
        totalSpent: 0,
        lastOrder:
          order.created_at,
      });
    }

    const customer =
      map.get(order.email);

    customer.orders += 1;

    customer.totalSpent +=
      Number(order.total);

    if (
      new Date(order.created_at) >
      new Date(customer.lastOrder)
    ) {
      customer.lastOrder =
        order.created_at;
    }
  });

  return [...map.values()];
}

/* =========================================
   GET CUSTOMER ORDERS
========================================= */

export async function getCustomerOrders(
  email: string
) {
  const {
    data,
    error,
  } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(*)
    `)
    .eq(
      "email",
      decodeURIComponent(email)
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Get Customer Orders Error:",
      error
    );

    return [];
  }

  return data ?? [];
}

/* =========================================
   ANALYTICS
========================================= */

export async function getAnalytics() {
  const {
    data,
    error,
  } = await supabase
    .from("orders")
    .select("*");

  if (error) {
    console.error(
      "Analytics Error:",
      error
    );

    return null;
  }

  const orders = data ?? [];

  const now = new Date();

  /*
    Monthly revenue
  */

  const monthlyRevenue =
    Array(12).fill(0);

  orders.forEach((order: any) => {
    if (!order.created_at) {
      return;
    }

    const month = new Date(
      order.created_at
    ).getMonth();

    monthlyRevenue[month] +=
      Number(order.total) || 0;
  });

  /*
    Today's orders
  */

  const today = orders.filter(
    (order: any) => {
      if (!order.created_at) {
        return false;
      }

      const date = new Date(
        order.created_at
      );

      return (
        date.getDate() ===
          now.getDate() &&
        date.getMonth() ===
          now.getMonth() &&
        date.getFullYear() ===
          now.getFullYear()
      );
    }
  );

  /*
    This month's orders
  */

  const thisMonth =
    orders.filter(
      (order: any) => {
        if (!order.created_at) {
          return false;
        }

        const date = new Date(
          order.created_at
        );

        return (
          date.getMonth() ===
            now.getMonth() &&
          date.getFullYear() ===
            now.getFullYear()
        );
      }
    );

  /*
    Revenue calculations
  */

  const totalRevenue =
    orders.reduce(
      (
        sum: number,
        order: any
      ) =>
        sum +
        (Number(order.total) || 0),
      0
    );

  const todayRevenue =
    today.reduce(
      (
        sum: number,
        order: any
      ) =>
        sum +
        (Number(order.total) || 0),
      0
    );

  const monthlyRevenueTotal =
    thisMonth.reduce(
      (
        sum: number,
        order: any
      ) =>
        sum +
        (Number(order.total) || 0),
      0
    );

  return {
    totalRevenue,

    todayRevenue,

    monthlyRevenue:
      monthlyRevenueTotal,

    totalOrders:
      orders.length,

    monthlyOrders:
      thisMonth.length,

    averageOrder:
      orders.length > 0
        ? totalRevenue /
          orders.length
        : 0,

    monthlyRevenueChart:
      monthlyRevenue,
  };
}