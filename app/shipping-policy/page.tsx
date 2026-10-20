export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="mx-auto max-w-4xl px-6">

        <h1 className="mb-10 text-5xl font-bold">
          Shipping Policy
        </h1>

        <p className="mb-8 text-gray-600">
          Last Updated: August 2026
        </p>

        <section className="space-y-8">

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              Shipping Coverage
            </h2>

            <p className="text-gray-600">
              EXRONIX currently ships throughout Nepal.
              Delivery times may vary depending on your
              province and location.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              Processing Time
            </h2>

            <p className="text-gray-600">
              Orders are usually processed within 1–2 business
              days after confirmation.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              Estimated Delivery
            </h2>

            <ul className="list-disc space-y-2 pl-6 text-gray-600">
              <li>Major Cities: 2–4 business days</li>
              <li>Other Districts: 3–7 business days</li>
              <li>Remote Areas: Delivery may take longer.</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              Shipping Charges
            </h2>

            <p className="text-gray-600">
              Shipping charges are calculated during checkout
              based on the selected delivery province.
              Orders above the free shipping threshold qualify
              for free delivery where applicable.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              Order Tracking
            </h2>

            <p className="text-gray-600">
              Once your order is shipped, you will receive an
              email containing your courier details and
              tracking number.
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}