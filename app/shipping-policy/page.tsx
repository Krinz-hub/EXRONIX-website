export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen py-28 sm:py-36 text-white px-4 sm:px-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-2xl p-8 sm:p-12 shadow-2xl text-white">

        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1677FF]">
          LOGISTICS & DELIVERY
        </p>

        <h1 className="mt-2 mb-4 text-4xl sm:text-5xl font-black tracking-tight text-white">
          Shipping Policy
        </h1>

        <p className="mb-8 text-sm text-gray-400">
          Last Updated: August 2026
        </p>

        <section className="space-y-8 divide-y divide-white/10">

          <div className="pt-2">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Shipping Coverage
            </h2>

            <p className="text-gray-300 leading-relaxed">
              EXRONIX currently ships precision engineered accessories and 3D printed components throughout Nepal.
              Delivery times may vary depending on your province and location.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Processing Time
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Orders are usually processed and packaged within 1–2 business
              days after confirmation.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Estimated Delivery
            </h2>

            <ul className="list-disc space-y-2 pl-6 text-gray-300 leading-relaxed">
              <li>Major Cities: 2–4 business days</li>
              <li>Other Districts: 3–7 business days</li>
              <li>Remote Areas: Delivery may take longer based on local logistics conditions.</li>
            </ul>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Shipping Charges
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Shipping charges are calculated during checkout
              based on the selected delivery province.
              Orders above the free shipping threshold qualify
              for free delivery where applicable.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Order Tracking
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Once your order is shipped, you will receive an
              email and account update containing your courier details and
              tracking number.
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}