"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit3, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getAllProducts, deleteProduct, toggleProductActive } from "@/lib/actions/products";
import type { Product } from "@/lib/utils";

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProductList(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const filteredProducts = productList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.scent_notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleActive = async (id: string | undefined, currentActive: boolean) => {
    if (!id) {
      showToast("Product ID tidak valid", "error");
      return;
    }
    try {
      await toggleProductActive(id, !currentActive);
      setProductList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !currentActive } : p))
      );
      showToast(
        `Produk berhasil ${!currentActive ? "diaktifkan" : "dinonaktifkan"}`,
        "success"
      );
    } catch (err) {
      console.error("Failed to toggle product:", err);
      showToast("Gagal mengubah status produk", "error");
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      showToast("Product ID tidak valid", "error");
      return;
    }

    // Find product for confirmation message
    const product = productList.find((p) => p.id === id);
    const productName = product?.name || "produk ini";

    if (!window.confirm(`Yakin ingin menghapus "${productName}" secara permanen?`)) {
      return;
    }

    try {
      const result = await deleteProduct(id);
      if (result.success) {
        // Hard delete — remove from list entirely
        setProductList((prev) => prev.filter((p) => p.id !== id));
        showToast(`Produk "${productName}" berhasil dihapus permanen`, "success");
      } else {
        showToast(result.error || "Gagal menghapus produk", "error");
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("Gagal menghapus produk", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-16">
          <span className="inline-block w-6 h-6 border-2 border-soft-gold/30 border-t-soft-gold rounded-full animate-spin" />
          <span className="ml-3 text-sm text-dark-brown/50 font-sans">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 shadow-lg text-sm font-sans transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-700 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{toast.type === "success" ? "✓" : "✕"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl text-dark-brown">Products</h1>
          <p className="text-sm text-dark-brown/50 font-sans mt-1">
            Kelola produk toko ScentLab_Store
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-dark-brown text-nude-cream text-sm tracking-wider uppercase font-sans hover:bg-soft-gold transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-taupe" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-warm-beige/60 text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white border border-warm-beige/40 overflow-x-auto">
        {filteredProducts.length === 0 ? (
          <div className="px-4 py-12 text-center text-dark-brown/40 font-sans text-sm">
            No products found
          </div>
        ) : (
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-warm-beige/40 bg-warm-beige/20">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-dark-brown/60 font-sans">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-dark-brown/60 font-sans">
                  Price
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-dark-brown/60 font-sans">
                  Stock
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-dark-brown/60 font-sans">
                  Badge
                </th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-dark-brown/60 font-sans">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-dark-brown/60 font-sans">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-beige/20">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-warm-beige/10 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-warm-beige/50 flex items-center justify-center flex-shrink-0">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-script text-sm text-soft-gold/60">🕯️</span>
                        )}
                      </div>
                      <div>
                        <p className="font-serif text-sm text-dark-brown">{product.name}</p>
                        <p className="text-xs text-dark-brown/40 font-sans truncate max-w-[200px]">
                          {product.scent_notes}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-sans text-dark-brown">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-4 text-sm font-sans text-dark-brown">{product.stock}</td>
                  <td className="px-4 py-4">
                    {product.badge && (
                      <span className="text-[10px] px-2 py-0.5 bg-soft-gold/10 text-soft-gold border border-soft-gold/30 font-sans uppercase tracking-wider">
                        {product.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 border font-sans uppercase tracking-wider ${
                        product.is_active
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleActive(product.id, product.is_active)}
                        className="p-1.5 text-dark-brown/40 hover:text-dark-brown transition-colors"
                        title={product.is_active ? "Deactivate" : "Activate"}
                      >
                        {product.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-1.5 text-dark-brown/40 hover:text-soft-gold transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-dark-brown/40 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 text-xs text-dark-brown/40 font-sans">
        Showing {filteredProducts.length} of {productList.length} products
      </div>
    </div>
  );
}