import { supabase } from "./supabase";
import { products as sampleProducts } from "@/components/data/products";

/* =====================================================
   PRODUCT TYPE
===================================================== */

export type Product = {
  id: number;

  name: string;

  image: string;
  image2: string | null;
  image3: string | null;
  image4: string | null;

  // All available product images
  images: string[];

  price: number;

  description: string;

  category: string;

  stock: number;

  

  status:
    | "In Stock"
    | "Low Stock"
    | "Out of Stock";

  sizes: string[];

  colors: string[];
};

/* =====================================================
   UPDATE PRODUCT TYPE
===================================================== */

export type UpdateProductData = {
  name: string;

  image: string;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;

  images?: string[];

  category: string;

  price: number;

  stock: number;

  sizes: string[];

  colors: string[];

  description?: string;
};

/* =====================================================
   SUPABASE PRODUCT ROW
===================================================== */

type ProductRow = {
  id: number;

  name: string | null;

  image: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
  images: unknown;

  price: number | string | null;

  description: string | null;

  category: string | null;

  stock: number | string | null;

  sold: number | string | null;

  sizes: unknown;

  colors: unknown;
};

/* =====================================================
   CLEAN OPTION
===================================================== */

function cleanOption(value: unknown): string {
  return String(value ?? "")
    .replace(/[{}[\]"]/g, "")
    .trim();
}

/* =====================================================
   PARSE POSTGRES ARRAY
===================================================== */

function parsePgArray(value: unknown): string[] {
  if (
    value === null ||
    value === undefined
  ) {
    return [];
  }

  let values: string[] = [];

  /* Already JS array */

  if (Array.isArray(value)) {
    values = value
      .flat(Infinity)
      .map((item) => String(item));
  }

  /* String */

  else if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    /* Try JSON */

    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        values = parsed
          .flat(Infinity)
          .map((item) => String(item));
      } else {
        values = [String(parsed)];
      }
    } catch {
      /* PostgreSQL array */

      values = trimmed
        .replace(/[{}[\]"]/g, "")
        .split(",");
    }
  }

  return Array.from(
    new Set(
      values
        .map(cleanOption)
        .filter(Boolean)
    )
  );
}

/* =====================================================
   CLEAN OPTIONS
===================================================== */

function cleanOptions(
  values: string[]
): string[] {
  return Array.from(
    new Set(
      (values ?? [])
        .map(cleanOption)
        .filter(Boolean)
    )
  );
}

/* =====================================================
   PARSE PRODUCT IMAGES
===================================================== */

function parseImages(
  product: ProductRow
): string[] {
  const imageList: string[] = [];

  /*
    Main image
  */

  if (
    product.image &&
    product.image.trim()
  ) {
    imageList.push(
      product.image.trim()
    );
  }

  /*
    image2
  */

  if (
    product.image2 &&
    product.image2.trim()
  ) {
    imageList.push(
      product.image2.trim()
    );
  }

  /*
    image3
  */

  if (
    product.image3 &&
    product.image3.trim()
  ) {
    imageList.push(
      product.image3.trim()
    );
  }

  /*
    image4
  */

  if (
    product.image4 &&
    product.image4.trim()
  ) {
    imageList.push(
      product.image4.trim()
    );
  }

  /*
    Optional images array
  */

  const databaseImages =
    parsePgArray(product.images);

  for (const image of databaseImages) {
    if (
      image &&
      !imageList.includes(image)
    ) {
      imageList.push(image);
    }
  }

  return imageList;
}

/* =====================================================
   STOCK STATUS
===================================================== */

function getStockStatus(
  stock: number
):
  | "In Stock"
  | "Low Stock"
  | "Out of Stock" {
  if (stock <= 0) {
    return "Out of Stock";
  }

  if (stock <= 5) {
    return "Low Stock";
  }

  return "In Stock";
}

/* =====================================================
   MAP PRODUCT
===================================================== */

function mapProduct(
  product: ProductRow
): Product {
  const stock = Math.max(
    0,
    Number(product.stock ?? 0)
  );

  const price = Math.max(
    0,
    Number(product.price ?? 0)
  );

  const sold = Math.max(
    0,
    Number(product.sold ?? 0)
  );

  const images =
    parseImages(product);

  return {
    id: Number(product.id),

    name: product.name ?? "",

    /*
      Keep image as the primary image.
    */

    image:
      product.image ??
      images[0] ??
      "",

    image2:
      product.image2 ?? null,

    image3:
      product.image3 ?? null,

    image4:
      product.image4 ?? null,

    images,

    price,

    description:
      product.description ?? "",

    category:
      product.category ?? "",

    stock,

    status:
      getStockStatus(stock),

    sizes:
      parsePgArray(product.sizes),

    colors:
      parsePgArray(product.colors),
  };
}

/* =====================================================
   GET ALL PRODUCTS
===================================================== */

export async function getProducts(): Promise<Product[]> {
  try {
    const {
      data,
      error,
    } = await supabase
      .from("products")
      .select("*")
      .order("id", {
        ascending: true,
      });

    if (error || !data || data.length === 0) {
      return (sampleProducts as unknown as Product[]) ?? [];
    }

    return (data ?? []).map(
      (product) =>
        mapProduct(
          product as ProductRow
        )
    );
  } catch {
    return (sampleProducts as unknown as Product[]) ?? [];
  }
}

/* =====================================================
   GET PRODUCT BY ID
===================================================== */

export async function getProductById(
  id: number
): Promise<Product | null> {
  const productId = Number(id);

  if (!Number.isFinite(productId)) {
    console.error(
      "Invalid Product ID:",
      id
    );

    return null;
  }

  try {
    const {
      data,
      error,
    } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .maybeSingle();

    if (!error && data) {
      return mapProduct(
        data as ProductRow
      );
    }
  } catch {}

  const fallback = sampleProducts.find((p) => p.id === productId);
  return (fallback as unknown as Product) || null;
}

/* =====================================================
   GET RELATED PRODUCTS
===================================================== */

export async function getRelatedProducts(
  category: string,
  currentProductId: number
): Promise<Product[]> {
  const {
    data,
    error,
  } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .neq("id", currentProductId)
    .order("id", {
      ascending: true,
    })
    .limit(4);

  if (error) {
    console.error(
      "Get Related Products Error:",
      error
    );

    return [];
  }

  return (data ?? []).map(
    (product) =>
      mapProduct(
        product as ProductRow
      )
  );
}

/* =====================================================
   ADD PRODUCT
===================================================== */

export async function addProduct(
  product: Omit<Product, "id">
): Promise<Product> {
  const safePrice = Math.max(
    0,
    Number(product.price)
  );

  const safeStock = Math.max(
    0,
    Math.floor(
      Number(product.stock)
    )
  );

  const cleanSizes =
    cleanOptions(product.sizes);

  const cleanColors =
    cleanOptions(product.colors);

  /*
    Build image list.
  */

  const productImages =
    Array.from(
      new Set(
        [
          product.image,
          product.image2,
          product.image3,
          product.image4,
          ...(product.images ?? []),
        ]
          .filter(
            (
              image
            ): image is string =>
              Boolean(
                image &&
                image.trim()
              )
          )
          .map((image) =>
            image.trim()
          )
      )
    );

  const insertData = {
    name:
      product.name.trim(),

    /*
      Main image
    */

    image:
      productImages[0] ?? "",

    /*
      Additional images
    */

    image2:
      productImages[1] ?? null,

    image3:
      productImages[2] ?? null,

    image4:
      productImages[3] ?? null,

    /*
      Store complete image list too
    */

    images:
      productImages,

    price:
      safePrice,

    description:
      product.description?.trim() ?? "",

    category:
      product.category,

    stock:
      safeStock,

    sold:
      Math.max(
        0,
        Number((product as { sold?: number }).sold ?? 0)
      ),

    sizes:
      cleanSizes,

    colors:
      cleanColors,
  };

  console.log(
    "ADDING PRODUCT:",
    insertData
  );

  const {
    data,
    error,
  } = await supabase
    .from("products")
    .insert(insertData)
    .select("*")
    .single();

  if (error) {
    console.error(
      "Add Product Error:",
      error
    );

    throw error;
  }

  if (!data) {
    throw new Error(
      "Product was not created."
    );
  }

  return mapProduct(
    data as ProductRow
  );
}

/* =====================================================
   UPDATE PRODUCT
===================================================== */

export async function updateProduct(
  id: number,
  product: UpdateProductData
): Promise<Product> {
  const productId = Number(id);

  if (!Number.isFinite(productId)) {
    throw new Error(
      "Invalid product ID."
    );
  }

  const safeStock = Math.max(
    0,
    Math.floor(
      Number(product.stock)
    )
  );

  const safePrice = Math.max(
    0,
    Number(product.price)
  );

  const cleanSizes =
    cleanOptions(product.sizes);

  const cleanColors =
    cleanOptions(product.colors);

  /*
    Build image list.
  */

  const productImages =
    Array.from(
      new Set(
        [
          product.image,
          product.image2,
          product.image3,
          product.image4,
          ...(product.images ?? []),
        ]
          .filter(
            (
              image
            ): image is string =>
              Boolean(
                image &&
                image.trim()
              )
          )
          .map((image) =>
            image.trim()
          )
      )
    );

  const updateData = {
    name:
      product.name.trim(),

    image:
      productImages[0] ?? "",

    image2:
      productImages[1] ?? null,

    image3:
      productImages[2] ?? null,

    image4:
      productImages[3] ?? null,

    images:
      productImages,

    category:
      product.category,

    price:
      safePrice,

    stock:
      safeStock,

    sizes:
      cleanSizes,

    colors:
      cleanColors,

    ...(product.description !==
    undefined
      ? {
          description:
            product.description.trim(),
        }
      : {}),
  };

  const {
    data,
    error,
  } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", productId)
    .select("*")
    .single();

  if (error) {
    console.error(
      "Update Product Error:",
      error
    );

    throw error;
  }

  if (!data) {
    throw new Error(
      "Product was not updated."
    );
  }

  return mapProduct(
    data as ProductRow
  );
}

/* =====================================================
   UPDATE ONLY STOCK
===================================================== */

export async function updateProductStock(
  id: number,
  stock: number
): Promise<Product> {
  const productId = Number(id);

  const safeStock = Math.max(
    0,
    Math.floor(
      Number(stock)
    )
  );

  if (
    !Number.isFinite(
      safeStock
    )
  ) {
    throw new Error(
      "Invalid stock value."
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("products")
    .update({
      stock: safeStock,
    })
    .eq("id", productId)
    .select("*")
    .single();

  if (error) {
    console.error(
      "Update Product Stock Error:",
      error
    );

    throw error;
  }

  if (!data) {
    throw new Error(
      "Product stock was not updated."
    );
  }

  return mapProduct(
    data as ProductRow
  );
}

/* =====================================================
   DECREASE STOCK
===================================================== */

export async function decreaseProductStock(
  id: number,
  quantity: number
): Promise<Product> {
  const safeQuantity =
    Math.floor(
      Number(quantity)
    );

  if (
    !Number.isFinite(
      safeQuantity
    ) ||
    safeQuantity <= 0
  ) {
    throw new Error(
      "Quantity must be greater than 0."
    );
  }

  const product =
    await getProductById(id);

  if (!product) {
    throw new Error(
      "Product not found."
    );
  }

  if (
    product.stock <
    safeQuantity
  ) {
    throw new Error(
      `Only ${product.stock} item(s) available.`
    );
  }

  return updateProductStock(
    product.id,
    product.stock -
      safeQuantity
  );
}

/* =====================================================
   DELETE PRODUCT
===================================================== */

export async function deleteProduct(
  id: number
): Promise<void> {
  const productId = Number(id);

  const {
    error,
  } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error(
      "Delete Product Error:",
      error
    );

    throw error;
  }
}

/* =====================================================
   LOW STOCK
===================================================== */

export async function getLowStockProducts(): Promise<Product[]> {
  const {
    data,
    error,
  } = await supabase
    .from("products")
    .select("*")
    .lte("stock", 5)
    .order("stock", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Get Low Stock Products Error:",
      error
    );

    return [];
  }

  return (data ?? []).map(
    (product) =>
      mapProduct(
        product as ProductRow
      )
  );
}

/* =====================================================
   GET PRODUCT IMAGES
===================================================== */

export function getProductImages(
  product: Product
): string[] {
  return product.images.length
    ? product.images
    : [
        product.image,
        product.image2,
        product.image3,
        product.image4,
      ].filter(
        (
          image
        ): image is string =>
          Boolean(
            image &&
            image.trim()
          )
      );
}