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
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.exronix.com"
  ),

  title: {
    default: "EXRONIX | Engineered Beyond Limits",
    template: "%s | EXRONIX",
  },

  description:
    "EXRONIX — High-precision 3D printing, functional prototypes, and custom engineering manufacturing. Engineered Beyond Limits.",

  keywords: [
    "EXRONIX",
    "3D Printing",
    "Precision 3D Printing",
    "Functional Prototypes",
    "Additive Manufacturing",
    "Custom Fabrication",
    "Engineered Beyond Limits",
    "3D Models",
    "Mechanical Components",
  ],

  authors: [
    {
      name: "EXRONIX",
    },
  ],

  creator: "EXRONIX",
  publisher: "EXRONIX",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title:
      "EXRONIX | Engineered Beyond Limits",

    description:
      "Premium-quality 3D printing, precision models, and custom engineering manufacturing. Engineered into reality.",

    url: "https://www.exronix.com",

    siteName: "EXRONIX",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EXRONIX — Engineered Beyond Limits",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "EXRONIX | Engineered Beyond Limits",

    description:
      "High-precision 3D printing, functional prototypes, and custom manufacturing.",

    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

import FixedScrollVideoBackground from "@/components/FixedScrollVideoBackground";

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
                    localStorage.getItem("zayna-theme") || "dark";

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

      <body className="min-h-screen bg-[#050608] text-[#F5F7FA] antialiased selection:bg-[#1677FF] selection:text-white">
        {/* =====================================================
            CINEMATIC FIXED SCROLL-DRIVEN VIDEO BACKGROUND
            Remains pinned to the viewport. Never scrolls with page content.
        ===================================================== */}
        <FixedScrollVideoBackground />

        <div className="relative z-10 flex min-h-screen flex-col">
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <Navbar />

                <div className="flex-1">
                  {children}
                </div>

                <Footer />
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </div>

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