"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, Filter } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getAllOrders } from "@/lib/actions/orders";

const statusColors: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

interface OrderItem {
  id: string;
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
  created_at: string;
  updated_at: string;
  items: {
    product_name: string;
    scent_notes: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError("Gagal memuat data pesanan");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statuses = [
    "ALL",
    "PENDING_PAYMENT",
    "PAID",
    "PROCESSING",
    "COMPLETED",
    "CANCELLED",
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer_phone.includes(searchQuery);
    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) =>
    statusColors[status] || "bg-gray-50 text-gray-700 border-gray-200";

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-2 border-soft-gold/30 border-t-soft-gold rounded-full animate-spin" />
          <p className="text-sm text-dark-brown/50 font-sans mt-3">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <p className="font-serif text-xl text-dark-brown mb-2">Error</p>
          <p className="text-sm text-dark-brown/50 font-sans">{error}</p>
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl text-dark-brown">Orders</h1>
          <p className="text-sm text-dark-brown/50 font-sans mt-1">
            Kelola pesanan pelanggan
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-taupe"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-warm-beige/60 text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-warm-beige/60 bg-white text-dark-brown text-sm font-sans hover:bg-warm-beige/20 transition-colors"
          >
            <Filter size={16} />
            {statusFilter === "ALL" ? "All Status" : statusFilter.replace(/_/g, " ")}
          </button>
          {showFilter && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-warm-beige/40 shadow-lg z-10">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowFilter(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm font-sans hover:bg-warm-beige/20 transition-colors ${
                    statusFilter === status
                      ? "text-soft-gold font-medium"
                      : "text-dark-brown/70"
                  }`}
                >
                  {status === "ALL" ? "All Status" : status.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-warm-beige/40 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-warm-beige/40 bg-warm-beige/20">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-dark-brown/60 font-sans">
                Order Code
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-dark-brown/60 font-sans">
                Customer
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-dark-brown/60 font-sans">
                Phone
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-dark-brown/60 font-sans">
                Total
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-dark-brown/60 font-sans">
                Payment
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-dark-brown/60 font-sans">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-dark-brown/60 font-sans">
                Date
              </th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-dark-brown/60 font-sans">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-beige/20">
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-dark-brown/40 font-sans text-sm"
                >
                  {orders.length === 0 ? "Belum ada pesanan" : "No orders found matching filter"}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-warm-beige/10 transition-colors"
                >
                  <td className="px-4 py-4">
                    <span className="font-mono text-sm text-dark-brown">
                      {order.order_code}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-serif text-sm text-dark-brown">
                      {order.buyer_name}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm font-sans text-dark-brown/70">
                    {order.buyer_phone}
                  </td>
                  <td className="px-4 py-4 text-sm font-sans text-dark-brown">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="px-4 py-4 text-xs font-sans text-dark-brown/60">
                    {order.payment_method}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block text-[10px] px-2 py-0.5 border font-sans ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs font-sans text-dark-brown/50">
                    {new Date(order.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs font-sans text-soft-gold hover:text-dark-brown transition-colors"
                    >
                      <Eye size={14} />
                      Detail
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 text-xs text-dark-brown/40 font-sans">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>
    </div>
  );
}