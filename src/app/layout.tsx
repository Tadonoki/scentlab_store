import type { Metadata } from "next";
import { Inter, Playfair_Display, Alex_Brush } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import ToastWrapper from "@/components/ToastWrapper";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const alexBrush = Alex_Brush({
  weight: "400",
  variable: "--font-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScentLab_Store | Serenity in Every Scent",
  description:
    "Toko lilin aromaterapi premium. Temukan ketenangan dalam setiap aroma. Sweet Dreams, Calm Horizon, Earth Awakening, dan banyak lagi.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${playfairDisplay.variable} ${alexBrush.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-nude-cream text-dark-brown">
        <CartProvider>
          <ToastWrapper>{children}</ToastWrapper>
        </CartProvider>
      </body>
    </html>
  );
}