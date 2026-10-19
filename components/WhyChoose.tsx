export default function WhyChoose() {
  const features = [
    {
      title: "Premium Quality",
      description:
        "Crafted with premium fabrics for lasting comfort and style.",
      icon: "✨",
    },
    {
      title: "Fast Delivery",
      description:
        "Quick and reliable shipping across Nepal.",
      icon: "🚚",
    },
    {
      title: "Easy Exchange",
      description:
        "Simple exchange process if the size isn't right.",
      icon: "🔄",
    },
    {
      title: "Secure Checkout",
      description:
        "Your payments and personal information are protected.",
      icon: "🔒",
    },
  ];

  return (
    <section className="w-full overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-10 text-center sm:mb-14 lg:mb-16">

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500 sm:text-xs sm:tracking-[0.35em] md:text-sm md:tracking-[0.4em]">
            Why Zayna
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Why Choose Zayna?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl px-2 text-sm leading-6 text-gray-500 sm:mt-4 sm:text-base sm:leading-7 lg:text-lg">
            More than clothing — a premium shopping experience from start to finish.
          </p>

        </div>

        {/* Features */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl sm:p-8 lg:rounded-3xl"
            >

              {/* Icon */}

              <div className="mb-5 text-4xl sm:text-5xl">
                {feature.icon}
              </div>

              {/* Title */}

              <h3 className="text-lg font-bold sm:text-xl">
                {feature.title}
              </h3>

              {/* Description */}

              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-gray-500 sm:text-base sm:leading-7">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}