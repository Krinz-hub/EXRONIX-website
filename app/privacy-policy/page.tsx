export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen py-28 sm:py-36 text-white px-4 sm:px-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-2xl p-8 sm:p-12 shadow-2xl text-white">

        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1677FF]">
          LEGAL NOTICE
        </p>

        <h1 className="mt-2 mb-4 text-4xl sm:text-5xl font-black tracking-tight text-white">
          Privacy Policy
        </h1>

        <p className="mb-8 text-sm text-gray-400">
          Last Updated: August 2026
        </p>

        <section className="space-y-8 divide-y divide-white/10">

          <div className="pt-2">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Information We Collect
            </h2>

            <p className="text-gray-300 leading-relaxed">
              When you place an order or create an account,
              we may collect your name, email address,
              phone number, shipping address, and payment
              information necessary to process your order.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              How We Use Your Information
            </h2>

            <ul className="list-disc space-y-2 pl-6 text-gray-300 leading-relaxed">
              <li>Process and deliver your precision hardware orders.</li>
              <li>Provide customer and technical engineering support.</li>
              <li>Send order confirmations and shipping updates.</li>
              <li>Improve our products and additive manufacturing catalogue.</li>
            </ul>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Data Security
            </h2>

            <p className="text-gray-300 leading-relaxed">
              We take appropriate industry-grade security measures to protect
              your personal information. Your payment details
              are handled securely through encrypted payment channels.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Third-Party Services
            </h2>

            <p className="text-gray-300 leading-relaxed">
              We may use trusted third-party services such as
              payment gateways, shipping couriers, analytics,
              and email notification providers to operate our store.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Contact Us
            </h2>

            <p className="text-gray-300 leading-relaxed">
              If you have any questions regarding this Privacy
              Policy, please contact us at:
            </p>

            <p className="mt-4 font-bold text-[#1677FF]">
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