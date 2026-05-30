"use client";

import React, { useState } from "react";
import { ShoppingBag, Menu, X, Phone } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { SITE_NAME, WHATSAPP_NUMBER, INSTAGRAM_URL, getWhatsAppUrl } from "@/lib/utils";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const whatsappUrl = getWhatsAppUrl(
    WHATSAPP_NUMBER,
    "Halo ScentLab_Store, saya ingin bertanya tentang produk lilin aromaterapi."
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-nude-cream/95 backdrop-blur-sm border-b border-warm-beige/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile layout (unchanged) */}
          <div className="flex items-center justify-between h-16 md:hidden">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-dark-brown hover:text-soft-gold transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Logo */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center hover:opacity-80 transition-opacity"
            >
              <h1
                className="font-script text-2xl text-dark-brown leading-none"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                {SITE_NAME}
              </h1>
              <p className="text-[10px] tracking-[0.2em] uppercase text-soft-gold font-sans mt-0.5">
                Serenity in Every Scent
              </p>
            </a>

            {/* Mobile Cart */}
            <div className="flex items-center">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-dark-brown hover:text-soft-gold transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-soft-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-sans font-medium">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop layout - 3 column grid for perfect centering */}
          <div className="hidden md:grid md:grid-cols-3 md:items-center h-16">
            {/* Left: Navigation Menu */}
            <div className="flex items-center gap-6 lg:gap-8">
              <button
                onClick={() => scrollToSection("collections")}
                className="text-xs lg:text-sm tracking-widest uppercase text-dark-brown/80 hover:text-soft-gold transition-colors font-sans whitespace-nowrap"
              >
                Collections
              </button>
              <button
                onClick={() => scrollToSection("products")}
                className="text-xs lg:text-sm tracking-widest uppercase text-dark-brown/80 hover:text-soft-gold transition-colors font-sans whitespace-nowrap"
              >
                Products
              </button>
            </div>

            {/* Center: Logo (perfectly centered via grid) */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center hover:opacity-80 transition-opacity justify-self-center"
            >
              <h1
                className="font-script text-2xl lg:text-3xl text-dark-brown leading-none"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                {SITE_NAME}
              </h1>
              <p className="text-[10px] lg:text-xs tracking-[0.2em] uppercase text-soft-gold font-sans mt-0.5">
                Serenity in Every Scent
              </p>
            </a>

            {/* Right: Chat CS + Cart */}
            <div className="flex items-center gap-3 lg:gap-4 justify-end">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm text-dark-brown/80 hover:text-soft-gold transition-colors font-sans whitespace-nowrap"
              >
                <Phone size={15} />
                <span>Chat CS</span>
              </a>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-dark-brown hover:text-soft-gold transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-soft-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-sans font-medium">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-nude-cream border-b border-warm-beige/40">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => scrollToSection("collections")}
                className="block w-full text-left py-2 text-sm tracking-widest uppercase text-dark-brown/80 hover:text-soft-gold transition-colors font-sans"
              >
                Collections
              </button>
              <button
                onClick={() => scrollToSection("products")}
                className="block w-full text-left py-2 text-sm tracking-widest uppercase text-dark-brown/80 hover:text-soft-gold transition-colors font-sans"
              >
                Products
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="block w-full text-left py-2 text-sm tracking-widest uppercase text-dark-brown/80 hover:text-soft-gold transition-colors font-sans"
              >
                Testimoni
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left py-2 text-sm tracking-widest uppercase text-dark-brown/80 hover:text-soft-gold transition-colors font-sans"
              >
                Contact
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-2 text-sm text-dark-brown/80 hover:text-soft-gold transition-colors font-sans"
              >
                <Phone size={16} />
                <span>Chat CS via WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}