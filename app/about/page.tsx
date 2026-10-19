import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  Shirt,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Sparkles size={40} />,
      title: "Minimal Design",
      desc: "Clean aesthetics with timeless streetwear.",
    },
    {
      icon: <Shirt size={40} />,
      title: "Premium Quality",
      desc: "Carefully selected fabrics for everyday comfort.",
    },
    {
      icon: <Truck size={40} />,
      title: "Fast Delivery",
      desc: "Shipping all across Nepal with reliable service.",
    },
    {
      icon: <ShieldCheck size={40} />,
      title: "Trusted Brand",
      desc: "Built with quality, honesty and customer satisfaction.",
    },
  ];

  return (
    <main className="bg-white">

      {/* Hero */}

      <section className="flex min-h-[70vh] items-center justify-center bg-black px-6 text-center text-white">

        <div className="max-w-3xl">

          <p className="mb-4 tracking-[0.4em] uppercase text-gray-400">
            About ZAYNA
          </p>

          <h1 className="text-5xl font-bold md:text-7xl">
            Minimal.
            <br />
            Bold.
            <br />
            Timeless.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-300">
            ZAYNA creates premium oversized essentials that
            combine simplicity, comfort and confidence.
          </p>

        </div>

      </section>

      {/* Story */}

      <section className="mx-auto max-w-6xl px-6 py-24">

        <div className="grid gap-16 md:grid-cols-2">

          <div>

            <p className="mb-3 uppercase tracking-[0.3em] text-gray-500">
              Our Story
            </p>

            <h2 className="text-4xl font-bold">
              Designed to express identity.
            </h2>

          </div>

          <div className="space-y-6 text-lg leading-8 text-gray-600">

            <p>
              Zayna Studio started with a simple idea: 
              clothing should be more than just something
              you wear—it should reflect who you are.
            </p>

            <p>
             We saw a world filled with fast-changing trends and pieces that quickly lost their
             meaning. Instead of following every trend, we wanted to create clothing with 
             purpose—timeless, minimal, and made to be worn with confidence.
            </p>

            <p>
              Every piece we create is designed with quality, comfort, and attention to detail. 
              We believe great style doesn't need to be loud; it should feel effortless, authentic, and 
              built to last.
            </p>
            <p>
              Zayna Studio is more than a clothing brand. It's a reminder that the way you dress is 
              an extension of your identity.  
            </p>

          </div>

        </div>

      </section>

      {/* Values */}

      <section className="bg-gray-50 py-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="uppercase tracking-[0.3em] text-gray-500">
              Why Choose ZAYNA
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              More than Clothing
            </h2>

          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-6 flex justify-center text-black">
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-4 text-gray-500">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="py-24">

        <div className="mx-auto max-w-4xl rounded-3xl bg-black px-8 py-20 text-center text-white">

          <h2 className="text-5xl font-bold">
            Wear Your Identity
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300">
            Discover premium oversized essentials designed
            for everyday confidence.
          </p>

          <Link
            href="/collections"
            className="mt-10 inline-block rounded-xl bg-white px-10 py-4 font-semibold text-black transition hover:scale-105"
          >
            Shop Collection
          </Link>

        </div>

      </section>

    </main>
  );
}