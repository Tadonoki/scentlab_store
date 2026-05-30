import React from "react";
import {
  Phone,
  Mail,
  Heart,
  Globe,
  MessageCircle,
  ShoppingBag as ShopIcon,
  Camera,
} from "lucide-react";
import {
  SITE_NAME,
  WHATSAPP_NUMBER,
  getWhatsAppUrl,
} from "@/lib/products";

export default function Footer() {
  const whatsappUrl = getWhatsAppUrl(
    WHATSAPP_NUMBER,
    "Halo ScentLab_Store, saya ingin bertanya tentang produk."
  );

  return (
    <footer className="bg-dark-brown text-nude-cream/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3
              className="font-script text-3xl text-nude-cream mb-2"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              {SITE_NAME}
            </h3>
            <p className="text-sm font-sans text-nude-cream/60 leading-relaxed">
              Serenity in Every Scent. Lilin aromaterapi premium untuk
              menemani momen relaksasi Anda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-soft-gold font-sans mb-4">
              Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#collections"
                  className="text-sm font-sans text-nude-cream/60 hover:text-soft-gold transition-colors"
                >
                  Collections
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  className="text-sm font-sans text-nude-cream/60 hover:text-soft-gold transition-colors"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-sm font-sans text-nude-cream/60 hover:text-soft-gold transition-colors"
                >
                  Testimoni
                </a>
              </li>
              <li>
                <a
                  href="#story"
                  className="text-sm font-sans text-nude-cream/60 hover:text-soft-gold transition-colors"
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-sm font-sans text-nude-cream/60 hover:text-soft-gold transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-soft-gold font-sans mb-4">
              Social Media
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://shopee.co.id/scentlab_store?categoryId=100636&entryPoint=ShopByPDP&itemId=54609453824"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-sans text-nude-cream/60 hover:text-soft-gold transition-colors"
                >
                  <ShopIcon size={14} />
                  <span>Shopee</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-sans text-nude-cream/60 hover:text-soft-gold transition-colors"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/scentlab_store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-sans text-nude-cream/60 hover:text-soft-gold transition-colors"
                >
                  <Camera size={14} />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-sans text-nude-cream/60 hover:text-soft-gold transition-colors"
                >
                  <Globe size={14} />
                  <span>Facebook</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-soft-gold font-sans mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-sans text-nude-cream/60 hover:text-soft-gold transition-colors"
                >
                  <Phone size={14} />
                  <span>+62 878-8684-0364</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm font-sans text-nude-cream/60 hover:text-soft-gold transition-colors"
                >
                  <Globe size={14} />
                  <span>scentlab_store</span>
                </a>
              </li>
              {/* <li>
                <a
                  href="mailto:hello@scentlabstore.com"
                  className="flex items-center gap-2 text-sm font-sans text-nude-cream/60 hover:text-soft-gold transition-colors"
                >
                  <Mail size={14} />
                  <span>hello@scentlabstore.com</span>
                </a>
              </li> */}
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-nude-cream/10 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-sans text-nude-cream/40">
              &copy; {new Date().getFullYear()} {SITE_NAME}. All rights
              reserved.
            </p>
            <p className="text-xs font-sans text-nude-cream/40 flex items-center gap-1">
              Made with <Heart size={12} className="text-red-400" /> for
              serenity seekers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}