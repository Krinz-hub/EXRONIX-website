"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import AddressModal from "./AddressModal";
import { useAuth } from "@/context/AuthContext";
import LoadingAnimation from "@/components/LoadingAnimation";
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
      <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 shadow-sm backdrop-blur-md md:p-12">
        <LoadingAnimation size="sm" text="LOADING ADDRESSES" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-5 text-white shadow-sm md:p-8">

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-white">
            📍 Saved Addresses
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Manage your shipping addresses.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingAddress(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-[#1677FF] px-5 py-3 font-bold text-white shadow-[0_0_15px_rgba(22,119,255,0.4)] transition hover:bg-[#1677FF]/90"
        >
          <Plus size={18} />
          Add Address
        </button>

      </div>

      {addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 p-10 text-center">

          <MapPin
            size={40}
            className="mx-auto text-gray-500"
          />

          <p className="mt-4 text-sm text-gray-400">
            No addresses added yet.
          </p>

        </div>
      ) : (
        <div className="space-y-5">

          {addresses.map((address) => (

            <div
              key={address.id}
              className="rounded-2xl border border-white/10 bg-[#0b0e14]/60 p-6"
            >

              <div className="flex items-start justify-between">

                <div>

                  <h3 className="text-xl font-semibold text-white">
                    {address.full_name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-300">
                    {address.phone}
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    {address.address}
                  </p>

                  <p className="text-sm text-gray-300">
                    {address.city},{" "}
                    {address.district}
                  </p>

                  <p className="text-sm text-gray-400">
                    {address.province}
                  </p>

                </div>

                {address.is_default && (
                  <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/15 px-4 py-1.5 text-xs font-semibold text-amber-400">

                    <Star size={14} className="fill-amber-400" />

                    Default

                  </div>
                )}

              </div>

              <div className="mt-6 flex flex-wrap gap-3">

                <button
                  onClick={() => {
                    setEditingAddress(address);
                    setOpenModal(true);
                  }}
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(address.id)
                  }
                  className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                >
                  <Trash2 size={15} />
                  Delete
                </button>

                {!address.is_default && (
                  <button
                    onClick={() =>
                      handleDefault(address.id)
                    }
                    className="rounded-xl border border-[#1677FF]/40 bg-[#1677FF]/15 px-4 py-2 text-sm font-semibold text-[#1677FF] transition hover:bg-[#1677FF]/25"
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