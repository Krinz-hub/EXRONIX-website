import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  Layers,
  Cpu,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/site";

export default function AboutPage() {
  const values = [
    {
      icon: <Layers size={40} className="text-[#1677FF]" />,
      title: "Precision in Every Layer",
      desc: "Micron-level layer resolution and meticulous slicing calibration for pristine finish.",
    },
    {
      icon: <Cpu size={40} className="text-[#1677FF]" />,
      title: "Engineering-Grade Materials",
      desc: "Selected technical polymers, tough resins, and reinforced composite filaments.",
    },
    {
      icon: <Truck size={40} className="text-[#1677FF]" />,
      title: "Secure Delivery",
      desc: "Protective packaging and dependable shipping for fragile and precision parts.",
    },
    {
      icon: <ShieldCheck size={40} className="text-[#1677FF]" />,
      title: "Layer-by-Layer Quality",
      desc: "Thorough dimensional inspection before dispatch to guarantee structural integrity.",
    },
  ];

  return (
    <main className="bg-[#050608] text-white min-h-screen">

      {/* Hero */}

      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#050608] px-6 text-center text-white">
        {/* Subtle radial ambient glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(22,119,255,0.15),transparent_70%)]" />

        <div className="relative z-10 max-w-3xl">

          <p className="mb-4 tracking-[0.4em] uppercase text-[#1677FF] font-semibold text-xs sm:text-sm">
            About {SITE_CONFIG.name}
          </p>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            PRECISION.
            <br />
            INNOVATION.
            <br />
            EXCELLENCE.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-300">
            {SITE_CONFIG.name} engineers premium 3D-printed creations, functional prototypes, and custom additive manufacturing solutions with uncompromising dimensional accuracy.
          </p>

        </div>

      </section>

      {/* Story */}

      <section className="mx-auto max-w-6xl px-6 py-24">

        <div className="grid gap-16 md:grid-cols-2 items-center">

          <div>

            <p className="mb-3 uppercase tracking-[0.3em] text-[#1677FF] text-xs font-semibold">
              Our Ethos
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-white">
              {SITE_CONFIG.tagline}
            </h2>

            <p className="mt-4 text-sm text-gray-400">
              Built with precision. Quality in every layer.
            </p>

          </div>

          <div className="space-y-6 text-base leading-8 text-gray-300">

            <p>
              {SITE_CONFIG.name} was established with a clear mandate: additive manufacturing should surpass traditional expectations of surface finish, structural integrity, and durability.
            </p>

            <p>
              From custom functional prototypes to intricate display models and precision mechanical components, we combine advanced slicing algorithms, verified materials, and layer-by-layer verification.
            </p>

            <p>
              We believe engineering excellence begins at the CAD model and continues through each deposited layer. Every piece is engineered with purpose, measured against rigorous standards, and built to perform.
            </p>

            <p>
              Whether you are an engineer validating a prototype or an enthusiast looking for specialized custom fabrication, {SITE_CONFIG.name} brings your concepts into reality with tangible precision.
            </p>

          </div>

        </div>

      </section>

      {/* Values */}

      <section className="bg-[#12151B] py-24 border-y border-white/5">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="uppercase tracking-[0.3em] text-[#1677FF] text-xs font-semibold">
              Why Choose {SITE_CONFIG.name}
            </p>

            <h2 className="mt-3 text-4xl font-bold text-white">
              Precision Engineering Standards
            </h2>

          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl liquid-glass p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#1677FF]/40 hover:shadow-[0_12px_30px_rgba(22,119,255,0.15)]"
              >
                <div className="mb-6 flex justify-center">
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="py-24">

        <div className="mx-auto max-w-4xl rounded-3xl liquid-glass border border-white/10 px-8 py-20 text-center text-white relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#1677FF]/20 blur-3xl" />

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            Bring Your Ideas Into Reality
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-gray-300">
            Explore our ready-to-order precision printed models or contact us for bespoke 3D manufacturing requests.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="inline-block rounded-xl bg-[#1677FF] px-8 py-4 font-semibold text-white shadow-[0_0_25px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90 active:scale-95"
            >
              Explore Printed Products
            </Link>

            <Link
              href="/contact"
              className="inline-block rounded-xl bg-white/10 border border-white/15 px-8 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            >
              Request Custom Print
            </Link>
          </div>

        </div>

      </section>

    </main>
  );
}