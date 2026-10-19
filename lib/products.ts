import { supabase } from "./supabase";

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

  images: string[];

  price: number;

  description: string;

  category: string;

  stock: number;

  

  status: "In Stock" | "Low Stock" | "Out of Stock";

  sizes: string[];

  colors: string[];
};

/* =====================================================
   ADD PRODUCT TYPE
===================================================== */

export type AddProductData = {
  name: string;

  image: string;

  image2?: string | null;

  image3?: string | null;

  image4?: string | null;

  images?: string[];

  price: number;

  description: string;

  category: string;

  stock: number;

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
   SUPABASE PRODUCT ROW TYPE
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
   CLEAN SINGLE OPTION
===================================================== */

function cleanOption(value: unknown): string {
  let result = String(value ?? "").trim();

  /*
    Fix corrupted values such as:

    [[White]     -> White
    [White]      -> White
    [[[White]]]  -> White
    [[[L]        -> L
    [XXL]        -> XXL
  */

  result = result
    .replace(/[{}[\]"]/g, "")
    .trim();

  return result;
}

/* =====================================================
   PARSE PRODUCT OPTIONS
===================================================== */

function parsePgArray(value: unknown): string[] {
  if (value === null || value === undefined) {
    return [];
  }

  let values: string[] = [];

  /* -----------------------------------------------------
     CASE 1: JavaScript array
  ----------------------------------------------------- */

  if (Array.isArray(value)) {
    values = value
      .flat(Infinity)
      .map((item) => String(item));
  }

  /* -----------------------------------------------------
     CASE 2: String
  ----------------------------------------------------- */

  else if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    /*
      Try JSON first.

      Example:

      ["White","Black"]
    */

    try {
      const parsed: unknown = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        values = parsed
          .flat(Infinity)
          .map((item) => String(item));
      } else {
        values = [String(parsed)];
      }
    } catch {
      /*
        PostgreSQL / corrupted array.

        Examples:

        {"White","Black"}
        {White,Black}
        [[White],White]
        [[[L],XL,XXL]
      */

      const cleanedString = trimmed.replace(
        /[{}[\]"]/g,
        ""
      );

      values = cleanedString.split(",");
    }
  }

  /* -----------------------------------------------------
     CLEAN VALUES
  ----------------------------------------------------- */

  const cleanedValues = values
    .map(cleanOption)
    .filter(Boolean);

  /*
    Remove duplicates while preserving order.
  */

  return Array.from(new Set(cleanedValues));
}

/* =====================================================
   CLEAN OPTIONS BEFORE DATABASE SAVE
===================================================== */

function cleanOptions(values: string[]): string[] {
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
  image: unknown,
  image2: unknown,
  image3: unknown,
  image4: unknown,
  images: unknown
): string[] {
  /* -----------------------------------------------------
     If images is already an array
  ----------------------------------------------------- */

  if (Array.isArray(images)) {
    const parsed = images
      .flat(Infinity)
      .map((item) => String(item))
      .map((item) => item.trim())
      .filter(Boolean);

    if (parsed.length > 0) {
      return Array.from(new Set(parsed));
    }
  }

  /* -----------------------------------------------------
     If images is stored as JSON/text
  ----------------------------------------------------- */

  if (typeof images === "string") {
    const trimmed = images.trim();

    if (trimmed) {
      try {
        const parsed: unknown = JSON.parse(trimmed);

        if (Array.isArray(parsed)) {
          const result = parsed
            .flat(Infinity)
            .map((item) => String(item).trim())
            .filter(Boolean);

          if (result.length > 0) {
            return Array.from(new Set(result));
          }
        }
      } catch {
        // Ignore invalid JSON and use image columns.
      }
    }
  }

  /* -----------------------------------------------------
     FALLBACK TO IMAGE COLUMNS
  ----------------------------------------------------- */

  return Array.from(
    new Set(
      [image, image2, image3, image4]
        .map((value) => String(value ?? "").trim())
        .filter(Boolean)
    )
  );
}

/* =====================================================
   STOCK STATUS
===================================================== */

function getStockStatus(
  stock: number
): "In Stock" | "Low Stock" | "Out of Stock" {
  if (stock <= 0) {
    return "Out of Stock";
  }

  if (stock <= 5) {
    return "Low Stock";
  }

  return "In Stock";
}

/* =====================================================
   MAP SUPABASE PRODUCT
===================================================== */

function mapProduct(product: ProductRow): Product {
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

  const productImages = parseImages(
    product.image,
    product.image2,
    product.image3,
    product.image4,
    product.images
  );

  return {
    id: Number(product.id),

    name: product.name ?? "",

    image:
      product.image ??
      productImages[0] ??
      "",

    image2:
      product.image2 ??
      productImages[1] ??
      null,

    image3:
      product.image3 ??
      productImages[2] ??
      null,

    image4:
      product.image4 ??
      productImages[3] ??
      null,

    images: productImages,

    price,

    description:
      product.description ?? "",

    category:
      product.category ?? "",

    stock,


    /*
      IMPORTANT:
      Status is ALWAYS calculated from stock.
      Database status cannot randomly change stock.
    */

    status: getStockStatus(stock),

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
  const {
    data,
    error,
  } = await supabase
    .from("products")
    .select("*")
    .order("id", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Get Products Error:",
      error
    );

    return [];
  }

  return (data ?? []).map(
    (product) =>
      mapProduct(product as ProductRow)
  );
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

  const {
    data,
    error,
  } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    console.error(
      "Get Product By ID Error:",
      error
    );

    return null;
  }

  if (!data) {
    return null;
  }

  return mapProduct(
    data as ProductRow
  );
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
      mapProduct(product as ProductRow)
  );
}

