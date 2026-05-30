"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Sparkles, Award, Truck, ShieldCheck, Star, MessageCircle, ShoppingBag as ShopIcon, Camera, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Product, formatPrice, WHATSAPP_NUMBER, getWhatsAppUrl, SITE_NAME } from "@/lib/utils";
import { getActiveProducts, getFeaturedProducts } from "@/lib/actions/products";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [allProds, featuredProds] = await Promise.all([
          getActiveProducts(),
          getFeaturedProducts(),
        ]);
        setProducts(allProds);
        setFeatured(featuredProds);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const whatsappUrl = getWhatsAppUrl(
    WHATSAPP_NUMBER,
    "Halo ScentLab_Store, saya ingin bertanya tentang produk lilin aromaterapi."
  );

  const displayedProducts = showAllProducts ? products : products.slice(0, 6);

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-warm-beige/60 via-nude-cream to-nude-cream" />
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-20 left-10 w-64 h-64 border border-soft-gold/20 rounded-full" />
            <div className="absolute bottom-20 right-10 w-96 h-96 border border-soft-gold/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-soft-gold/10 rounded-full" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-20 pb-16">
            {/* Floral ornament */}
            <div className="text-4xl text-soft-gold/30 mb-6">✿</div>

            <h1
              className="font-script text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-dark-brown leading-tight mb-6"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              {SITE_NAME}
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl font-serif text-soft-gold mb-4 italic">
              &ldquo;Serenity in Every Scent&rdquo;
            </p>

            <p className="text-sm sm:text-base text-dark-brown/60 font-sans max-w-xl mx-auto mb-10 leading-relaxed">
              Temukan ketenangan dalam setiap aroma. Lilin aromaterapi premium
              crafted dengan bahan alami pilihan untuk menemani momen relaksasi
              terbaik Anda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={scrollToProducts}
                className="w-full sm:w-auto px-8 py-3.5 bg-dark-brown text-nude-cream text-sm tracking-widest uppercase font-sans hover:bg-soft-gold transition-colors flex items-center justify-center gap-2"
              >
                Mulai Belanja
                <ChevronRight size={16} />
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 border border-dark-brown/30 text-dark-brown text-sm tracking-widest uppercase font-sans hover:bg-dark-brown hover:text-nude-cream transition-colors"
              >
                Chat CS
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-16 max-w-lg mx-auto">
              <div className="text-center">
                <Truck size={20} className="mx-auto text-soft-gold mb-1" />
                <p className="text-[10px] uppercase tracking-wider text-dark-brown/50 font-sans">
                  Free Ship*
                </p>
              </div>
              <div className="text-center">
                <Award size={20} className="mx-auto text-soft-gold mb-1" />
                <p className="text-[10px] uppercase tracking-wider text-dark-brown/50 font-sans">
                  Premium
                </p>
              </div>
              <div className="text-center">
                <ShieldCheck size={20} className="mx-auto text-soft-gold mb-1" />
                <p className="text-[10px] uppercase tracking-wider text-dark-brown/50 font-sans">
                  Trusted
                </p>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-dark-brown/20 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-dark-brown/30 rounded-full mt-2" />
            </div>
          </div>
        </section>

        {/* ===== CURATED COLLECTIONS ===== */}
        <section id="collections" className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-soft-gold font-sans mb-3">
                Curated Collections
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-dark-brown mb-4">
                Temukan Aroma Favoritmu
              </h2>
              <div className="w-16 h-0.5 bg-soft-gold/60 mx-auto" />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-2 border-soft-gold/30 border-t-soft-gold rounded-full animate-spin" />
                <p className="text-sm text-dark-brown/50 font-sans mt-3">Memuat produk...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                {featured.map((product) => (
                  <div
                    key={product.id}
                    className="group cursor-pointer text-center"
                    onClick={() => {
                      const el = document.getElementById("products");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <div className="aspect-square bg-warm-beige/20 border border-warm-beige/40 group-hover:border-soft-gold/60 transition-all duration-300 flex items-center justify-center mb-3 overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div
                          className="font-script text-3xl md:text-4xl text-soft-gold/40"
                          style={{ fontFamily: "'Great Vibes', cursive" }}
                        >
                          🕯️
                        </div>
                      )}
                    </div>
                    <h3 className="font-serif text-sm md:text-base text-dark-brown group-hover:text-soft-gold transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-soft-taupe font-sans mt-0.5">
                      {product.scent_notes.split("|")[0].trim()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ===== BRAND STORY ===== */}
        {/* (unchanged) */}
        <section id="story" className="py-16 md:py-24 bg-gradient-to-b from-nude-cream to-warm-beige/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-4xl text-soft-gold/30 mb-6">✿</div>
            <h2 className="font-serif text-3xl md:text-4xl text-dark-brown mb-6">
              Our Story
            </h2>
            <div className="w-16 h-0.5 bg-soft-gold/60 mx-auto mb-8" />
            <p className="text-sm md:text-base text-dark-brown/70 font-sans leading-relaxed max-w-2xl mx-auto mb-6">
              ScentLab_Store lahir dari kecintaan pada aroma yang mampu membawa
              ketenangan dan kebahagiaan dalam setiap momen. Setiap lilin kami
              crafted dengan bahan-bahan alami pilihan, memadukan aroma floral,
              earthy, dan woody yang elegan.
            </p>
            <p className="text-sm md:text-base text-dark-brown/70 font-sans leading-relaxed max-w-2xl mx-auto mb-8">
              Dari Sweet Dreams yang lembut hingga Royal Arabian yang mewah,
              setiap varian diciptakan untuk menghadirkan pengalaman aromaterapi
              yang tak terlupakan.
            </p>
            <div className="text-soft-gold italic font-serif text-lg">
              &ldquo;Biarkan aroma membawamu pada ketenangan.&rdquo;
            </div>
          </div>
        </section>

        {/* ===== ALL PRODUCTS ===== */}
        <section id="products" className="py-16 md:py-24 bg-nude-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-soft-gold font-sans mb-3">
                Our Collection
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-dark-brown mb-4">
                All Products
              </h2>
              <div className="w-16 h-0.5 bg-soft-gold/60 mx-auto mb-6" />
              <p className="text-sm text-dark-brown/60 font-sans max-w-xl mx-auto">
                Setiap lilin dibuat dengan bahan premium untuk pengalaman aromaterapi terbaik.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-2 border-soft-gold/30 border-t-soft-gold rounded-full animate-spin" />
                <p className="text-sm text-dark-brown/50 font-sans mt-3">Memuat produk...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {products.length > 6 && !showAllProducts && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setShowAllProducts(true)}
                      className="px-8 py-3 border border-dark-brown/30 text-dark-brown text-sm tracking-widest uppercase font-sans hover:bg-dark-brown hover:text-nude-cream transition-colors inline-flex items-center gap-2"
                    >
                      Lihat Semua Produk
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}

                {showAllProducts && products.length > 6 && (
                  <div className="text-center mt-10">
                    <button
                      onClick={() => setShowAllProducts(false)}
                      className="px-8 py-3 border border-dark-brown/30 text-dark-brown text-sm tracking-widest uppercase font-sans hover:bg-dark-brown hover:text-nude-cream transition-colors"
                    >
                      Show Less
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section id="testimonials" className="py-16 md:py-24 bg-nude-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-soft-gold font-sans mb-3">
                Testimonials
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-dark-brown mb-4">
                Apa Kata Mereka
              </h2>
              <div className="w-16 h-0.5 bg-soft-gold/60 mx-auto mb-6" />
              <p className="text-sm text-dark-brown/60 font-sans max-w-xl mx-auto">
                Cerita pelanggan yang merasakan ketenangan dari setiap aroma ScentLab.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Sarah Amalia",
                  text: "Aromanya lembut banget, bikin kamar jadi lebih nyaman. Wanginya tahan lama dan packaging-nya cantik!",
                  rating: 5,
                  product: "Sweet Dreams",
                },
                {
                  name: "Dian Permata",
                  text: "Packaging cantik dan wanginya tahan lama. Sweet Dreams favoritku. Sudah repeat order 3 kali!",
                  rating: 5,
                  product: "Sweet Dreams",
                },
                {
                  name: "Rina Wijaya",
                  text: "Cocok untuk hadiah, tampilannya premium dan elegan. Teman-teman pada suka semua.",
                  rating: 5,
                  product: "Summer Bouquet",
                },
                {
                  name: "Aisha Nur",
                  text: "Suka banget dengan Royal Arabian, wanginya mewah dan elegan. Bikin kamar terasa seperti spa.",
                  rating: 5,
                  product: "Royal Arabian",
                },
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-warm-beige/40 p-6 md:p-8 text-center hover:border-soft-gold/60 transition-all duration-300 group"
                >
                  {/* Floral ornament */}
                  <div className="text-xl text-soft-gold/40 mb-4 transition-transform duration-300 group-hover:scale-110">
                    ✿
                  </div>
                  {/* Stars */}
                  <div className="flex items-center justify-center gap-0.5 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="text-soft-gold fill-soft-gold"
                      />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-sm text-dark-brown/70 font-sans leading-relaxed italic mb-5">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  {/* Author */}
                  <div>
                    <p className="font-serif text-sm text-dark-brown font-medium">
                      {testimonial.name}
                    </p>
                    <p className="text-[10px] text-soft-taupe font-sans tracking-wider mt-0.5">
                      {testimonial.product}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CONTACT / SOCIAL MEDIA ===== */}
        <section id="contact" className="py-16 md:py-24 bg-gradient-to-b from-warm-beige/30 to-nude-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-4xl text-soft-gold/30 mb-6">✿</div>
            <p className="text-xs uppercase tracking-[0.3em] text-soft-gold font-sans mb-3">
              Connect With Us
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-dark-brown mb-4">
              Temukan Kami
            </h2>
            <div className="w-16 h-0.5 bg-soft-gold/60 mx-auto mb-6" />
            <p className="text-sm text-dark-brown/60 font-sans max-w-xl mx-auto mb-10">
              Belanja dan hubungi ScentLab_Store melalui platform favorit Anda.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Shopee */}
              <a
                href="https://shopee.co.id/scentlab_store?categoryId=100636&entryPoint=ShopByPDP&itemId=54609453824"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-warm-beige/40 p-6 md:p-8 text-center hover:border-soft-gold/60 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 group-hover:bg-orange-100 transition-colors">
                  <ShopIcon size={22} />
                </div>
                <h3 className="font-serif text-sm text-dark-brown mb-1 group-hover:text-soft-gold transition-colors">
                  Shopee
                </h3>
                <p className="text-xs text-dark-brown/50 font-sans">
                  Belanja di Shopee
                </p>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/6287868403642"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-warm-beige/40 p-6 md:p-8 text-center hover:border-soft-gold/60 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-green-50 border border-green-200 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
                  <MessageCircle size={22} />
                </div>
                <h3 className="font-serif text-sm text-dark-brown mb-1 group-hover:text-soft-gold transition-colors">
                  WhatsApp
                </h3>
                <p className="text-xs text-dark-brown/50 font-sans">
                  +62 878-8684-0364
                </p>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/scentlab_store/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-warm-beige/40 p-6 md:p-8 text-center hover:border-soft-gold/60 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-500 group-hover:bg-pink-100 transition-colors">
                  <Camera size={22} />
                </div>
                <h3 className="font-serif text-sm text-dark-brown mb-1 group-hover:text-soft-gold transition-colors">
                  Instagram
                </h3>
                <p className="text-xs text-dark-brown/50 font-sans">
                  @scentlab_store
                </p>
              </a>

              {/* Facebook */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-warm-beige/40 p-6 md:p-8 text-center hover:border-soft-gold/60 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
                  <Globe size={22} />
                </div>
                <h3 className="font-serif text-sm text-dark-brown mb-1 group-hover:text-soft-gold transition-colors">
                  Facebook
                </h3>
                <p className="text-xs text-dark-brown/50 font-sans">
                  ScentLab Store
                </p>
              </a>
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 pt-8 border-t border-warm-beige/40 max-w-md mx-auto">
              <p className="text-sm text-dark-brown/60 font-sans mb-4">
                Ingin bertanya langsung? Klik tombol di bawah untuk chat dengan CS kami.
              </p>
              <a
                href={getWhatsAppUrl(
                  WHATSAPP_NUMBER,
                  "Halo ScentLab_Store, saya ingin bertanya tentang produk lilin aromaterapi."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-dark-brown text-nude-cream text-sm tracking-widest uppercase font-sans hover:bg-soft-gold transition-colors"
              >
                <MessageCircle size={16} />
                Hubungi CS
              </a>
            </div>
          </div>
        </section>

        {/* ===== FEATURES / WHY US ===== */}
        <section className="py-12 md:py-16 bg-warm-beige/30 border-y border-warm-beige/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <Sparkles size={24} className="mx-auto text-soft-gold mb-2" />
                <h4 className="font-serif text-sm text-dark-brown mb-1">Premium Quality</h4>
                <p className="text-xs text-dark-brown/50 font-sans">
                  Bahan alami pilihan
                </p>
              </div>
              <div className="text-center">
                <Truck size={24} className="mx-auto text-soft-gold mb-2" />
                <h4 className="font-serif text-sm text-dark-brown mb-1">Free Shipping</h4>
                <p className="text-xs text-dark-brown/50 font-sans">
                  Min. order Rp250rb
                </p>
              </div>
              <div className="text-center">
                <ShieldCheck size={24} className="mx-auto text-soft-gold mb-2" />
                <h4 className="font-serif text-sm text-dark-brown mb-1">Secure Checkout</h4>
                <p className="text-xs text-dark-brown/50 font-sans">
                  Data aman & rapi
                </p>
              </div>
              <div className="text-center">
                <Award size={24} className="mx-auto text-soft-gold mb-2" />
                <h4 className="font-serif text-sm text-dark-brown mb-1">Best Seller</h4>
                <p className="text-xs text-dark-brown/50 font-sans">
                  Produk terpercaya
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
