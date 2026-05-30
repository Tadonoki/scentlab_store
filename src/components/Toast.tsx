"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  return (
    <div
      className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-400 ease-in-out ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-nude-cream border border-soft-gold/50 shadow-xl px-6 py-4 flex items-center gap-3 min-w-[300px] max-w-[90vw]">
        <CheckCircle size={20} className="text-soft-gold flex-shrink-0" />
        <p className="text-sm font-sans text-dark-brown flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1 text-dark-brown/40 hover:text-dark-brown transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}