export const updateWishlist = () => {
  window.dispatchEvent(new Event("wishlistUpdated"));
};

export const updateCart = () => {
  window.dispatchEvent(new Event("cartUpdated"));
};