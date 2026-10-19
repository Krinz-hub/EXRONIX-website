"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import AddressModal from "./AddressModal";
import { useAuth } from "@/context/AuthContext";
import {
  getAddresses,
  deleteAddress,
  setDefaultAddress,
} from "@/lib/addressService";

export default function AddressManager() {
  const { user } = useAuth();
const [openModal, setOpenModal] = useState(false);

const [editingAddress, setEditingAddress] =
  useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAddresses() {
    if (!user) return;

    setLoading(true);

    const data = await getAddresses(user.id);

    setAddresses(data);

    setLoading(false);
  }

  useEffect(() => {
    loadAddresses();
  }, [user]);

  async function handleDelete(id: number) {
    if (!confirm("Delete this address?")) return;

    await deleteAddress(id);

    toast.success("Address deleted");

    loadAddresses();
  }

  async function handleDefault(id: number) {
    if (!user) return;

    await setDefaultAddress(user.id, id);

    toast.success("Default address updated");

    loadAddresses();
  }

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-5 shadow-sm md:p-8">
        Loading addresses...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm md:p-8">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            📍 Saved Addresses
          </h2>

          <p className="mt-2 text-gray-500">
            Manage your shipping addresses.
          </p>
        </div>

        <button
  onClick={() => {
    setEditingAddress(null);
    setOpenModal(true);
  }}
  className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-white transition hover:bg-gray-800"
>
  <Plus size={18} />
  Add Address
</button>

      </div>

      {addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">

          <MapPin
            size={40}
            className="mx-auto text-gray-400"
          />

          <p className="mt-4 text-gray-500">
            No addresses added yet.
          </p>

        </div>
      ) : (
        <div className="space-y-5">

          {addresses.map((address) => (

            <div
              key={address.id}
              className="rounded-2xl border p-6"
            >

              <div className="flex items-start justify-between">

                <div>

                  <h3 className="text-xl font-semibold">
                    {address.full_name}
                  </h3>

                  <p className="mt-2 text-gray-600">
                    {address.phone}
                  </p>

                  <p className="mt-2 text-gray-600">
                    {address.address}
                  </p>

                  <p className="text-gray-600">
                    {address.city},{" "}
                    {address.district}
                  </p>

                  <p className="text-gray-600">
                    {address.province}
                  </p>

                </div>

                {address.is_default && (
                  <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700">

                    <Star size={16} />

                    Default

                  </div>
                )}

              </div>

              <div className="mt-6 flex gap-3">

                <button
                onClick={() => {
                    setEditingAddress(address);
                    setOpenModal(true);
                }}
                className="flex items-center gap-2 rounded-lg border px-4 py-2 transition hover:bg-gray-100"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(address.id)
                  }
                  className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Delete
                </button>

                {!address.is_default && (
                  <button
                    onClick={() =>
                      handleDefault(address.id)
                    }
                    className="rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800"
                  >
                    Set Default
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>
      )}
      <AddressModal
  open={openModal}
  onClose={() => {
    setOpenModal(false);
    setEditingAddress(null);
  }}
  onSuccess={loadAddresses}
  address={editingAddress}
/>

    </div>
  );
}