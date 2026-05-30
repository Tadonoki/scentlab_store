"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getDashboardStats } from "@/lib/actions/orders";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingPayment: number;
  completedOrders: number;
  totalProducts: number;
  recentOrders: {
    id: string;
    order_code: string;
    buyer_name: string;
    total_amount: number;
    status: string;
    created_at: string;
  }[];
  recentNotifications: {
    id: string;
    order_id: string;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
  }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
        setError("Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statusColors: Record<string, string> = {
    PENDING_PAYMENT: "bg-yellow-100 text-yellow-800 border-yellow-200",
    PAID: "bg-blue-100 text-blue-800 border-blue-200",
    PROCESSING: "bg-purple-100 text-purple-800 border-purple-200",
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-2 border-soft-gold/30 border-t-soft-gold rounded-full animate-spin" />
          <p className="text-sm text-dark-brown/50 font-sans mt-3">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <p className="font-serif text-xl text-dark-brown mb-2">Error</p>
          <p className="text-sm text-dark-brown/50 font-sans">{error || "Data tidak tersedia"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 border border-dark-brown/30 text-dark-brown text-sm font-sans hover:bg-dark-brown hover:text-nude-cream transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const unreadNotifications = stats.recentNotifications.filter((n) => !n.is_read);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-dark-brown">Dashboard</h1>
          <p className="text-sm text-dark-brown/50 font-sans mt-1">
            Overview toko ScentLab_Store
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-warm-beige/40 p-5">
          <div className="flex items-start justify-between mb-3">
            <DollarSign size={20} className="text-soft-gold" />
          </div>
          <p className="text-2xl font-serif text-dark-brown">
            {formatPrice(stats.totalRevenue)}
          </p>
          <p className="text-xs text-dark-brown/50 font-sans mt-1 uppercase tracking-wider">
            Total Revenue
          </p>
        </div>

        <div className="bg-white border border-warm-beige/40 p-5">
          <div className="flex items-start justify-between mb-3">
            <ShoppingBag size={20} className="text-soft-gold" />
          </div>
          <p className="text-2xl font-serif text-dark-brown">
            {stats.totalOrders}
          </p>
          <p className="text-xs text-dark-brown/50 font-sans mt-1 uppercase tracking-wider">
            Total Orders
          </p>
        </div>

        <div className="bg-white border border-warm-beige/40 p-5">
          <div className="flex items-start justify-between mb-3">
            <Clock size={20} className="text-yellow-600" />
          </div>
          <p className="text-2xl font-serif text-dark-brown">
            {stats.pendingPayment}
          </p>
          <p className="text-xs text-dark-brown/50 font-sans mt-1 uppercase tracking-wider">
            Pending Payment
          </p>
        </div>

        <div className="bg-white border border-warm-beige/40 p-5">
          <div className="flex items-start justify-between mb-3">
            <CheckCircle size={20} className="text-green-600" />
          </div>
          <p className="text-2xl font-serif text-dark-brown">
            {stats.completedOrders}
          </p>
          <p className="text-xs text-dark-brown/50 font-sans mt-1 uppercase tracking-wider">
            Completed
          </p>
        </div>

        <div className="bg-white border border-warm-beige/40 p-5">
          <div className="flex items-start justify-between mb-3">
            <Package size={20} className="text-soft-gold" />
          </div>
          <p className="text-2xl font-serif text-dark-brown">
            {stats.totalProducts}
          </p>
          <p className="text-xs text-dark-brown/50 font-sans mt-1 uppercase tracking-wider">
            Total Products
          </p>
        </div>

        <div className="bg-white border border-warm-beige/40 p-5">
          <div className="flex items-start justify-between mb-3">
            <AlertTriangle size={20} className="text-orange-600" />
          </div>
          <p className="text-2xl font-serif text-dark-brown">0</p>
          <p className="text-xs text-dark-brown/50 font-sans mt-1 uppercase tracking-wider">
            Low Stock
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg text-dark-brown">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-soft-gold font-sans hover:text-dark-brown transition-colors flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="bg-white border border-warm-beige/40 divide-y divide-warm-beige/30">
            {stats.recentOrders.length === 0 ? (
              <div className="p-8 text-center text-dark-brown/40 font-sans text-sm">
                Belum ada pesanan
              </div>
            ) : (
              stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 hover:bg-warm-beige/10 transition-colors"
                >
                  <div>
                    <p className="font-serif text-sm text-dark-brown">
                      {order.order_code}
                    </p>
                    <p className="text-xs text-dark-brown/50 font-sans mt-0.5">
                      {order.buyer_name} &middot;{" "}
                      {new Date(order.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-sans text-dark-brown">
                      {formatPrice(order.total_amount)}
                    </p>
                    <span
                      className={`inline-block text-[10px] px-2 py-0.5 border font-sans mt-1 ${
                        statusColors[order.status] || ""
                      }`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg text-dark-brown">Notifications</h2>
            {unreadNotifications.length > 0 && (
              <span className="text-xs px-2 py-0.5 bg-soft-gold text-white font-sans">
                {unreadNotifications.length} new
              </span>
            )}
          </div>
          <div className="bg-white border border-warm-beige/40 divide-y divide-warm-beige/30">
            {stats.recentNotifications.length === 0 ? (
              <div className="p-8 text-center text-dark-brown/40 font-sans text-sm">
                Belum ada notifikasi
              </div>
            ) : (
              stats.recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 ${
                    !notif.is_read ? "bg-warm-beige/10" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans text-dark-brown font-medium">
                        {notif.title}
                      </p>
                      <p className="text-xs text-dark-brown/50 font-sans mt-1">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-dark-brown/30 font-sans mt-1">
                        {new Date(notif.created_at).toLocaleDateString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!notif.is_read && (
                      <span className="w-2 h-2 bg-soft-gold rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/products/new"
          className="bg-white border border-warm-beige/40 p-4 text-center hover:border-soft-gold/60 transition-colors"
        >
          <Package size={24} className="mx-auto text-soft-gold mb-2" />
          <p className="text-xs font-sans text-dark-brown font-medium">Add Product</p>
        </Link>
        <Link
          href="/admin/orders"
          className="bg-white border border-warm-beige/40 p-4 text-center hover:border-soft-gold/60 transition-colors"
        >
          <ShoppingBag size={24} className="mx-auto text-soft-gold mb-2" />
          <p className="text-xs font-sans text-dark-brown font-medium">All Orders</p>
        </Link>
        <Link
          href="/admin/products"
          className="bg-white border border-warm-beige/40 p-4 text-center hover:border-soft-gold/60 transition-colors"
        >
          <Package size={24} className="mx-auto text-soft-gold mb-2" />
          <p className="text-xs font-sans text-dark-brown font-medium">Products</p>
        </Link>
        <Link
          href="/"
          className="bg-white border border-warm-beige/40 p-4 text-center hover:border-soft-gold/60 transition-colors"
        >
          <TrendingUp size={24} className="mx-auto text-soft-gold mb-2" />
          <p className="text-xs font-sans text-dark-brown font-medium">View Store</p>
        </Link>
      </div>
    </div>
  );
}