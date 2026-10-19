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
      localStorage.getItem("zayna-addresses") || "[]"
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
      "zayna-addresses",
      JSON.stringify(addresses)
    );

    window.dispatchEvent(new Event("addressUpdated"));

    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <MapPin size={24} />
            <h2 className="text-2xl font-bold">
              Add Address
            </h2>
          </div>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="space-y-5">

          <div>
            <label className="mb-2 block font-medium">
              Address Label
            </label>

            <select
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            >
              <option>Home</option>
              <option>Office</option>
              <option>Hostel</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Street Address
            </label>

            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="mb-2 block font-medium">
                City
              </label>

              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Postal Code
              </label>

              <input
                value={postalCode}
                onChange={(e) =>
                  setPostalCode(e.target.value)
                }
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

          </div>

          <div>
            <label className="mb-2 block font-medium">
              Province
            </label>

            <input
              value={province}
              onChange={(e) =>
                setProvince(e.target.value)
              }
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Phone Number
            </label>

            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-3"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Save Address
          </button>

        </div>

      </div>
    </div>
  );
}