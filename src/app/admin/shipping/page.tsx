"use client";

import React, { useState, useEffect } from "react";
import { Search, Save, ToggleLeft, ToggleRight, Check, AlertCircle, Plus, X } from "lucide-react";
import { getShippingRates, updateShippingRate, createShippingRate } from "@/lib/actions/shipping";
import { formatPrice } from "@/lib/utils";

interface ShippingRate {
  id: string;
  province: string;
  shippingCost: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminShippingPage() {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCosts, setEditingCosts] = useState<Record<string, string>>({});
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // New Province Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProvinceName, setNewProvinceName] = useState("");
  const [newProvinceCost, setNewProvinceCost] = useState("");
  const [newProvinceActive, setNewProvinceActive] = useState(true);
  const [addingProvince, setAddingProvince] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getShippingRates();
        // Map Drizzle output timestamps appropriately
        setRates(data as any);
        // Initialize editing costs map
        const costsMap: Record<string, string> = {};
        data.forEach((r) => {
          costsMap[r.id] = r.shippingCost.toString();
        });
        setEditingCosts(costsMap);
      } catch (err) {
        console.error("Failed to load shipping rates:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCostChange = (id: string, value: string) => {
    // Only allow digits
    if (/^\d*$/.test(value)) {
      setEditingCosts((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleToggleActive = async (id: string) => {
    const rate = rates.find((r) => r.id === id);
    if (!rate) return;

    const newActiveState = !rate.isActive;
    const currentCost = parseInt(editingCosts[id] || "0", 10);

    try {
      const updated = await updateShippingRate(id, currentCost, newActiveState);
      if (updated) {
        setRates((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isActive: newActiveState } : r))
        );
        showToast("success", `Status ${rate.province} berhasil diubah`);
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Gagal mengubah status aktif");
    }
  };

  const handleSaveChanges = async (id: string) => {
    const rate = rates.find((r) => r.id === id);
    if (!rate) return;

    const costStr = editingCosts[id];
    if (!costStr) {
      showToast("error", "Biaya pengiriman tidak boleh kosong");
      return;
    }

    const cost = parseInt(costStr, 10);
    setSavingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const updated = await updateShippingRate(id, cost, rate.isActive);
      if (updated) {
        setRates((prev) =>
          prev.map((r) => (r.id === id ? { ...r, shippingCost: cost } : r))
        );
        showToast("success", `Tarif ongkir ${rate.province} berhasil diperbarui`);
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Gagal menyimpan perubahan tarif");
    } finally {
      setSavingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleAddProvinceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvinceName.trim()) {
      showToast("error", "Nama provinsi tidak boleh kosong");
      return;
    }
    if (!newProvinceCost.trim()) {
      showToast("error", "Biaya ongkir tidak boleh kosong");
      return;
    }
    const cost = parseInt(newProvinceCost, 10);
    if (isNaN(cost) || cost < 0) {
      showToast("error", "Biaya ongkir harus berupa angka >= 0");
      return;
    }

    setAddingProvince(true);
    try {
      const created = await createShippingRate(newProvinceName.trim(), cost, newProvinceActive);
      if (created) {
        setRates((prev) => [...prev, created as any].sort((a, b) => a.province.localeCompare(b.province)));
        setEditingCosts((prev) => ({ ...prev, [created.id]: cost.toString() }));
        showToast("success", `Provinsi ${newProvinceName} berhasil ditambahkan`);
        
        // Reset form
        setNewProvinceName("");
        setNewProvinceCost("");
        setNewProvinceActive(true);
        setShowAddForm(false);
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || "Gagal menambahkan provinsi";
      showToast("error", errMsg === "Provinsi sudah terdaftar" ? "Provinsi sudah terdaftar" : errMsg);
    } finally {
      setAddingProvince(false);
    }
  };

  const filteredRates = rates.filter((r) =>
    r.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-2 border-soft-gold/30 border-t-soft-gold rounded-full animate-spin" />
          <p className="text-sm text-dark-brown/50 font-sans mt-3">Memuat data tarif ongkir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 text-sm font-sans border shadow-lg flex items-center gap-2 ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl text-dark-brown">Kelola Tarif Ongkir</h1>
          <p className="text-sm text-dark-brown/50 font-sans mt-1">
            Kelola biaya pengiriman dan keaktifan provinsi untuk tujuan checkout pembeli.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-dark-brown text-nude-cream text-sm font-sans hover:bg-soft-gold transition-colors tracking-wider uppercase"
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? "Batal" : "Tambah Provinsi"}
        </button>
      </div>

      {/* Add New Province Form Panel */}
      {showAddForm && (
        <form
          onSubmit={handleAddProvinceSubmit}
          className="mb-8 p-6 bg-white border border-warm-beige/40 rounded-none space-y-4 shadow-sm"
        >
          <h3 className="font-serif text-lg text-dark-brown border-b border-warm-beige/20 pb-2">
            Tambah Provinsi Baru
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Province Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-dark-brown/70 font-sans mb-1.5">
                Nama Provinsi
              </label>
              <input
                type="text"
                placeholder="Contoh: Aceh"
                value={newProvinceName}
                onChange={(e) => setNewProvinceName(e.target.value)}
                className="w-full px-4 py-2 bg-nude-cream border border-warm-beige/60 text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold"
              />
            </div>

            {/* Cost */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-dark-brown/70 font-sans mb-1.5">
                Biaya Ongkir (Rp)
              </label>
              <input
                type="text"
                placeholder="Contoh: 20000"
                value={newProvinceCost}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    setNewProvinceCost(e.target.value);
                  }
                }}
                className="w-full px-4 py-2 bg-nude-cream border border-warm-beige/60 text-dark-brown text-sm font-sans font-mono focus:outline-none focus:border-soft-gold"
              />
            </div>

            {/* Status & Submit */}
            <div className="flex items-end justify-between gap-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider text-dark-brown/70 font-sans">Aktif:</span>
                <button
                  type="button"
                  onClick={() => setNewProvinceActive(!newProvinceActive)}
                  className="focus:outline-none"
                >
                  {newProvinceActive ? (
                    <ToggleRight size={28} className="text-soft-gold" />
                  ) : (
                    <ToggleLeft size={28} className="text-dark-brown/30" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={addingProvince}
                className="px-6 py-2 bg-soft-gold text-white text-sm uppercase tracking-wider font-sans hover:bg-dark-brown transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {addingProvince ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Simpan
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-white border border-warm-beige/40 p-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Cari provinsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-nude-cream border border-warm-beige/60 text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-brown/40" />
        </div>

        {/* Stats */}
        <div className="text-xs font-sans text-dark-brown/60 self-end sm:self-center">
          Total: <span className="font-semibold text-dark-brown">{filteredRates.length}</span> Provinsi
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-warm-beige/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-warm-beige/30 bg-nude-cream/35">
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-dark-brown/70 font-sans font-semibold">
                  Provinsi
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-dark-brown/70 font-sans font-semibold w-52">
                  Biaya Ongkir (Rp)
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-dark-brown/70 font-sans font-semibold text-center w-32">
                  Status
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-dark-brown/70 font-sans font-semibold text-right w-24">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-beige/20">
              {filteredRates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm font-sans text-dark-brown/40">
                    Tidak ada provinsi yang ditemukan
                  </td>
                </tr>
              ) : (
                filteredRates.map((rate) => (
                  <tr key={rate.id} className="hover:bg-nude-cream/10 transition-colors">
                    {/* Province Name */}
                    <td className="px-6 py-4">
                      <p className="font-serif text-sm font-bold text-dark-brown">{rate.province}</p>
                      <p className="text-[10px] text-dark-brown/40 font-mono mt-0.5">
                        Terakhir diubah: {new Date(rate.updatedAt).toLocaleDateString("id-ID")}
                      </p>
                    </td>

                    {/* Cost Input */}
                    <td className="px-6 py-4">
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-sm text-dark-brown/40 font-mono">Rp</span>
                        <input
                          type="text"
                          value={editingCosts[rate.id] ?? ""}
                          onChange={(e) => handleCostChange(rate.id, e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 bg-nude-cream border border-warm-beige/40 text-dark-brown font-mono text-sm focus:outline-none focus:border-soft-gold"
                        />
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(rate.id)}
                        className="inline-flex items-center justify-center p-1 focus:outline-none"
                        title={rate.isActive ? "Aktif (Klik untuk Nonaktifkan)" : "Nonaktif (Klik untuk Aktifkan)"}
                      >
                        {rate.isActive ? (
                          <ToggleRight size={28} className="text-soft-gold transition-colors" />
                        ) : (
                          <ToggleLeft size={28} className="text-dark-brown/30 transition-colors" />
                        )}
                      </button>
                    </td>

                    {/* Action Save Button */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleSaveChanges(rate.id)}
                        disabled={
                          savingIds[rate.id] ||
                          editingCosts[rate.id] === rate.shippingCost.toString()
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dark-brown text-nude-cream text-xs uppercase font-sans hover:bg-soft-gold transition-colors disabled:opacity-30 disabled:cursor-default"
                      >
                        {savingIds[rate.id] ? (
                          <div className="w-3.5 h-3.5 border border-nude-cream/30 border-t-nude-cream rounded-full animate-spin" />
                        ) : (
                          <Save size={14} />
                        )}
                        Simpan
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
