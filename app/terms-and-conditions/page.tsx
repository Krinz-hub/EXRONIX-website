export default function TermsPage() {
  return (
    <main className="min-h-screen py-28 sm:py-36 text-white px-4 sm:px-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-2xl p-8 sm:p-12 shadow-2xl text-white">

        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1677FF]">
          TERMS OF SERVICE
        </p>

        <h1 className="mt-2 mb-4 text-4xl sm:text-5xl font-black tracking-tight text-white">
          Terms & Conditions
        </h1>

        <p className="mb-8 text-sm text-gray-400">
          Last Updated: August 2026
        </p>

        <section className="space-y-8 divide-y divide-white/10">

          <div className="pt-2">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Acceptance of Terms
            </h2>

            <p className="text-gray-300 leading-relaxed">
              By accessing and using EXRONIX, you agree
              to comply with these Terms & Conditions.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Orders
            </h2>

            <p className="text-gray-300 leading-relaxed">
              All orders are subject to product availability
              and confirmation. We reserve the right to
              cancel or refuse any order if necessary.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Pricing
            </h2>

            <p className="text-gray-300 leading-relaxed">
              All prices displayed are in Nepalese Rupees
              (NPR). Prices may change without prior notice.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Intellectual Property
            </h2>

            <p className="text-gray-300 leading-relaxed">
              All designs, logos, product images, 3D models, graphics,
              and content belong to EXRONIX and may not
              be copied or reproduced without permission.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Limitation of Liability
            </h2>

            <p className="text-gray-300 leading-relaxed">
              EXRONIX is not responsible for delays
              caused by courier services, natural disasters,
              or other circumstances beyond our control.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Contact
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Email inquiries:
            </p>

            <p className="mt-2 font-bold text-[#1677FF]">
              <a href="mailto:support@exronix.store" className="hover:underline">
                support@exronix.store
              </a>
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}