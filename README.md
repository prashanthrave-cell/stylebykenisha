import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

export const metadata: Metadata = {
  title: "Style by Kenisha – Kids Clothing | Frocks, Baby Wear & More | Bengaluru",
  description:
    "Shop adorable kids clothing at Style by Kenisha! Cute frocks, baby wear, toddler outfits & dresses. Fresh styles, great prices. Located in Kammanahalli, Bengaluru. Call: 6361360153",
  keywords: ["kids clothing bangalore", "baby frocks", "toddler outfits", "kids wear shop", "style by kenisha", "children clothing kammanahalli"],
  openGraph: {
    title: "Style by Kenisha – Kids Clothing",
    description: "Adorable kids frocks, baby wear & toddler outfits in Bengaluru.",
    url: "https://stylebykenisha.shop",
    siteName: "Style by Kenisha",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
