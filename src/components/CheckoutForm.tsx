"use client";

import React, { useState } from "react";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice, PAYMENT_METHODS } from "@/lib/utils";
import { createOrder } from "@/lib/actions/orders";
import Receipt from "./Receipt";

interface CheckoutFormProps {
  onBack: () => void;
  onClose: () => void;
}

interface FormData {
  buyer_name: string;
  buyer_phone: string;
  buyer_address: string;
  payment_method: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutForm({ onBack, onClose }: CheckoutFormProps) {
  const { items, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState<FormData>({
    buyer_name: "",
    buyer_phone: "",
    buyer_address: "",
    payment_method: PAYMENT_METHODS[0],
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [orderData, setOrderData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.buyer_name.trim() || formData.buyer_name.trim().length < 2) {
      newErrors.buyer_name = "Nama minimal 2 karakter";
    }
    if (
      !formData.buyer_phone.trim() ||
      !/^(\+?62|0)\d{8,12}$/.test(formData.buyer_phone.replace(/\s/g, ""))
    ) {
      newErrors.buyer_phone = "Nomor WhatsApp tidak valid (contoh: 08123456789)";
    }
    if (!formData.buyer_address.trim() || formData.buyer_address.trim().length < 10) {
      newErrors.buyer_address = "Alamat minimal 10 karakter";
    }
    if (!formData.payment_method) {
      newErrors.payment_method = "Pilih metode pembayaran";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const shipping = subtotal >= 250000 ? 0 : 15000;

      const orderResult = await createOrder({
        buyerName: formData.buyer_name,
        buyerPhone: formData.buyer_phone.replace(/\s/g, ""),
        buyerAddress: formData.buyer_address,
        paymentMethod: formData.payment_method,
        notes: formData.notes,
        subtotal: subtotal,
        shippingCost: shipping,
        totalAmount: subtotal + shipping,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          scentNotes: item.product.scent_notes,
          quantity: item.quantity,
          price: item.product.price,
          subtotal: item.product.price * item.quantity,
        })),
      });

      setOrderData(orderResult);
    } catch (err) {
      setSubmitError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (orderData) {
    return (
      <div className="flex-1 overflow-y-auto">
        <Receipt orderData={orderData} onClose={onClose} clearCart={clearCart} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Back Button */}
      <div className="px-6 py-3 border-b border-warm-beige/30">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-dark-brown/60 hover:text-dark-brown transition-colors font-sans"
        >
          <ArrowLeft size={16} />
          Back to cart
        </button>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
        <h3 className="font-serif text-base text-dark-brown">Shipping Details</h3>

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-sans">
            {submitError}
          </div>
        )}

        {/* Nama */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-dark-brown/70 font-sans mb-1.5">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="buyer_name"
            value={formData.buyer_name}
            onChange={handleChange}
            placeholder="Nama lengkap pembeli"
            className={`w-full px-4 py-2.5 bg-white border ${
              errors.buyer_name ? "border-red-400" : "border-warm-beige/60"
            } text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors`}
          />
          {errors.buyer_name && (
            <p className="text-xs text-red-500 mt-1 font-sans">{errors.buyer_name}</p>
          )}
        </div>

        {/* No WhatsApp */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-dark-brown/70 font-sans mb-1.5">
            Nomor WhatsApp
          </label>
          <input
            type="tel"
            name="buyer_phone"
            value={formData.buyer_phone}
            onChange={handleChange}
            placeholder="08123456789"
            className={`w-full px-4 py-2.5 bg-white border ${
              errors.buyer_phone ? "border-red-400" : "border-warm-beige/60"
            } text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors`}
          />
          {errors.buyer_phone && (
            <p className="text-xs text-red-500 mt-1 font-sans">{errors.buyer_phone}</p>
          )}
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-dark-brown/70 font-sans mb-1.5">
            Alamat Lengkap
          </label>
          <textarea
            name="buyer_address"
            value={formData.buyer_address}
            onChange={handleChange}
            placeholder="Jalan, kelurahan, kecamatan, kota, provinsi, kode pos"
            rows={3}
            className={`w-full px-4 py-2.5 bg-white border ${
              errors.buyer_address ? "border-red-400" : "border-warm-beige/60"
            } text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors resize-none`}
          />
          {errors.buyer_address && (
            <p className="text-xs text-red-500 mt-1 font-sans">
              {errors.buyer_address}
            </p>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-dark-brown/70 font-sans mb-1.5">
            Metode Pembayaran
          </label>
          <div className="relative">
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-warm-beige/60 text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors appearance-none"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            <CreditCard
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-brown/40 pointer-events-none"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-dark-brown/70 font-sans mb-1.5">
            Catatan (opsional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Catatan untuk pesanan"
            rows={2}
            className="w-full px-4 py-2.5 bg-white border border-warm-beige/60 text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors resize-none"
          />
        </div>

        {/* Order Summary */}
        <div className="pt-2 border-t border-warm-beige/30">
          <h4 className="text-xs uppercase tracking-wider text-dark-brown/70 font-sans mb-3">
            Order Summary
          </h4>
          <div className="space-y-2 text-sm font-sans">
            <div className="flex justify-between text-dark-brown/70">
              <span>Subtotal ({items.length} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-dark-brown/70">
              <span>Shipping</span>
              <span>
                {subtotal >= 250000
                  ? "FREE"
                  : formatPrice(15000)}
              </span>
            </div>
            {subtotal < 250000 && (
              <p className="text-[11px] text-soft-gold">
                Free shipping for orders over Rp250.000
              </p>
            )}
            <div className="flex justify-between text-dark-brown font-medium pt-2 border-t border-warm-beige/30">
              <span>Total</span>
              <span className="font-serif">
                {formatPrice(subtotal + (subtotal >= 250000 ? 0 : 15000))}
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-dark-brown text-nude-cream text-sm tracking-wider uppercase font-sans hover:bg-dark-brown/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}