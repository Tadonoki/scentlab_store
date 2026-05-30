"use client";

import React from "react";
import { ShoppingBag, Sparkles } from "lucide-react";
import { Product, formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, triggerToast } = useCart();
  const handleAddToCart = () => {
    addItem(product);
    triggerToast("Produk berhasil ditambahkan ke keranjang");
  };

  const getBadgeStyle = (badge: string | null) => {
    switch (badge) {
      case "Best Seller":
        return "bg-soft-gold text-white";
      case "Premium":
        return "bg-dark-brown text-nude-cream";
      case "New":
        return "bg-green-700 text-white";
      case "Floral":
        return "bg-pink-300 text-dark-brown";
      case "Relax":
        return "bg-blue-300 text-dark-brown";
      case "Fresh":
        return "bg-lime-300 text-dark-brown";
      default:
        return "bg-warm-beige text-dark-brown";
    }
  };

  return (
    <div className="group bg-white border border-warm-beige/40 hover:border-soft-gold/60 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square bg-warm-beige/30 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div
                className="text-5xl md:text-6xl text-soft-gold/40 font-script mb-2"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                🕯️
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-soft-taupe font-sans">
                {product.category}
              </p>
            </div>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <div
            className={`absolute top-3 left-3 px-3 py-1 text-[10px] uppercase tracking-wider font-sans font-medium ${getBadgeStyle(
              product.badge
            )}`}
          >
            {product.badge}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-dark-brown/0 group-hover:bg-dark-brown/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            className="bg-dark-brown text-nude-cream px-5 py-2.5 text-sm tracking-wider uppercase font-sans flex items-center gap-2 hover:bg-soft-gold transition-colors translate-y-2 group-hover:translate-y-0 duration-300"
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between mb-1">
          <h3
            className="font-serif text-base md:text-lg text-dark-brown group-hover:text-soft-gold transition-colors"
          >
            {product.name}
          </h3>
          <span className="text-sm md:text-base font-sans text-dark-brown font-medium ml-2 whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles size={12} className="text-soft-gold" />
          <p className="text-[11px] md:text-xs text-soft-taupe font-sans italic">
            {product.scent_notes}
          </p>
        </div>

        <p className="text-xs md:text-sm text-dark-brown/60 font-sans leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Mobile Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full py-2.5 bg-dark-brown/5 text-dark-brown text-xs tracking-wider uppercase font-sans hover:bg-dark-brown hover:text-nude-cream transition-colors md:hidden flex items-center justify-center gap-2"
        >
          <ShoppingBag size={14} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}