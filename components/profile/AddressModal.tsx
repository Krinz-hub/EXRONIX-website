"use client";

import { useEffect, useState } from "react";
import { X, MapPin } from "lucide-react";

type Address = {
  id: number;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  province: string;
  phone: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddressModal({
  open,
  onClose,
}: Props) {
  const [label, setLabel] = useState("Home");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [province, setProvince] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!open) return;

    setLabel("Home");
    setStreet("");
    setCity("");
    setPostalCode("");
    setProvince("");
    setPhone("");
  }, [open]);

  if (!open) return null;

  function handleSave() {
    const addresses: Address[] = JSON.parse(
      localStorage.getItem("exronix-addresses") || "[]"
    );

    addresses.push({
      id: Date.now(),
      label,
      street,
      city,
      postalCode,
      province,
      phone,
    });

    localStorage.setItem(
      "exronix-addresses",
      JSON.stringify(addresses)
    );

    window.dispatchEvent(new Event("addressUpdated"));

    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-[#0e1219]/95 liquid-glass backdrop-blur-2xl p-6 sm:p-8 shadow-2xl text-white">

        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <MapPin size={24} className="text-[#1677FF]" />
            <h2 className="text-2xl font-bold text-white">
              Add Address
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>

        </div>

        <div className="space-y-4">

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Address Label
            </label>

            <select
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#0b0e14] px-4 py-3 text-white outline-none transition focus:border-[#1677FF]"
            >
              <option className="bg-[#0b0e14] text-white">Home</option>
              <option className="bg-[#0b0e14] text-white">Office</option>
              <option className="bg-[#0b0e14] text-white">Hostel</option>
              <option className="bg-[#0b0e14] text-white">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Street Address
            </label>

            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                City
              </label>

              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Postal Code
              </label>

              <input
                value={postalCode}
                onChange={(e) =>
                  setPostalCode(e.target.value)
                }
                className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
              />
            </div>

          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Province
            </label>

            <input
              value={province}
              onChange={(e) =>
                setProvince(e.target.value)
              }
              className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Phone Number
            </label>

            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full rounded-xl border border-white/15 bg-[#0b0e14]/90 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition focus:border-[#1677FF]"
            />
          </div>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-[#1677FF] px-6 py-3 font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90"
          >
            Save Address
          </button>

        </div>

      </div>
    </div>
  );
}