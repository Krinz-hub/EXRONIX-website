export default function ReturnRefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="mx-auto max-w-4xl px-6">

        <h1 className="mb-10 text-5xl font-bold">
          Return & Refund Policy
        </h1>

        <p className="mb-8 text-gray-600">
          Last Updated: August 2026
        </p>

        <section className="space-y-8">

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              Returns & Exchanges
            </h2>

            <p className="text-gray-600">
              We want you to love your purchase. If you receive
              the wrong item, a damaged product, or a product
              with a manufacturing defect, please contact us
              within 7 days of delivery.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              Eligible Returns
            </h2>

            <ul className="list-disc space-y-2 pl-6 text-gray-600">
              <li>Wrong product received.</li>
              <li>Damaged or defective item.</li>
              <li>Manufacturing defects.</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              Non-Returnable Items
            </h2>

            <ul className="list-disc space-y-2 pl-6 text-gray-600">
              <li>Products damaged after delivery.</li>
              <li>Items without original tags.</li>
              <li>Products that have been washed or worn.</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              Refunds
            </h2>

            <p className="text-gray-600">
              Once your returned item is inspected and approved,
              your refund or replacement will be processed as
              quickly as possible.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              Need Help?
            </h2>

            <p className="text-gray-600">
              Contact our support team if you have any questions
              regarding returns or refunds.
            </p>

            <p className="mt-4 font-semibold">
              support@exronix.store
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}