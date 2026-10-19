"use client";

import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
export default function TestPage() {
  async function testConnection() {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    console.log("============== SUPABASE DATA ==============");
    console.log(JSON.stringify(data, null, 2));
    console.log("===========================================");

    console.log("DATA:", data);
    console.log("FIRST PRODUCT:", data?.[0]);
    console.log("ERROR:", error);

    if (data?.[0]) {
      console.log("ID:", data[0].id);
      console.log("NAME:", data[0].name);
      console.log("PRICE:", data[0].price);
      console.log("IMAGE:", data[0].image);
      console.log("DESCRIPTION:", data[0].description);
      console.log("CATEGORY:", data[0].category);
      console.log("STOCK:", data[0].stock);
      console.log("STATUS:", data[0].status);
      console.log("SIZES:", data[0].sizes);
      console.log("COLORS:", data[0].colors);
    }

    toast.info("Check the browser console (F12)");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        onClick={testConnection}
        className="rounded-xl bg-black px-6 py-3 text-white"
      >
        Test Supabase
      </button>
    </div>
  );
}