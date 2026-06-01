"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import Link from "next/link";
import { createProduct } from "@/lib/actions/products";
import { compressImage } from "@/lib/image-utils";

export default function AdminNewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    scentNotes: "",
    description: "",
    price: "",
    stock: "",
    badge: "",
    category: "Lilin Aromaterapi",
    is_featured: false,
    is_active: true,
    imageUrl: "",
    discount_percent: "0",
    discount_active: false,
    weightGrams: "0",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nama produk harus diisi";
    if (!formData.scentNotes.trim()) newErrors.scentNotes = "Aroma notes harus diisi";
    if (!formData.description.trim()) newErrors.description = "Deskripsi harus diisi";
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Harga harus valid";
    if (!formData.stock || Number(formData.stock) < 0) newErrors.stock = "Stok harus valid";
    if (!formData.weightGrams || isNaN(Number(formData.weightGrams)) || Number(formData.weightGrams) < 1) {
      newErrors.weightGrams = "Berat produk wajib diisi angka minimal 1 gram";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await createProduct({
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        category: formData.category,
        scentNotes: formData.scentNotes,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        imageUrl: formData.imageUrl || undefined,
        badge: formData.badge || null,
        isFeatured: formData.is_featured,
        isActive: formData.is_active,
        discountPercent: Number(formData.discount_percent) || 0,
        discountActive: formData.discount_active,
        weightGrams: Number(formData.weightGrams),
      });
      router.push("/admin/products");
    } catch (err) {
      console.error("Failed to create product:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, imageUrl: "Hanya file gambar yang diperbolehkan" }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, imageUrl: "Ukuran gambar maksimal 5MB" }));
      return;
    }

    try {
      // Compress & resize before converting to base64
      const compressedBase64 = await compressImage(file);
      setImagePreview(compressedBase64);
      setFormData((prev) => ({ ...prev, imageUrl: compressedBase64 }));
      // Clear any previous image error
      setErrors((prev) => {
        const { imageUrl, ...rest } = prev;
        return rest;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal memproses gambar";
      setErrors((prev) => ({ ...prev, imageUrl: message }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/products"
          className="p-1.5 text-dark-brown/40 hover:text-dark-brown transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-2xl text-dark-brown">Add Product</h1>
          <p className="text-sm text-dark-brown/50 font-sans mt-1">
            Tambah produk baru ke toko
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-warm-beige/40 p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-dark-brown/60 font-sans mb-1.5">
                Nama Produk <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Sweet Dreams"
                className={`w-full px-4 py-2.5 bg-nude-cream border text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors ${
                  errors.name ? "border-red-300" : "border-warm-beige/60"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-dark-brown/60 font-sans mb-1.5">
                Kategori
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-nude-cream border border-warm-beige/60 text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors"
              >
                <option value="Lilin Aromaterapi">Lilin Aromaterapi</option>
                <option value="Lilin Dekorasi">Lilin Dekorasi</option>
                <option value="Essential Oil">Essential Oil</option>
                <option value="Reed Diffuser">Reed Diffuser</option>
                <option value="Pewangi Gantung">Pewangi Gantung</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-dark-brown/60 font-sans mb-1.5">
              Scent Notes <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="scentNotes"
              value={formData.scentNotes}
              onChange={handleChange}
              placeholder="Jasmine | Ylang-ylang | Vanilla"
              className={`w-full px-4 py-2.5 bg-nude-cream border text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors ${
                errors.scentNotes ? "border-red-300" : "border-warm-beige/60"
              }`}
            />
            {errors.scentNotes && (
              <p className="text-xs text-red-500 mt-1">{errors.scentNotes}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-dark-brown/60 font-sans mb-1.5">
              Deskripsi <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Deskripsi lengkap produk..."
              className={`w-full px-4 py-2.5 bg-nude-cream border text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors resize-none ${
                errors.description ? "border-red-300" : "border-warm-beige/60"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-dark-brown/60 font-sans mb-1.5">
                Harga (Rp) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="85000"
                className={`w-full px-4 py-2.5 bg-nude-cream border text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors ${
                  errors.price ? "border-red-300" : "border-warm-beige/60"
                }`}
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-dark-brown/60 font-sans mb-1.5">
                Stok <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="25"
                className={`w-full px-4 py-2.5 bg-nude-cream border text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors ${
                  errors.stock ? "border-red-300" : "border-warm-beige/60"
                }`}
              />
              {errors.stock && (
                <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-dark-brown/60 font-sans mb-1.5">
                Berat (gram) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="weightGrams"
                value={formData.weightGrams}
                onChange={handleChange}
                placeholder="500"
                className={`w-full px-4 py-2.5 bg-nude-cream border text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors ${
                  errors.weightGrams ? "border-red-300" : "border-warm-beige/60"
                }`}
              />
              {errors.weightGrams && (
                <p className="text-xs text-red-500 mt-1">{errors.weightGrams}</p>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-dark-brown/60 font-sans mb-1.5">
                Badge
              </label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                placeholder="Best Seller"
                className="w-full px-4 py-2.5 bg-nude-cream border border-warm-beige/60 text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-dark-brown/60 font-sans mb-1.5">
              Gambar Produk
            </label>
            
            {imagePreview ? (
              <div className="relative w-full max-w-xs aspect-square bg-warm-beige/30 border border-warm-beige/60 overflow-hidden mb-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white text-dark-brown transition-colors"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-xs aspect-square bg-nude-cream border border-dashed border-warm-beige/60 flex flex-col items-center justify-center cursor-pointer hover:border-soft-gold/60 hover:bg-warm-beige/20 transition-colors"
              >
                <Upload size={28} className="text-soft-taupe mb-2" />
                <p className="text-xs text-soft-taupe font-sans">
                  Klik untuk upload gambar
                </p>
                <p className="text-[10px] text-soft-taupe/50 font-sans mt-1">
                  PNG, JPG, WEBP
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Discount Section */}
          <div className="border-t border-warm-beige/30 pt-5">
            <h3 className="text-xs uppercase tracking-wider text-dark-brown/60 font-sans mb-3">
              Diskon
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-dark-brown/60 font-sans mb-1.5">
                  Diskon (%)
                </label>
                <input
                  type="number"
                  name="discount_percent"
                  value={formData.discount_percent}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-nude-cream border border-warm-beige/60 text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors"
                />
              </div>
              <div className="flex items-end pb-2.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="discount_active"
                    checked={formData.discount_active}
                    onChange={handleChange}
                    className="accent-soft-gold w-4 h-4"
                  />
                  <span className="text-sm font-sans text-dark-brown">
                    Aktifkan Diskon
                  </span>
                </label>
              </div>
            </div>
            {Number(formData.discount_percent) > 0 && formData.price && (
              <p className="text-xs text-soft-gold font-sans mt-1">
                Harga setelah diskon:{' '}
                <span className="font-semibold">
                  Rp{(Number(formData.price) * (1 - Number(formData.discount_percent) / 100)).toLocaleString("id-ID")}
                  {formData.discount_active ? "" : " (diskon tidak aktif)"}
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="accent-soft-gold w-4 h-4"
              />
              <span className="text-sm font-sans text-dark-brown">
                Featured Product
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="accent-soft-gold w-4 h-4"
              />
              <span className="text-sm font-sans text-dark-brown">Active</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-dark-brown text-nude-cream text-sm tracking-wider uppercase font-sans hover:bg-soft-gold transition-colors disabled:opacity-50"
          >
            {saving ? (
              <span className="inline-block w-4 h-4 border-2 border-nude-cream/30 border-t-nude-cream rounded-full animate-spin" />
            ) : (
              <>
                <Save size={16} />
                Save Product
              </>
            )}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-3 text-sm font-sans text-dark-brown/60 hover:text-dark-brown transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}