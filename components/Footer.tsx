import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">

            <h2 className="text-2xl font-bold sm:text-3xl">
              ZAYNA STUDIO
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400 sm:text-base">
              Wear the Grace.
              <br />
              Premium oversized clothing designed for confidence,
              comfort, and everyday style.
            </p>

          </div>

          {/* Quick Links */}
          <div>

            <h3 className="mb-4 text-lg font-semibold sm:text-xl">
              Quick Links
            </h3>

            <ul className="space-y-1 text-gray-400">

              <li>
                <Link
                  href="/"
                  className="inline-block py-2 transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/collections"
                  className="inline-block py-2 transition hover:text-white"
                >
                  Shop
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="inline-block py-2 transition hover:text-white"
                >
                  Contact Us
                </Link>
              </li>

            </ul>

          </div>

          {/* Customer Care */}
          <div>

            <h3 className="mb-4 text-lg font-semibold sm:text-xl">
              Customer Care
            </h3>

            <ul className="space-y-1 text-gray-400">

              <li>
                <Link
                  href="/privacy-policy"
                  className="inline-block py-2 text-sm transition hover:text-white sm:text-base"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/shipping-policy"
                  className="inline-block py-2 text-sm transition hover:text-white sm:text-base"
                >
                  Shipping Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/return-refund-policy"
                  className="inline-block py-2 text-sm transition hover:text-white sm:text-base"
                >
                  Return & Refund Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms-and-conditions"
                  className="inline-block py-2 text-sm transition hover:text-white sm:text-base"
                >
                  Terms & Conditions
                </Link>
              </li>

            </ul>

          </div>

          {/* Contact */}
          <div>

            <h3 className="mb-4 text-lg font-semibold sm:text-xl">
              Contact
            </h3>

            <p className="break-all text-sm leading-7 text-gray-400 sm:text-base">
              support@zaynastudio.store
            </p>

            <p className="mt-2 text-sm text-gray-400 sm:mt-3 sm:text-base">
              Nepal
            </p>

            <div className="mt-5 sm:mt-6">

              <a
                href="https://instagram.com/zaynastudio_"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg py-2 text-sm text-gray-400 transition hover:text-white sm:text-base"
              >
                Instagram
              </a>

            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs leading-6 text-gray-500 sm:mt-12 sm:pt-8 sm:text-sm">
          © {new Date().getFullYear()} Zayna Studio.
          <span className="block sm:inline">
            {" "}All Rights Reserved.
          </span>
        </div>

      </div>
    </footer>
  );
}