"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { Product, productToClient } from "@/lib/utils";

export async function getActiveProducts(): Promise<Product[]> {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(asc(products.name));
  return result.map(productToClient);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
    .orderBy(asc(products.name));
  return result.map(productToClient);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  if (result.length === 0) return null;
  return productToClient(result[0]);
}

export async function getProductById(id: string): Promise<Product | null> {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  if (result.length === 0) return null;
  return productToClient(result[0]);
}

// ─── Admin: Get all products ───
export async function getAllProducts(): Promise<Product[]> {
  const result = await db
    .select()
    .from(products)
    .orderBy(asc(products.name));
  return result.map(productToClient);
}

// ─── Admin: Create product ───
export async function createProduct(data: {
  name: string;
  slug: string;
  category: string;
  scentNotes: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  badge?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
  discountPercent?: number;
  discountActive?: boolean;
}) {
  await db.insert(products).values({
    name: data.name,
    slug: data.slug,
    category: data.category,
    scentNotes: data.scentNotes,
    description: data.description,
    price: data.price,
    stock: data.stock,
    imageUrl: data.imageUrl || null,
    badge: data.badge || null,
    isFeatured: data.isFeatured ?? false,
    isActive: data.isActive ?? true,
    discountPercent: data.discountPercent ?? 0,
    discountActive: data.discountActive ?? false,
  });
}

// ─── Admin: Update product ───
export async function updateProduct(
  id: string,
  data: {
    name?: string;
    slug?: string;
    category?: string;
    scentNotes?: string;
    description?: string;
    price?: number;
    stock?: number;
    imageUrl?: string | null;
    badge?: string | null;
    isFeatured?: boolean;
    isActive?: boolean;
    discountPercent?: number;
    discountActive?: boolean;
  }
) {
  await db.update(products).set(data).where(eq(products.id, id));
}

// ─── Admin: Hard delete product ───
export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(products).where(eq(products.id, id));
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    // PostgreSQL foreign_key_violation (23503) — product has order history
    if (message.toLowerCase().includes("violates foreign key") || message.includes("23503")) {
      return {
        success: false,
        error: "Produk tidak bisa dihapus karena sudah memiliki riwayat order.",
      };
    }
    console.error("Failed to delete product:", err);
    return { success: false, error: "Gagal menghapus produk." };
  }
}

// ─── Admin: Toggle active status ───
export async function toggleProductActive(id: string, isActive: boolean) {
  await db.update(products).set({ isActive }).where(eq(products.id, id));
}

// ─── Admin: Bulk discount — apply to all products ───
export async function applyDiscountToAll(discountPercent: number) {
  const active = discountPercent > 0;
  await db
    .update(products)
    .set({ discountPercent, discountActive: active });
}

// ─── Admin: Bulk discount — apply to selected products ───
export async function applyDiscountToSelected(ids: string[], discountPercent: number) {
  const active = discountPercent > 0;
  for (const id of ids) {
    await db
      .update(products)
      .set({ discountPercent, discountActive: active })
      .where(eq(products.id, id));
  }
}

// ─── Admin: Remove discount from all products ───
export async function removeAllDiscounts() {
  await db
    .update(products)
    .set({ discountPercent: 0, discountActive: false });
}

// ─── Admin: Unified bulk discount action ───
export async function bulkUpdateDiscount(data: {
  productIds?: string[];
  discountPercent: number;
  discountActive: boolean;
}) {
  if (data.productIds && data.productIds.length > 0) {
    // Apply to selected products
    for (const id of data.productIds) {
      await db
        .update(products)
        .set({ discountPercent: data.discountPercent, discountActive: data.discountActive })
        .where(eq(products.id, id));
    }
  } else {
    // Apply to all products
    await db
      .update(products)
      .set({ discountPercent: data.discountPercent, discountActive: data.discountActive });
  }
}
