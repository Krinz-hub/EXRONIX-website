export default function ReturnRefundPolicyPage() {
  return (
    <main className="min-h-screen py-28 sm:py-36 text-white px-4 sm:px-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/15 bg-[#0e1219]/80 liquid-glass backdrop-blur-2xl p-8 sm:p-12 shadow-2xl text-white">

        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1677FF]">
          WARRANTY & ASSURANCE
        </p>

        <h1 className="mt-2 mb-4 text-4xl sm:text-5xl font-black tracking-tight text-white">
          Return & Refund Policy
        </h1>

        <p className="mb-8 text-sm text-gray-400">
          Last Updated: August 2026
        </p>

        <section className="space-y-8 divide-y divide-white/10">

          <div className="pt-2">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Returns & Exchanges
            </h2>

            <p className="text-gray-300 leading-relaxed">
              We want you to love your precision engineered gear. If you receive
              the wrong item, a damaged product, or a unit
              with a manufacturing defect, please contact our team
              within 7 days of delivery.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Eligible Returns
            </h2>

            <ul className="list-disc space-y-2 pl-6 text-gray-300 leading-relaxed">
              <li>Wrong product received.</li>
              <li>Damaged or defective transit item.</li>
              <li>Additive manufacturing flaws or dimensional tolerance defects.</li>
            </ul>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Non-Returnable Items
            </h2>

            <ul className="list-disc space-y-2 pl-6 text-gray-300 leading-relaxed">
              <li>Products damaged or modified after delivery.</li>
              <li>Items without original packaging and hardware accessories.</li>
              <li>Custom on-demand bespoke commission prints.</li>
            </ul>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Refunds & Replacements
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Once your returned item is inspected and approved by our engineering team,
              your refund or free replacement unit will be processed
              without delay.
            </p>
          </div>

          <div className="pt-8">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold text-white">
              Need Help?
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Contact our engineering and customer support team if you have any questions
              regarding returns or replacement parts:
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