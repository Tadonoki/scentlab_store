"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  CheckCircle,
  ExternalLink,
  X,
  Printer,
  Copy,
  Download,
} from "lucide-react";
import { toPng } from "html-to-image";
import {
  formatPrice,
  WHATSAPP_NUMBER,
  getWhatsAppUrl,
} from "@/lib/utils";

interface ReceiptProps {
  orderData: any;
  onClose: () => void;
  clearCart: () => void;
}

export default function Receipt({
  orderData,
  onClose,
  clearCart,
}: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    clearCart();
  }, []);

  // ─── WhatsApp message ───
  const itemsText = orderData.items
    .map(
      (item: any) =>
        `• ${item.product_name} x${item.quantity} = Rp${item.subtotal.toLocaleString("id-ID")}`
    )
    .join("\n");

  const fullMessage = `Halo ScentLab_Store, saya ingin konfirmasi pesanan.

Kode Order: ${orderData.order_code}
Nama: ${orderData.buyer_name}
No WA: ${orderData.buyer_phone}
Alamat: ${orderData.buyer_address}

Pesanan:
${itemsText}

Total: Rp${orderData.total_amount.toLocaleString("id-ID")}
Metode Pembayaran: ${orderData.payment_method}

Saya akan mengirim bukti pembayaran.`;

  const whatsappUrl = getWhatsAppUrl(WHATSAPP_NUMBER, fullMessage);

  // ─── Copy order code ───
  const copyOrderCode = () => {
    navigator.clipboard.writeText(orderData.order_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Print receipt ───
  const printReceipt = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsHtml = orderData.items
      .map(
        (item: any) => `
          <tr>
            <td style="padding:6px 0;border-bottom:1px dashed #D8CCBC;font-size:13px;">
              <strong>${item.product_name}</strong><br/>
              <span style="color:#8a7a6a;font-size:11px;">${item.scent_notes} × ${item.quantity}</span>
            </td>
            <td style="padding:6px 0;border-bottom:1px dashed #D8CCBC;font-size:13px;text-align:right;white-space:nowrap;">
              Rp${item.subtotal.toLocaleString("id-ID")}
            </td>
          </tr>`
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Struk - ${orderData.order_code}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');
          * { margin:0; padding:0; box-sizing:border-box; }
          body {
            display:flex; justify-content:center; align-items:center;
            padding:40px 20px; min-height:100vh;
            font-family:'Lora',Georgia,serif; color:#1F1B18;
          }
          .receipt {
            width:400px; max-width:100%;
            background:#F5EFE7; border:1px solid #CDBEAE;
            padding:32px 28px; page-break-after:avoid;
          }
          .receipt-header { text-align:center; margin-bottom:24px; }
          .brand-name {
            font-family:'Great Vibes',cursive;
            font-size:32px; color:#3A2C24; line-height:1.2;
          }
          .tagline {
            font-family:'Playfair Display',Georgia,serif;
            font-size:11px; color:#B9935A; letter-spacing:3px;
            text-transform:uppercase; margin-top:4px;
          }
          .divider {
            border:none; height:1px; background:#CDBEAE;
            margin:16px 0;
          }
          .order-code {
            text-align:center; margin-bottom:20px;
          }
          .order-code-label {
            font-size:10px; text-transform:uppercase;
            letter-spacing:2px; color:#8a7a6a;
          }
          .order-code-value {
            font-family:'Playfair Display',Georgia,serif;
            font-size:22px; color:#B9935A; letter-spacing:1px;
            margin-top:4px;
          }
          .status-badge {
            display:inline-block; padding:3px 14px;
            background:#FEF3C7; color:#92400E;
            font-size:10px; text-transform:uppercase;
            letter-spacing:1px; margin-top:6px;
          }
          .info-box {
            background:#EDE7DD; padding:14px 16px; margin-bottom:16px;
            font-size:12px; line-height:1.8;
          }
          .info-box strong { text-transform:uppercase; letter-spacing:1px; font-size:10px; color:#8a7a6a; }
          .info-row { display:flex; justify-content:space-between; }
          .section-title {
            font-size:10px; text-transform:uppercase;
            letter-spacing:2px; color:#8a7a6a; margin-bottom:10px;
          }
          table { width:100%; border-collapse:collapse; }
          .totals-box {
            background:#EDE7DD; padding:14px 16px; margin:16px 0;
            font-size:13px; line-height:2;
          }
          .total-row { display:flex; justify-content:space-between; }
          .total-amount {
            font-family:'Playfair Display',Georgia,serif;
            font-size:20px; color:#B9935A;
          }
          .payment-instruction {
            text-align:center; font-size:11px;
            color:#8a7a6a; margin-top:16px; padding:12px;
            border:1px dashed #CDBEAE;
          }
          .footer-note {
            text-align:center; font-size:10px;
            color:#8a7a6a; margin-top:16px;
          }
          @media print {
            body { padding:20px; }
            .receipt { border:none; padding:24px; }
            @page { margin:10mm; size:auto; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="receipt-header">
            <div class="brand-name">ScentLab_Store</div>
            <div class="tagline">Serenity in Every Scent</div>
          </div>
          <hr class="divider"/>

          <div class="order-code">
            <div class="order-code-label">Kode Order</div>
            <div class="order-code-value">${orderData.order_code}</div>
            <div class="status-badge">${
              orderData.status === "PENDING_PAYMENT"
                ? "Menunggu Pembayaran"
                : orderData.status
            }</div>
          </div>
          <hr class="divider"/>

          <div class="info-box">
            <strong>Data Pembeli</strong><br/>
            <span style="color:#8a7a6a;">Nama:</span> ${orderData.buyer_name}<br/>
            <span style="color:#8a7a6a;">No. WA:</span> ${orderData.buyer_phone}<br/>
            <span style="color:#8a7a6a;">Alamat:</span> ${orderData.buyer_address}<br/>
            <span style="color:#8a7a6a;">Pembayaran:</span> ${orderData.payment_method}
          </div>

          <div class="section-title">Pesanan</div>
          <table>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals-box">
            <div class="total-row">
              <span>Subtotal</span>
              <span>Rp${orderData.subtotal_amount.toLocaleString("id-ID")}</span>
            </div>
            <div class="total-row">
              <span>Shipping</span>
              <span>${
                orderData.shipping_amount === 0
                  ? "FREE"
                  : "Rp" + orderData.shipping_amount.toLocaleString("id-ID")
              }</span>
            </div>
            <hr class="divider" style="margin:6px 0;"/>
            <div class="total-row">
              <span style="font-weight:600;">Total</span>
              <span class="total-amount">Rp${orderData.total_amount.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div class="payment-instruction">
            <strong style="color:#3A2C24;">Instruksi Pembayaran</strong><br/>
            Silakan transfer ke rekening yang akan diinformasikan oleh CS.<br/>
            Kirim bukti pembayaran via WhatsApp untuk konfirmasi.
          </div>

          <hr class="divider"/>
          <div class="footer-note">
            ${orderData.order_code} — Terima kasih telah berbelanja di ScentLab_Store<br/>
            www.scentlab.store
          </div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  // ─── Download receipt as PNG ───
  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(receiptRef.current, {
        backgroundColor: "#F5EFE7",
        width: 400,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `struk-scentlab-${orderData.order_code.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download receipt:", err);
    } finally {
      setDownloading(false);
    }
  };

  // ─── Status badge class ───
  const isPending = orderData.status === "PENDING_PAYMENT";
  const statusText = isPending ? "Menunggu Pembayaran" : orderData.status;

  return (
    <div className="flex flex-col min-h-full">
      {/* Success Header */}
      <div className="px-6 py-5 border-b border-warm-beige/40 text-center print-hidden">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-1 text-dark-brown/60 hover:text-dark-brown transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle size={28} className="text-green-600" />
        </div>
        <h3 className="font-serif text-xl text-dark-brown">
          Pesanan Berhasil!
        </h3>
        <p className="text-sm text-dark-brown/60 font-sans mt-1">
          Terima kasih, pesanan Anda telah tercatat.
        </p>
      </div>

      {/* ─── Receipt ─── */}
      <div className="flex-1 px-6 py-5 overflow-y-auto flex justify-center">
        <div
          ref={receiptRef}
          className="w-full max-w-[420px] bg-nude-cream border border-warm-beige/60 receipt-print-area"
        >
          {/* Receipt Inner */}
          <div className="p-6 sm:p-8">
            {/* Brand Header */}
            <div className="text-center mb-5">
              <h2
                className="font-script text-3xl text-dark-brown leading-none"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                ScentLab_Store
              </h2>
              <p className="font-serif text-[10px] text-soft-gold tracking-[3px] uppercase mt-1.5">
                Serenity in Every Scent
              </p>
            </div>

            <hr className="border-t border-soft-taupe mb-5" />

            {/* Order Code */}
            <div className="text-center mb-4">
              <p className="text-[10px] uppercase tracking-[2px] text-dark-brown/50 font-sans">
                Kode Order
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span
                  className="font-serif text-2xl text-soft-gold tracking-wide"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {orderData.order_code}
                </span>
                <button
                  onClick={copyOrderCode}
                  className="p-1 text-dark-brown/40 hover:text-soft-gold transition-colors"
                  aria-label="Copy order code"
                >
                  {copied ? (
                    <span className="text-[10px] text-green-600 font-sans">Copied!</span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
              <span
                className={`inline-block px-3 py-1 text-[10px] uppercase tracking-[1px] font-sans mt-2 ${
                  isPending
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {statusText}
              </span>
            </div>

            <hr className="border-t border-soft-taupe mb-5" />

            {/* Buyer Info */}
            <div className="bg-warm-beige/30 p-3.5 mb-4 text-xs font-sans leading-relaxed">
              <p className="text-[10px] uppercase tracking-[1px] text-dark-brown/50 mb-1.5 font-medium">
                Data Pembeli
              </p>
              <p>
                <span className="text-dark-brown/50">Nama: </span>
                {orderData.buyer_name}
              </p>
              <p>
                <span className="text-dark-brown/50">No. WA: </span>
                {orderData.buyer_phone}
              </p>
              <p>
                <span className="text-dark-brown/50">Alamat: </span>
                {orderData.buyer_address}
              </p>
              <p>
                <span className="text-dark-brown/50">Pembayaran: </span>
                {orderData.payment_method}
              </p>
            </div>

            {/* Order Items */}
            <p className="text-[10px] uppercase tracking-[2px] text-dark-brown/50 font-sans mb-3">
              Pesanan
            </p>
            <div className="space-y-0">
              {orderData.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-start py-2 border-b border-dashed border-warm-beige/40 last:border-b-0"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-sm font-serif text-dark-brown">
                      {item.product_name}
                    </p>
                    <p className="text-[11px] text-dark-brown/50 font-sans">
                      {item.scent_notes} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-sans text-dark-brown font-medium whitespace-nowrap">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-warm-beige/30 p-3.5 mt-4 mb-4 text-xs font-sans space-y-1.5">
              <div className="flex justify-between text-dark-brown/70">
                <span>Subtotal</span>
                <span>{formatPrice(orderData.subtotal_amount)}</span>
              </div>
              <div className="flex justify-between text-dark-brown/70">
                <span>Shipping</span>
                <span>
                  {orderData.shipping_amount === 0
                    ? "FREE"
                    : formatPrice(orderData.shipping_amount)}
                </span>
              </div>
              <hr className="border-t border-warm-beige/50 my-1" />
              <div className="flex justify-between text-dark-brown font-medium">
                <span>Total</span>
                <span
                  className="font-serif text-lg text-soft-gold"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {formatPrice(orderData.total_amount)}
                </span>
              </div>
            </div>

            {/* Payment Instruction */}
            <div className="border border-dashed border-soft-taupe p-3 text-center mb-4">
              <p className="text-[11px] font-sans text-dark-brown/70">
                <span className="font-medium text-dark-brown">
                  Instruksi Pembayaran
                </span>
                <br />
                Silakan transfer ke rekening yang akan
                <br />
                diinformasikan oleh CS. Kirim bukti pembayaran
                <br />
                via WhatsApp untuk konfirmasi.
              </p>
            </div>

            <hr className="border-t border-soft-taupe mb-3" />

            {/* Footer */}
            <p className="text-center text-[10px] font-sans text-dark-brown/40 leading-relaxed">
              {orderData.order_code} — Terima kasih telah berbelanja<br />
              di ScentLab_Store &middot; serenity in every scent
            </p>
          </div>
        </div>
      </div>

      {/* ─── Action Buttons ─── */}
      <div className="px-6 py-5 border-t border-warm-beige/40 space-y-3 print-hidden">
        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white text-sm tracking-wider uppercase font-sans hover:bg-green-700 transition-colors"
        >
          <ExternalLink size={18} />
          Konfirmasi via WhatsApp
        </a>
        <p className="text-[11px] text-center font-sans text-dark-brown/50 -mt-1">
          Silakan download struk terlebih dahulu, lalu kirimkan foto struk dan
          bukti pembayaran melalui WhatsApp.
        </p>

        {/* Download + Print */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadReceipt}
            disabled={downloading}
            className="flex items-center justify-center gap-2 w-full py-2.5 border border-soft-gold/60 text-soft-gold text-sm tracking-wider uppercase font-sans hover:bg-soft-gold/10 transition-colors disabled:opacity-50"
          >
            {downloading ? (
              <span className="inline-block w-4 h-4 border-2 border-soft-gold/30 border-t-soft-gold rounded-full animate-spin" />
            ) : (
              <Download size={16} />
            )}
            Download Struk
          </button>

          <button
            onClick={printReceipt}
            className="flex items-center justify-center gap-2 w-full py-2.5 border border-warm-beige/60 text-dark-brown/70 text-sm tracking-wider uppercase font-sans hover:bg-warm-beige/30 transition-colors"
          >
            <Printer size={16} />
            Print Struk
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 text-dark-brown/50 text-xs tracking-wider uppercase font-sans hover:text-dark-brown transition-colors"
        >
          Lanjutkan Belanja
        </button>
      </div>
    </div>
  );
}