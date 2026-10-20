export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  images?: string[];
  description: string;
  category: "Computer Mice" | "PC Cabinets" | "Headphone Stands" | string;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  sizes?: string[]; // Used for Form Factor / Variants
  colors?: string[]; // Used for Material Finish
  specs: {
    [key: string]: string;
  };
  isNew?: boolean;
  featured?: boolean;
  releaseDate?: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "EXRONIX M4 Magnesium Apex Wireless Mouse",
    price: 8500,
    image: "/images/products/mouse-apex.jpg",
    images: ["/images/products/mouse-apex.jpg"],
    description:
      "Ultra-lightweight magnesium alloy honeycomb gaming mouse engineered for esports precision. Features PixArt PAW3395 26,000 DPI sensor, Nordic 52840 MCU with 4000Hz polling rate support, and TTC Gold dustproof switches.",
    category: "Computer Mice",
    stock: 24,
    status: "In Stock",
    sizes: ["Standard Ergonomic (49g)"],
    colors: ["Matte Black", "Cyber Blue"],
    specs: {
      Sensor: "PixArt PAW3395 (26,000 DPI)",
      Connectivity: "Tri-mode (2.4GHz Wireless, Bluetooth 5.2, USB-C)",
      Weight: "49 grams",
      Switches: "Optical TTC Gold (80M Clicks)",
      Battery: "Up to 80 hours continuous play",
      PollingRate: "4,000 Hz Hyper-Polling Supported",
    },
    isNew: true,
    featured: true,
    releaseDate: "OCT 2026",
    badge: "FLAGSHIP LAUNCH",
  },
  {
    id: 2,
    name: "EXRONIX Velocity Pro Carbon Mouse",
    price: 6800,
    image: "/images/products/mouse-stealth.jpg",
    images: ["/images/products/mouse-stealth.jpg"],
    description:
      "Sleek ambidextrous esports mouse with composite carbon-reinforced shell, zero-latency optical switches, and virgin-grade PTFE glide skates for frictionless control.",
    category: "Computer Mice",
    stock: 18,
    status: "In Stock",
    sizes: ["Ambidextrous (58g)"],
    colors: ["Stealth Black"],
    specs: {
      Sensor: "PixArt PAW3370 (19,000 DPI)",
      Connectivity: "Ultra-flexible paracord USB-C",
      Weight: "58 grams",
      Switches: "Kailh GM 8.0 (80M Clicks)",
      Lighting: "Dynamic Underglow Prism LED",
      Cable: "1.8m Hyperflex Paracord",
    },
    isNew: true,
    featured: false,
    releaseDate: "OCT 2026",
    badge: "NEW DROP",
  },
  {
    id: 3,
    name: "EXRONIX Neo Alpha Panoramic ATX Chassis",
    price: 18500,
    image: "/images/products/case-matrix.jpg",
    images: ["/images/products/case-matrix.jpg"],
    description:
      "Architectural dual-chamber mid-tower chassis featuring seamless cornerless tempered glass panels. Engineered for extreme GPU thermal clearance and dual 360mm radiator support.",
    category: "PC Cabinets",
    stock: 12,
    status: "In Stock",
    sizes: ["Dual-Chamber Mid-Tower"],
    colors: ["Anodized Black", "Titanium Gray"],
    specs: {
      Motherboard: "E-ATX, ATX, Micro-ATX, Mini-ITX",
      FormFactor: "Dual-Chamber Panoramic Mid-Tower",
      RadiatorSupport: "Top 360mm, Side 360mm, Bottom 360mm",
      Materials: "1.2mm SPCC Steel, 4.0mm Tempered Glass, CNC Aluminum",
      Clearance: "GPU length up to 430mm, CPU cooler up to 180mm",
      DriveBays: "2x 3.5\" HDD, 4x 2.5\" SSD",
    },
    isNew: true,
    featured: true,
    releaseDate: "SEPT 2026",
    badge: "ENGINEER'S CHOICE",
  },
  {
    id: 4,
    name: "EXRONIX AirFlow Mesh Elite PC Cabinet",
    price: 14200,
    image: "/images/products/case-nexus.jpg",
    images: ["/images/products/case-nexus.jpg"],
    description:
      "High-performance airflow chassis equipped with fine geometric front mesh filtration, vertical GPU mount support, and pre-installed high-static pressure PWM fans.",
    category: "PC Cabinets",
    stock: 9,
    status: "Low Stock",
    sizes: ["High-Airflow Performance Tower"],
    colors: ["Matte Black", "Gunmetal"],
    specs: {
      Motherboard: "ATX, Micro-ATX, Mini-ITX",
      FormFactor: "High-Airflow Performance Tower",
      RadiatorSupport: "Front 360mm / 420mm, Top 280mm / 360mm",
      GPUClearance: "410mm Clearance with Anti-Sag Bracket",
      FansIncluded: "3x 140mm High-Static Pressure PWM Fans",
      Filters: "Magnetic Fine-Mesh Top, Front, and Bottom",
    },
    isNew: false,
    featured: true,
    releaseDate: "AUG 2026",
    badge: "MAX AIRFLOW",
  },
  {
    id: 5,
    name: "EXRONIX AeroCharge Wireless Headphone Stand",
    price: 4800,
    image: "/images/products/stand-aero.jpg",
    images: ["/images/products/stand-aero.jpg"],
    description:
      "Sculpted from a single block of aerospace-grade 6061 aluminum with a weighted circular base, integrated 15W Qi fast wireless charging pad, and silicone cable management guide.",
    category: "Headphone Stands",
    stock: 32,
    status: "In Stock",
    sizes: ["Single Cradle (275mm Height)"],
    colors: ["Matte Black", "Silver Frost"],
    specs: {
      Material: "CNC Machined 6061-T6 Anodized Aluminum",
      BaseCharging: "15W Fast Qi Wireless Charging (Smart IC)",
      CableManagement: "Integrated Rear Silicone Routing Channel",
      BaseFootprint: "140mm Diameter weighted anti-slip base",
      Compatibility: "All over-ear audiophile & gaming headsets",
    },
    isNew: true,
    featured: true,
    releaseDate: "OCT 2026",
    badge: "POPULAR ESSENTIAL",
  },
  {
    id: 6,
    name: "EXRONIX Prism Walnut & Titanium Headphone Cradle",
    price: 5400,
    image: "/images/products/stand-prism.jpg",
    images: ["/images/products/stand-prism.jpg"],
    description:
      "Luxury desktop headphone rest crafted from dark titanium anodized aluminum seamlessly contoured with authentic black walnut wood, providing uniform band pressure distribution.",
    category: "Headphone Stands",
    stock: 14,
    status: "In Stock",
    sizes: ["Sculpted Arch (260mm Height)"],
    colors: ["Obsidian / Walnut"],
    specs: {
      Material: "Titanium Anodized Aluminum + Natural Black Walnut",
      CableDock: "Integrated USB-C Passthrough & Magnetic Headphone Clip",
      Weight: "680g Solid Counterweight Base",
      Padding: "Protective Micro-Textured Silicone Headband Pad",
      Footprint: "Precision Chamfered Anti-Vibration Footpads",
    },
    isNew: false,
    featured: false,
    releaseDate: "JULY 2026",
    badge: "ARTISAN FINISH",
  },
];