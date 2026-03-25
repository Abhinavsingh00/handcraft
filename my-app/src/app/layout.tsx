import type { Metadata } from "next";
import { Patrick_Hand, Cabin } from "next/font/google";
import "./globals.css";
import { CartProviderWrapper } from "@/components/cart/cart-provider-wrapper";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "sonner";

// Custom fonts for Pawfectly Handmade brand
const patrickHand = Patrick_Hand({
  weight: ["400"],
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
        className={`${patrickHand.variable} ${cabin.variable} antialiased font-body bg-background text-foreground`}
      >
        <AuthProvider>
          <CartProviderWrapper>
            <Navbar />
            <main className="min-h-screen pt-16">
              {children}
            </main>
            <Footer />
          </CartProviderWrapper>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
