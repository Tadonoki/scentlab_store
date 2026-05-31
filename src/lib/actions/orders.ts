"use server";

import { db } from "@/db";
import { orders, orderItems, products, shippingRates } from "@/db/schema";
import { eq, desc, asc, sql } from "drizzle-orm";

// ─── Create Order ───
export async function createOrder(data: {
  buyerName: string;
  buyerPhone: string;
  buyerProvince?: string;
  buyerAddress: string;
  paymentMethod: string;
  notes: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  items: {
    productId: string;
    productName: string;
    scentNotes: string;
    quantity: number;
    price: number;
    originalPrice?: number;
    subtotal: number;
  }[];
}) {
  // Generate order code: SL-YYYYMMDD-XXXX
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(Math.random() * 9000) + 1000;
  const orderCode = `SL-${dateStr}-${randomPart}`;

  // Server-side validation of shipping cost
  let validatedShippingCost = 0;
  if (data.buyerProvince) {
    const [rateRecord] = await db
      .select()
      .from(shippingRates)
      .where(eq(shippingRates.province, data.buyerProvince))
      .limit(1);
    
    if (rateRecord && rateRecord.isActive) {
      validatedShippingCost = rateRecord.shippingCost;
    } else {
      // Fallback or error if inactive
      validatedShippingCost = data.shippingCost;
    }
  } else {
    validatedShippingCost = data.shippingCost;
  }

  const validatedTotal = data.subtotal + validatedShippingCost;

  // Insert order
  const [order] = await db
    .insert(orders)
    .values({
      orderCode,
      buyerName: data.buyerName,
      buyerPhone: data.buyerPhone,
      buyerProvince: data.buyerProvince || null,
      buyerAddress: data.buyerAddress,
      paymentMethod: data.paymentMethod,
      notes: data.notes || null,
      subtotal: data.subtotal,
      shippingCost: validatedShippingCost,
      totalAmount: validatedTotal,
      status: "PENDING_PAYMENT",
    })
    .returning();

  // Insert order items and update stock
  for (const item of data.items) {
    await db.insert(orderItems).values({
      orderId: order.id,
      productId: item.productId,
      productName: item.productName,
      scentNotes: item.scentNotes,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    });

    // Reduce stock
    await db
      .update(products)
      .set({
        stock: sql`${products.stock} - ${item.quantity}`,
      })
      .where(eq(products.id, item.productId));
  }

  return {
    order_code: order.orderCode,
    buyer_name: order.buyerName,
    buyer_phone: order.buyerPhone,
    buyer_province: order.buyerProvince || "",
    buyer_address: order.buyerAddress,
    payment_method: order.paymentMethod,
    notes: order.notes || "",
    subtotal_amount: order.subtotal,
    shipping_amount: order.shippingCost,
    total_amount: order.totalAmount,
    status: order.status,
    items: data.items.map((item) => ({
      product_name: item.productName,
      scent_notes: item.scentNotes,
      quantity: item.quantity,
      price: item.price,
      original_price: item.originalPrice,
      subtotal: item.subtotal,
    })),
    created_at: order.createdAt?.toISOString() || new Date().toISOString(),
  };
}

// ─── Get Order by Code ───
export async function getOrderByCode(orderCode: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderCode, orderCode))
    .limit(1);

  if (!order) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(asc(orderItems.id));

  return {
    order_code: order.orderCode,
    buyer_name: order.buyerName,
    buyer_phone: order.buyerPhone,
    buyer_province: order.buyerProvince || "",
    buyer_address: order.buyerAddress,
    payment_method: order.paymentMethod,
    notes: order.notes || "",
    subtotal_amount: order.subtotal,
    shipping_amount: order.shippingCost,
    total_amount: order.totalAmount,
    status: order.status,
    created_at: order.createdAt?.toISOString() || "",
    updated_at: order.updatedAt?.toISOString() || "",
    items: items.map((item) => ({
      product_name: item.productName,
      scent_notes: item.scentNotes || "",
      quantity: item.quantity,
      price: item.price,
      original_price: item.price,
      subtotal: item.subtotal,
    })),
  };
}

// ─── Admin: Get All Orders ───
export async function getAllOrders() {
  const result = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt));
  return result.map((o) => ({
    id: o.id,
    order_code: o.orderCode,
    buyer_name: o.buyerName,
    buyer_phone: o.buyerPhone,
    buyer_province: o.buyerProvince || "",
    buyer_address: o.buyerAddress,
    payment_method: o.paymentMethod,
    notes: o.notes || "",
    subtotal_amount: o.subtotal,
    shipping_amount: o.shippingCost,
    total_amount: o.totalAmount,
    status: o.status,
    created_at: o.createdAt?.toISOString() || "",
    updated_at: o.updatedAt?.toISOString() || "",
    items: [],
  }));
}

// ─── Admin: Get Order Detail ───
export async function getOrderDetail(orderId: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId))
    .orderBy(asc(orderItems.id));

  return {
    id: order.id,
    order_code: order.orderCode,
    buyer_name: order.buyerName,
    buyer_phone: order.buyerPhone,
    buyer_province: order.buyerProvince || "",
    buyer_address: order.buyerAddress,
    payment_method: order.paymentMethod,
    notes: order.notes || "",
    subtotal_amount: order.subtotal,
    shipping_amount: order.shippingCost,
    total_amount: order.totalAmount,
    status: order.status,
    created_at: order.createdAt?.toISOString() || "",
    updated_at: order.updatedAt?.toISOString() || "",
    items: items.map((item) => ({
      id: item.id,
      product_id: item.productId,
      product_name: item.productName,
      scent_notes: item.scentNotes || "",
      quantity: item.quantity,
      price: item.price,
      original_price: item.price,
      subtotal: item.subtotal,
    })),
  };
}

// ─── Admin: Update Order Status ───
export async function updateOrderStatus(orderId: string, status: string) {
  await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, orderId));
}

// ─── Admin: Dashboard Stats ───
export async function getDashboardStats() {
  const allOrders = await db.select().from(orders);

  const revenueOrders = allOrders.filter((o) =>
    ["PAID", "PROCESSING", "COMPLETED"].includes(o.status)
  );
  const totalRevenue = revenueOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = allOrders.length;
  const pendingPayment = allOrders.filter(
    (o) => o.status === "PENDING_PAYMENT"
  ).length;
  const completedOrders = allOrders.filter(
    (o) => o.status === "COMPLETED"
  ).length;

  const [productCountResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.isActive, true));

  const totalProducts = Number(productCountResult?.count || 0);

  const recentOrders = allOrders
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)
    .map((o) => ({
      id: o.id,
      order_code: o.orderCode,
      buyer_name: o.buyerName,
      total_amount: o.totalAmount,
      status: o.status,
      created_at: o.createdAt?.toISOString() || "",
    }));

  const recentNotifications = allOrders
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10)
    .map((o) => ({
      id: o.id,
      order_id: o.id,
      type:
        o.status === "PENDING_PAYMENT" ? "ORDER_BARU" : o.status,
      title:
        o.status === "PENDING_PAYMENT"
          ? "Pesanan Baru"
          : `Status: ${o.status}`,
      message: `${o.buyerName} - ${o.orderCode} - Rp${o.totalAmount.toLocaleString(
        "id-ID"
      )}`,
      is_read: false,
      created_at: o.createdAt?.toISOString() || "",
    }));

  return {
    totalRevenue,
    totalOrders,
    pendingPayment,
    completedOrders,
    totalProducts,
    recentOrders,
    recentNotifications,
  };
}