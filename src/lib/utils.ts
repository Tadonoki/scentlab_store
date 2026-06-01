import { products } from "@/db/schema";

// Client-side CartItem type
export interface CartItem {
  product: Product;
  quantity: number;
}

// Client-side Product type matching the frontend expectations
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  scent_notes: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  badge: string | null;
  is_featured: boolean;
  is_active: boolean;
  discount_percent: number;
  discount_active: boolean;
  weight_grams: number;
}

// Convert database snake_case to client camelCase-to-snake_case format
export function productToClient(p: typeof products.$inferSelect): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    scent_notes: p.scentNotes,
    description: p.description,
    price: p.price,
    stock: p.stock,
    image_url: p.imageUrl ?? "",
    badge: p.badge,
    is_featured: p.isFeatured,
    is_active: p.isActive,
    discount_percent: p.discountPercent,
    discount_active: p.discountActive,
    weight_grams: p.weightGrams,
  };
}

// ─── Format helpers ───
export function formatPrice(price: number): string {
  return `Rp${price.toLocaleString("id-ID")}`;
}

/** Calculate the effective (discounted) price. Returns original price if discount is inactive. */
export function getEffectivePrice(product: Product): number {
  if (product.discount_active && product.discount_percent > 0) {
    return Math.round(product.price * (1 - product.discount_percent / 100));
  }
  return product.price;
}

export const PAYMENT_METHODS = [
  "Transfer Via Bank",
  "DANA",
  "OVO",
  "QRIS",
];

export const WHATSAPP_NUMBER = "6287868403642";
export const INSTAGRAM_URL = "https://www.instagram.com/scentlab_store/";
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61590578607384";
export const SITE_NAME = "ScentLab_Store";
export const SITE_TAGLINE = "Serenity in Every Scent";

export function getWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}