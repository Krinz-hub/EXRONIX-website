export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="mx-auto max-w-4xl px-6">

        <h1 className="mb-10 text-5xl font-bold">
          Privacy Policy
        </h1>

        <p className="mb-8 text-gray-600">
          Last Updated: August 2026
        </p>

        <section className="space-y-8">

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              Information We Collect
            </h2>

            <p className="text-gray-600">
              When you place an order or create an account,
              we may collect your name, email address,
              phone number, shipping address, and payment
              information necessary to process your order.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              How We Use Your Information
            </h2>

            <ul className="list-disc space-y-2 pl-6 text-gray-600">
              <li>Process and deliver your orders.</li>
              <li>Provide customer support.</li>
              <li>Send order confirmations and shipping updates.</li>
              <li>Improve our products and services.</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              Data Security
            </h2>

            <p className="text-gray-600">
              We take appropriate security measures to protect
              your personal information. Your payment details
              are handled securely through trusted payment
              providers.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              Third-Party Services
            </h2>

            <p className="text-gray-600">
              We may use trusted third-party services such as
              payment gateways, shipping providers, analytics,
              and email providers to operate our store.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold">
              Contact Us
            </h2>

            <p className="text-gray-600">
              If you have any questions regarding this Privacy
              Policy, please contact us at:
            </p>

            <p className="mt-4 font-semibold">
              support@zaynastudio.store
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}