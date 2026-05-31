"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/shipping", label: "Ongkir", icon: Truck },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push("/admin/login");
  };

  // Don't render admin layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-nude-cream">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-warm-beige/40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1 text-dark-brown"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <Link href="/admin/dashboard" className="font-script text-xl text-dark-brown">
          ScentLab
        </Link>
        <div className="w-8" />
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-near-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-warm-beige/40 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-warm-beige/40">
          <Link href="/admin/dashboard" className="font-script text-2xl text-dark-brown">
            ScentLab_Store
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-dark-brown/60 hover:text-dark-brown lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-sans transition-colors ${
                  isActive
                    ? "bg-warm-beige/30 text-dark-brown font-medium"
                    : "text-dark-brown/60 hover:bg-warm-beige/20 hover:text-dark-brown"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-warm-beige/40">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-sans text-dark-brown/50 hover:text-dark-brown transition-colors"
          >
            <ShoppingBag size={18} />
            View Store
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-sans text-dark-brown/50 hover:text-dark-brown transition-colors w-full text-left"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen">{children}</main>
    </div>
  );
}