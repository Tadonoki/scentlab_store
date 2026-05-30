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