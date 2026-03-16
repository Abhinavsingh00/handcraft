import type { Metadata } from "next";
import { Amatic_SC, Cabin } from "next/font/google";
import "./globals.css";
import { CartProviderWrapper } from "@/components/cart/cart-provider-wrapper";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// Custom fonts for Pawfectly Handmade brand
const amaticSC = Amatic_SC({
  weight: ["400", "700"],
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const cabin = Cabin({
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pawfectly Handmade | Handmade Dog Products",
  description: "Discover premium handmade dog products. From cozy beds to stylish collars, everything is crafted with love for your furry friend.",
  keywords: ["dog products", "handmade dog accessories", "pet supplies", "dog collars", "dog beds"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${amaticSC.variable} ${cabin.variable} antialiased font-body bg-background text-foreground`}
      >
        <CartProviderWrapper>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </CartProviderWrapper>
      </body>
    </html>
  );
}
