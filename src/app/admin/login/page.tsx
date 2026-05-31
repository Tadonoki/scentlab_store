"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await signIn.email({
        email,
        password,
      });

      if (signInError) {
        setError("Email atau password salah");
        setLoading(false);
        return;
      }

      if (data) {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui";
      console.error("[Login Error Detail]:", errorMessage, err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-beige/30 via-nude-cream to-nude-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="text-3xl text-soft-gold/30 mb-3">✿</div>
          <h1 className="font-script text-4xl text-dark-brown mb-2">
            ScentLab_Store
          </h1>
          <p className="text-sm text-dark-brown/50 font-sans italic">
            Admin Dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm border border-warm-beige/40 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={18} className="text-soft-gold" />
            <h2 className="font-serif text-xl text-dark-brown">Sign In</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-dark-brown/60 font-sans mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-taupe" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@scentlab.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-nude-cream border border-warm-beige/60 text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-dark-brown/60 font-sans mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-taupe" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-nude-cream border border-warm-beige/60 text-dark-brown text-sm font-sans focus:outline-none focus:border-soft-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-soft-taupe hover:text-dark-brown transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-dark-brown text-nude-cream text-sm tracking-widest uppercase font-sans hover:bg-soft-gold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-nude-cream/30 border-t-nude-cream rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-warm-beige/30 text-center">
            <p className="text-xs text-dark-brown/40 font-sans">
              Login dengan akun admin ScentLab Anda
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}