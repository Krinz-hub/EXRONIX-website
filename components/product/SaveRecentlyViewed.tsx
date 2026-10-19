"use client";

import { useEffect } from "react";

import { saveRecentlyViewed } from "@/lib/recentlyViewed";

type Props = {
  product: any;
};

export default function SaveRecentlyViewed({
  product,
}: Props) {
  useEffect(() => {
    saveRecentlyViewed(product);
  }, [product]);

  return null;
}