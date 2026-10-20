import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/config/site";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/15 liquid-glass bg-[#050608]/75 backdrop-blur-2xl px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">

            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-8 w-16 overflow-hidden">
                <Image
                  src={SITE_CONFIG.logo}
                  alt={SITE_CONFIG.name}
                  fill
                  className="object-contain object-left"
                />
              </div>
              <span className="text-xl font-black tracking-wider text-white">
                {SITE_CONFIG.name}
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400 sm:text-base">
              <span className="font-semibold text-[#1677FF] block">
                {SITE_CONFIG.tagline}
              </span>
              Precision in every layer. High-quality 3D printing, functional prototypes, and custom engineering manufacturing built with exacting standards.
            </p>

          </div>

          {/* Quick Links */}
          <div>

            <h3 className="mb-4 text-lg font-semibold sm:text-xl text-white">
              Quick Links
            </h3>

            <ul className="space-y-1 text-gray-400">

              <li>
                <Link
                  href="/"
                  className="inline-block py-2 transition hover:text-[#1677FF]"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/shop"
                  className="inline-block py-2 transition hover:text-[#1677FF]"
                >
                  PC Hardware Shop
                </Link>
              </li>

              <li>
                <Link
                  href="/new"
                  className="inline-block py-2 transition hover:text-[#1677FF]"
                >
                  New Hardware Drops
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="inline-block py-2 transition hover:text-[#1677FF]"
                >
                  About EXRONIX
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="inline-block py-2 transition hover:text-[#1677FF]"
                >
                  Custom Build & Support
                </Link>
              </li>

            </ul>

          </div>

          {/* Customer Care */}
          <div>

            <h3 className="mb-4 text-lg font-semibold sm:text-xl text-white">
              Customer Care
            </h3>

            <ul className="space-y-1 text-gray-400">

              <li>
                <Link
                  href="/privacy-policy"
                  className="inline-block py-2 text-sm transition hover:text-[#1677FF] sm:text-base"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/shipping-policy"
                  className="inline-block py-2 text-sm transition hover:text-[#1677FF] sm:text-base"
                >
                  Shipping Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/return-refund-policy"
                  className="inline-block py-2 text-sm transition hover:text-[#1677FF] sm:text-base"
                >
                  Return & Refund Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms-and-conditions"
                  className="inline-block py-2 text-sm transition hover:text-[#1677FF] sm:text-base"
                >
                  Terms & Conditions
                </Link>
              </li>

            </ul>

          </div>

          {/* Contact */}
          <div>

            <h3 className="mb-4 text-lg font-semibold sm:text-xl text-white">
              Contact & Inquiries
            </h3>

            <p className="break-all text-sm leading-7 text-gray-400 sm:text-base">
              support@exronix.store
            </p>

            <p className="mt-2 text-sm text-gray-400 sm:mt-3 sm:text-base">
              Engineering Support & Custom Orders
            </p>

            <div className="mt-5 sm:mt-6">

              <a
                href="https://instagram.com/exronix"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg py-2 text-sm text-gray-400 transition hover:text-[#1677FF] sm:text-base"
              >
                Instagram
              </a>

            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs leading-6 text-gray-500 sm:mt-12 sm:pt-8 sm:text-sm">
          © {new Date().getFullYear()} {SITE_CONFIG.name}.
          <span className="block sm:inline">
            {" "}All Rights Reserved. {SITE_CONFIG.tagline}
          </span>
        </div>

      </div>
    </footer>
  );
}