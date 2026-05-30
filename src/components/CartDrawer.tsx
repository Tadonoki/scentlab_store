"use client";

import React, { useState, useEffect } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import CheckoutForm from "./CheckoutForm";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal, totalItems, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset checkout view when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setShowCheckout(false), 300);
    }
  }, [isOpen]);

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-near-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-nude-cream shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-warm-beige/40">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="text-dark-brown" />
              <h2 className="font-serif text-lg text-dark-brown">Shopping Bag</h2>
              {totalItems > 0 && (
                <span className="text-sm text-soft-gold font-sans">
                  ({totalItems} items)
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 text-dark-brown/60 hover:text-dark-brown transition-colors"
              aria-label="Close cart"
            >
              <X size={22} />
            </button>
          </div>

          {showCheckout ? (
            <CheckoutForm onBack={handleCloseCheckout} onClose={onClose} />
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag size={48} className="text-soft-taupe mb-4" />
                    <p className="text-dark-brown/60 font-serif text-lg mb-2">
                      Your bag is empty
                    </p>
                    <p className="text-dark-brown/40 text-sm font-sans">
                      Add some products to get started
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 px-6 py-2.5 bg-soft-gold text-white text-sm tracking-wider uppercase font-sans hover:bg-soft-gold/90 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-4 pb-4 border-b border-warm-beige/30 last:border-0"
                      >
                        {/* Product image */}
                        <div className="w-20 h-20 bg-warm-beige/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.product.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl">🕯️</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-sm text-dark-brown font-medium truncate">
                            {item.product.name}
                          </h3>
                          {item.product.badge && (
                            <span className="inline-block text-[10px] uppercase tracking-wider text-soft-gold font-sans mt-0.5">
                              {item.product.badge}
                            </span>
                          )}
                          <p className="text-sm text-dark-brown/70 font-sans mt-1">
                            {formatPrice(item.product.price)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center border border-warm-beige/60">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                                className="p-1.5 text-dark-brown/60 hover:text-dark-brown transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3 py-1 text-sm font-sans text-dark-brown min-w-[24px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                                className="p-1.5 text-dark-brown/60 hover:text-dark-brown transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="p-1.5 text-dark-brown/40 hover:text-red-500 transition-colors ml-auto"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-sans text-dark-brown font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="px-6 py-5 border-t border-warm-beige/40 bg-warm-beige/20">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-sans uppercase tracking-wider text-dark-brown/70">
                      Subtotal
                    </span>
                    <span className="text-lg font-serif text-dark-brown font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="text-xs text-dark-brown/50 font-sans mb-4">
                    Shipping costs will be calculated at checkout
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={clearCart}
                      className="flex-1 px-4 py-2.5 border border-warm-beige/60 text-dark-brown/70 text-sm tracking-wider uppercase font-sans hover:bg-warm-beige/30 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="flex-1 px-4 py-2.5 bg-dark-brown text-nude-cream text-sm tracking-wider uppercase font-sans hover:bg-dark-brown/90 transition-colors"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}