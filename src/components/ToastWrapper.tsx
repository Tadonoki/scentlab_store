"use client";

import React from "react";
import { useCart } from "@/lib/cart-context";
import Toast from "./Toast";

export default function ToastWrapper({ children }: { children: React.ReactNode }) {
  const { showToast, toastMessage, dismissToast } = useCart();

  return (
    <>
      {children}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={dismissToast}
      />
    </>
  );
}