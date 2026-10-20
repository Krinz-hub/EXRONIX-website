const STORAGE_KEY = "exronix_recently_viewed";

export function saveRecentlyViewed(product: any) {
  if (!product) return;

  const existing = getRecentlyViewed();

  const filtered = existing.filter(
    (item: any) => item.id !== product.id
  );

  filtered.unshift(product);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(filtered.slice(0, 6))
  );
}

export function getRecentlyViewed() {
  if (typeof window === "undefined") return [];

  const data =
    localStorage.getItem(STORAGE_KEY) ||
    localStorage.getItem("zayna_recently_viewed");

  return data ? JSON.parse(data) : [];
}