import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://www.zaynastudio.store"
  ),

  title: {
    default: "Zayna Studio | Wear the Grace",
    template: "%s | Zayna Studio",
  },

  description:
    "Discover premium oversized clothing from Zayna Studio. Crafted for comfort, quality, and timeless style. Wear the Grace.",

  keywords: [
    "Zayna Studio",
    "Zayna",
    "Oversized T-Shirt",
    "Streetwear Nepal",
    "Clothing Brand Nepal",
    "Premium Clothing",
    "Fashion Nepal",
    "Wear the Grace",
  ],

  authors: [
    {
      name: "Zayna Studio",
    },
  ],

  creator: "Zayna Studio",
  publisher: "Zayna Studio",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title:
      "Zayna Studio | Wear the Grace",

    description:
      "Premium oversized clothing designed for confidence and everyday comfort.",

    url: "https://www.zaynastudio.store",

    siteName: "Zayna Studio",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zayna Studio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Zayna Studio | Wear the Grace",

    description:
      "Premium oversized clothing designed for confidence and comfort.",

    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Prevent light-mode flash before React loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var theme =
                    localStorage.getItem("zayna-theme");

                  if (theme === "dark") {
                    document.documentElement.classList.add("dark");
                    document.documentElement.style.colorScheme = "dark";
                  } else {
                    document.documentElement.classList.remove("dark");
                    document.documentElement.style.colorScheme = "light";
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>

      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />

              {children}

              <Footer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
        />
      </body>
    </html>
  );
}