/* =====================================================
   ADD PRODUCT
===================================================== */

export async function addProduct(
  product: AddProductData
): Promise<Product> {
  const safePrice = Math.max(
    0,
    Number(product.price)
  );

  const safeStock = Math.max(
    0,
    Math.floor(Number(product.stock))
  );

  const cleanSizes =
    cleanOptions(product.sizes);

  const cleanColors =
    cleanOptions(product.colors);

  /*
    Make sure the first image is always the
    main image.
  */

  const productImages = Array.from(
    new Set(
      [
        product.image,
        product.image2,
        product.image3,
        product.image4,
        ...(product.images ?? []),
      ]
        .map((value) =>
          String(value ?? "").trim()
        )
        .filter(Boolean)
    )
  );

  const mainImage =
    productImages[0] ??
    product.image ??
    "";

  const insertData = {
    name:
      product.name.trim(),

    image:
      mainImage,

    image2:
      productImages[1] ?? null,

    image3:
      productImages[2] ?? null,

    image4:
      productImages[3] ?? null,

    images: JSON.stringify(productImages),

    price:
      safePrice,

    description:
      product.description?.trim() ?? "",

    category:
      product.category,

    stock:
      safeStock,

    /*
      New product always starts with
      zero sold items.
    */

    sizes:
      cleanSizes,

    colors:
      cleanColors,
  };

  console.log(
    "================================="
  );

  console.log(
    "ADDING PRODUCT"
  );

  console.log(
    "Product:",
    insertData
  );

  console.log(
    "================================="
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
      "================================="
    );

    console.error(
      "ADD PRODUCT ERROR"
    );

    console.error(error);

    console.error(
      "================================="
    );

    throw error;
  }

  if (!data) {
    throw new Error(
      "Product was not created."
    );
  }

  console.log(
    "Product Added:",
    data
  );

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
  const productId =
    Number(id);

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
    Preserve multiple images when editing.
  */

  const productImages = Array.from(
    new Set(
      [
        product.image,
        product.image2,
        product.image3,
        product.image4,
        ...(product.images ?? []),
      ]
        .map((value) =>
          String(value ?? "").trim()
        )
        .filter(Boolean)
    )
  );

  const updateData = {
    name:
      product.name.trim(),

    image:
      productImages[0] ??
      product.image,

    image2:
      productImages[1] ?? null,

    image3:
      productImages[2] ?? null,

    image4:
      productImages[3] ?? null,

    images: JSON.stringify(productImages),

    category:
      product.category,

    price:
      safePrice,

    /*
      IMPORTANT:
      Stock is saved exactly as entered.
      Nothing here decreases stock automatically.
    */

    stock:
      safeStock,

    sizes:
      cleanSizes,

    colors:
      cleanColors,

    ...(product.description !== undefined
      ? {
          description:
            product.description.trim(),
        }
      : {}),
  };

  console.log(
    "================================="
  );

  console.log(
    "UPDATING PRODUCT"
  );

  console.log(
    "Product ID:",
    productId
  );

  console.log(
    "New Stock:",
    safeStock
  );

  console.log(
    "New Price:",
    safePrice
  );

  console.log(
    "Images:",
    productImages
  );

  console.log(
    "Sizes:",
    cleanSizes
  );

  console.log(
    "Colors:",
    cleanColors
  );

  console.log(
    "================================="
  );

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
      "================================="
    );

    console.error(
      "UPDATE PRODUCT ERROR"
    );

    console.error(error);

    console.error(
      "================================="
    );

    throw error;
  }

  if (!data) {
    throw new Error(
      "Product was not updated."
    );
  }

  console.log(
    "UPDATED PRODUCT FROM SUPABASE:",
    data
  );

  return mapProduct(
    data as ProductRow
  );
}

/* =====================================================
   UPDATE ONLY PRODUCT STOCK
===================================================== */

export async function updateProductStock(
  id: number,
  stock: number
): Promise<Product> {
  const productId =
    Number(id);

  if (!Number.isFinite(productId)) {
    throw new Error(
      "Invalid product ID."
    );
  }

  const numericStock =
    Number(stock);

  if (
    !Number.isFinite(
      numericStock
    )
  ) {
    throw new Error(
      "Invalid stock value."
    );
  }

  const safeStock = Math.max(
    0,
    Math.floor(numericStock)
  );

  console.log(
    "================================="
  );

  console.log(
    "UPDATING PRODUCT STOCK"
  );

  console.log(
    "Product ID:",
    productId
  );

  console.log(
    "New Stock:",
    safeStock
  );

  console.log(
    "================================="
  );

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

  console.log(
    "Updated Stock From Supabase:",
    data.stock
  );

  return mapProduct(
    data as ProductRow
  );
}

/* =====================================================
   DECREASE PRODUCT STOCK
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

  const newStock =
    product.stock -
    safeQuantity;

  return updateProductStock(
    product.id,
    newStock
  );
}

/* =====================================================
   DELETE PRODUCT
===================================================== */

export async function deleteProduct(
  id: number
): Promise<void> {
  const productId =
    Number(id);

  if (!Number.isFinite(productId)) {
    throw new Error(
      "Invalid product ID."
    );
  }

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
   GET LOW STOCK PRODUCTS
===================================================== */

export async function getLowStockProducts(): Promise<
  Product[]
> {
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