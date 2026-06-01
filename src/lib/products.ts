export interface Product {
  id: string;
  name: string;
  slug: string;
  scent_notes: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  badge: string | null;
  is_featured: boolean;
  is_active: boolean;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderData {
  order_code: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_address: string;
  payment_method: string;
  notes: string;
  subtotal_amount: number;
  shipping_amount: number;
  total_amount: number;
  status: string;
  items: {
    product_name: string;
    scent_notes: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  created_at: string;
}

export const paymentMethods = [
  "Transfer Via Bank",
  "DANA",
  "OVO",
  "QRIS",
];

export const WHATSAPP_NUMBER = "6287868403642";
export const SITE_NAME = "ScentLab_Store";
export const SITE_TAGLINE = "Serenity in Every Scent";

export function formatPrice(price: number): string {
  return `Rp${price.toLocaleString("id-ID")}`;
}

export function generateOrderCode(index: number): string {
  return `SL-${String(index).padStart(6, "0")}`;
}

export function getWhatsAppUrl(
  phone: string,
  message: string
): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppMessage(order: OrderData): string {
  const items = order.items
    .map(
      (item) =>
        `• ${item.product_name} x${item.quantity} = Rp${item.subtotal.toLocaleString("id-ID")}`
    )
    .join("\n");

  return `Halo ScentLab_Store, saya ingin konfirmasi pesanan.

Kode Order: ${order.order_code}
Nama: ${order.buyer_name}
No WA: ${order.buyer_phone}
Alamat: ${order.buyer_address}

Pesanan:
${items}

Total: Rp${order.total_amount.toLocaleString("id-ID")}
Metode Pembayaran: ${order.payment_method}

Saya akan mengirim bukti pembayaran.`;
}
