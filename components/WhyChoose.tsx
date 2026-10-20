export default function WhyChoose() {
  const features = [
    {
      title: "Precision in Every Layer",
      description:
        "High dimensional accuracy, crisp detailing, and smooth surface finishes for complex geometry.",
      icon: "⚙️",
    },
    {
      title: "Engineering-Grade Materials",
      description:
        "Optimized filaments and durable polymers selected for structural integrity and heat resistance.",
      icon: "🛡️",
    },
    {
      title: "Custom Fabrication",
      description:
        "From individual bespoke pieces to small production batches engineered from CAD concepts.",
      icon: "📐",
    },
    {
      title: "Layer-by-Layer Inspection",
      description:
        "Rigorous dimensional and visual quality checks before packaging and delivery.",
      icon: "🎯",
    },
  ];

  return (
    <section className="w-full overflow-hidden bg-transparent px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 border-t border-white/10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-10 text-center sm:mb-14 lg:mb-16">

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#1677FF] sm:text-xs sm:tracking-[0.35em] md:text-sm md:tracking-[0.4em]">
            EXRONIX Standards
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Why Choose EXRONIX?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl px-2 text-sm leading-6 text-gray-300 sm:mt-4 sm:text-base sm:leading-7 lg:text-lg">
            Engineering excellence, precision manufacturing, and strict quality control built into every single layer.
          </p>

        </div>

        {/* Features */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="liquid-glass rounded-2xl border border-white/15 p-6 text-center text-white backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-[#1677FF]/50 hover:shadow-[0_15px_35px_rgba(22,119,255,0.2)] sm:p-8 lg:rounded-3xl"
            >

              {/* Icon */}

              <div className="mb-5 text-4xl sm:text-5xl drop-shadow-[0_0_12px_rgba(22,119,255,0.4)]">
                {feature.icon}
              </div>

              {/* Title */}

              <h3 className="text-lg font-bold sm:text-xl text-white">
                {feature.title}
              </h3>

              {/* Description */}

              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-gray-300 sm:text-base sm:leading-7">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}