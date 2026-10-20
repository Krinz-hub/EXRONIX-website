export const siteConfig = {
  name: "EXRONIX",
  shortName: "EXRONIX",
  tagline: "ENGINEERED BEYOND LIMITS",
  headline: "Precision in Every Layer.",
  subHeadline: "Your Ideas. Engineered into Reality.",
  supportingText:
    "From custom concepts to carefully crafted 3D prints, EXRONIX brings ideas to life through precision, quality, and engineering.",
  description:
    "EXRONIX — High-precision 3D printing, functional prototypes, and custom engineering manufacturing. Engineered Beyond Limits.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.exronix.com",
  email: {
    support: "support@exronix.com",
    orders: "orders@exronix.com",
  },
  phone: {
    primary: "+9876543210",
    secondary: "+8976542310",
  },
  office: {
    title: "Manufacturing & Office",
    address: "Haryana, panipat",
  },
  socials: {
    instagram: "https://instagram.com/exronix",
  },
  assets: {
    logo: "/images/exronix-logo.png",
    heroBackground: "/images/space-hero.jpg",
    showcaseProduct: "/images/cyber-shark.jpg",
  },
  logo: "/images/exronix-logo.png",
  categories: [
    {
      name: "Computer Mice",
      image: "/images/products/mouse-apex.jpg",
      href: "/shop?category=Computer+Mice",
      comingSoon: false,
      description: "Ultra-lightweight magnesium alloy and optical esports gaming mice.",
    },
    {
      name: "PC Cabinets",
      image: "/images/products/case-matrix.jpg",
      href: "/shop?category=PC+Cabinets",
      comingSoon: false,
      description: "Architectural dual-chamber panoramic chassis and high-airflow PC cases.",
    },
    {
      name: "Headphone Stands",
      image: "/images/products/stand-aero.jpg",
      href: "/shop?category=Headphone+Stands",
      comingSoon: false,
      description: "CNC machined aluminum desktop stands with integrated Qi fast wireless charging.",
    },
  ],
};

export const SITE_CONFIG = siteConfig;
