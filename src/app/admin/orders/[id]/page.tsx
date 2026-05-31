"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Phone, User, MapPin, CreditCard, Package, Printer, Truck } from "lucide-react";
import { formatPrice, WHATSAPP_NUMBER, getWhatsAppUrl } from "@/lib/utils";
import { getOrderDetail, updateOrderStatus } from "@/lib/actions/orders";
import { toPng } from "html-to-image";

const statusColors: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const statusOptions = [
  { value: "PENDING_PAYMENT", label: "Pending Payment" },
  { value: "PAID", label: "Paid" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

interface OrderItem {
  product_name: string;
  scent_notes: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_code: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_province?: string;
  buyer_address: string;
  payment_method: string;
  notes: string;
  subtotal_amount: number;
  shipping_amount: number;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [generatingLabel, setGeneratingLabel] = useState(false);

  const handleDownloadLabel = async () => {
    if (!labelRef.current || !order) return;
    setGeneratingLabel(true);
    try {
      const dataUrl = await toPng(labelRef.current, {
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `label-pengiriman-${order.order_code}.png`;
      link.href = dataUrl;
      link.click();
      showToast("success", "Label pengiriman berhasil diunduh");
    } catch (err) {
      console.error("Gagal membuat gambar label:", err);
      showToast("error", "Gagal mencetak label pengiriman");
    } finally {
      setGeneratingLabel(false);
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await getOrderDetail(orderId);
        if (!data) {
          setError("Order not found");
          return;
        }
        setOrder(data);
        setCurrentStatus(data.status);
      } catch (err) {
        console.error("Failed to load order:", err);
        setError("Gagal memuat detail pesanan");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusUpdate = async () => {
    if (!order || currentStatus === order.status) return;
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, currentStatus);
      setOrder({ ...order, status: currentStatus, updated_at: new Date().toISOString() });
      showToast("success", `Status berhasil diubah menjadi ${currentStatus.replace(/_/g, " ")}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      showToast("error", "Gagal mengubah status pesanan");
    } finally {
      setUpdating(false);
    }
  };

  const whatsappMessage = order
    ? `Halo ${order.buyer_name},\n\nKami dari ScentLab_Store ingin menginformasikan status pesanan Anda:\n\nKode Order: ${order.order_code}\nStatus: ${currentStatus.replace(/_/g, " ")}\n\nTerima kasih telah berbelanja di ScentLab_Store.`
    : "";

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-2 border-soft-gold/30 border-t-soft-gold rounded-full animate-spin" />
          <p className="text-sm text-dark-brown/50 font-sans mt-3">Memuat detail pesanan...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <p className="font-serif text-xl text-dark-brown mb-2">{error || "Order not found"}</p>
          <Link
            href="/admin/orders"
            className="text-sm text-soft-gold font-sans underline"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 text-sm font-sans border shadow-lg ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/orders"
          className="p-1.5 text-dark-brown/40 hover:text-dark-brown transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="font-serif text-2xl text-dark-brown">
            Order {order.order_code}
          </h1>
          <p className="text-sm text-dark-brown/50 font-sans mt-1">
            Detail pesanan pelanggan
          </p>
        </div>
        <span
          className={`text-xs px-3 py-1.5 border font-sans ${
            statusColors[order.status] || ""
          }`}
        >
          {order.status.replace(/_/g, " ")}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-warm-beige/40 p-6">
            <h2 className="font-serif text-lg text-dark-brown mb-4">
              Customer Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User size={16} className="text-soft-taupe flex-shrink-0" />
                <div>
                  <p className="text-xs text-dark-brown/40 font-sans">Name</p>
                  <p className="text-sm font-sans text-dark-brown">
                    {order.buyer_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-soft-taupe flex-shrink-0" />
                <div>
                  <p className="text-xs text-dark-brown/40 font-sans">
                    WhatsApp
                  </p>
                  <p className="text-sm font-sans text-dark-brown">
                    {order.buyer_phone}
                  </p>
                </div>
              </div>
              {order.buyer_province && (
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-soft-taupe flex-shrink-0" />
                  <div>
                    <p className="text-xs text-dark-brown/40 font-sans">Province</p>
                    <p className="text-sm font-sans text-dark-brown">{order.buyer_province}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Truck size={16} className="text-soft-taupe flex-shrink-0" />
                <div>
                  <p className="text-xs text-dark-brown/40 font-sans">Shipping Cost</p>
                  <p className="text-sm font-sans text-dark-brown">{formatPrice(order.shipping_amount)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className="text-soft-taupe flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs text-dark-brown/40 font-sans">
                    Address
                  </p>
                  <p className="text-sm font-sans text-dark-brown">
                    {order.buyer_address}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard size={16} className="text-soft-taupe flex-shrink-0" />
                <div>
                  <p className="text-xs text-dark-brown/40 font-sans">
                    Payment Method
                  </p>
                  <p className="text-sm font-sans text-dark-brown">
                    {order.payment_method}
                  </p>
                </div>
              </div>
              {order.notes && (
                <div className="flex items-start gap-3">
                  <Package size={16} className="text-soft-taupe flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-dark-brown/40 font-sans">Notes</p>
                    <p className="text-sm font-sans text-dark-brown">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-warm-beige/40 p-6">
            <h2 className="font-serif text-lg text-dark-brown mb-4">
              Order Items
            </h2>
            <div className="divide-y divide-warm-beige/20">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="font-serif text-sm text-dark-brown">
                      {item.product_name}
                    </p>
                    {item.scent_notes && (
                      <p className="text-[10px] text-dark-brown/40 font-sans mt-0.5">
                        {item.scent_notes}
                      </p>
                    )}
                    <p className="text-xs text-dark-brown/40 font-sans mt-0.5">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-sans text-dark-brown">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-warm-beige/40 mt-4 pt-4 space-y-1">
              <div className="flex items-center justify-between text-sm font-sans text-dark-brown/60">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal_amount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-sans text-dark-brown/60">
                <span>Shipping</span>
                <span>{formatPrice(order.shipping_amount)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-warm-beige/20">
                <p className="font-serif text-base text-dark-brown">Total</p>
                <p className="font-serif text-lg text-soft-gold">
                  {formatPrice(order.total_amount)}
                </p>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white border border-warm-beige/40 p-6">
            <h2 className="font-serif text-lg text-dark-brown mb-4">
              Order Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-sans text-dark-brown">
                    Order Created
                  </p>
                  <p className="text-xs text-dark-brown/40 font-sans">
                    {new Date(order.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              {order.status !== "PENDING_PAYMENT" && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-sans text-dark-brown">
                      Status updated to{" "}
                      <span className="font-medium">{order.status.replace(/_/g, " ")}</span>
                    </p>
                    <p className="text-xs text-dark-brown/40 font-sans">
                      {new Date(order.updated_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="space-y-6">
          {/* Update Status */}
          <div className="bg-white border border-warm-beige/40 p-6">
            <h2 className="font-serif text-lg text-dark-brown mb-4">
              Update Status
            </h2>
            <select
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-nude-cream border border-warm-beige/60 text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors mb-4"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || currentStatus === order.status}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-dark-brown text-nude-cream text-sm tracking-wider uppercase font-sans hover:bg-soft-gold transition-colors disabled:opacity-50"
            >
              {updating ? (
                <span className="inline-block w-4 h-4 border-2 border-nude-cream/30 border-t-nude-cream rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} />
                  Update
                </>
              )}
            </button>
            <button
              onClick={handleDownloadLabel}
              disabled={generatingLabel}
              className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-soft-gold text-white text-sm tracking-wider uppercase font-sans hover:bg-dark-brown transition-colors disabled:opacity-50"
            >
              {generatingLabel ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Printer size={16} />
                  Cetak Label Pengiriman
                </>
              )}
            </button>
          </div>

          {/* Contact Customer */}
          <div className="bg-white border border-warm-beige/40 p-6">
            <h2 className="font-serif text-lg text-dark-brown mb-4">
              Contact Customer
            </h2>
            <p className="text-xs text-dark-brown/50 font-sans mb-4">
              Hubungi pelanggan via WhatsApp untuk konfirmasi atau update
              pesanan.
            </p>
            <a
              href={getWhatsAppUrl(order.buyer_phone, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-soft-gold text-soft-gold text-sm tracking-wider uppercase font-sans hover:bg-soft-gold hover:text-white transition-colors"
            >
              <Phone size={16} />
              WhatsApp Customer
            </a>
          </div>

          {/* Quick Info */}
          <div className="bg-white border border-warm-beige/40 p-6">
            <h2 className="font-serif text-lg text-dark-brown mb-4">
              Quick Info
            </h2>
            <div className="space-y-3 text-sm font-sans">
              <div className="flex justify-between">
                <span className="text-dark-brown/50">Order Code</span>
                <span className="text-dark-brown font-mono">
                  {order.order_code}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-brown/50">Items</span>
                <span className="text-dark-brown">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} pcs
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-brown/50">Total</span>
                <span className="text-dark-brown font-medium">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden shipping label container */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <div
          ref={labelRef}
          className="w-[450px] p-6 bg-nude-cream border-2 border-dark-brown text-dark-brown font-sans flex flex-col gap-4"
          style={{ backgroundColor: "#F5EFE7", borderColor: "#3A2C24", color: "#3A2C24" }}
        >
          {/* Header */}
          <div className="text-center border-b border-dark-brown pb-3">
            <h1 className="font-serif text-2xl tracking-widest uppercase font-bold text-soft-gold">ScentLab_Store</h1>
            <p className="text-[10px] uppercase tracking-wider text-dark-brown/60">Serenity In Every Scent</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 border-b border-dark-brown/20 pb-4">
            {/* Sender */}
            <div className="border-r border-dark-brown/20 pr-4">
              <p className="text-[10px] uppercase font-bold tracking-wider text-soft-gold">Pengirim</p>
              <p className="text-sm font-serif font-bold mt-1 text-dark-brown">ScentLab_Store</p>
              <p className="text-xs font-mono mt-1 text-dark-brown/80">087868403642</p>
            </div>

            {/* Code */}
            <div className="pl-2 flex flex-col justify-center items-end text-right">
              <p className="text-[10px] uppercase font-bold tracking-wider text-soft-gold">No. Order</p>
              <p className="text-base font-mono font-bold text-dark-brown mt-0.5">{order.order_code}</p>
            </div>
          </div>

          {/* Recipient */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] uppercase font-bold tracking-wider text-soft-gold">Penerima</p>
            <div>
              <p className="text-xs text-dark-brown/40 font-sans">Nama Penerima</p>
              <p className="text-base font-serif font-bold text-dark-brown">{order.buyer_name}</p>
              <p className="text-xs text-dark-brown/40 font-sans mt-1">No Hp</p>
              <p className="text-sm font-mono text-dark-brown/80">{order.buyer_phone}</p>
            </div>
            
            {order.buyer_province && (
              <div className="mt-1">
                <p className="text-[10px] uppercase font-semibold text-dark-brown/50">Provinsi</p>
                <p className="text-xs font-sans text-dark-brown">{order.buyer_province}</p>
              </div>
            )}

            <div className="mt-1">
              <p className="text-[10px] uppercase font-semibold text-dark-brown/50">Alamat</p>
              <p className="text-xs font-sans leading-relaxed text-dark-brown">
                {order.buyer_address}
              </p>
            </div>

            {order.notes && (
              <div className="mt-2 p-2 bg-white/50 border border-dark-brown/10 text-xs">
                <p className="font-bold text-[9px] uppercase tracking-wider text-dark-brown/60">Catatan/Note:</p>
                <p className="mt-0.5 font-sans italic text-dark-brown">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-2 pt-3 border-t border-dark-brown/10 text-center">
            <p className="text-[9px] text-dark-brown/40 italic font-sans">Thank you for shopping with us!</p>
          </div>
        </div>
      </div>
    </div>
  );
}