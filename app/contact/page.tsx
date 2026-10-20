"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { toast } from "sonner";

import { sendMessage } from "@/lib/contactService";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) {
      toast.warning("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      await sendMessage(form);

      toast.success("Message sent successfully!");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Unable to send message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050608] text-white pt-36 pb-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}

        <div className="mb-16 text-center">
          <p className="uppercase tracking-[0.3em] text-[#1677FF] text-xs font-semibold">
            Engineering & Inquiries
          </p>

          <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-white">
            Connect With EXRONIX
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Have questions about our 3D printed catalogue, material specs, or custom additive manufacturing projects? Reach out to our team.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Contact Info */}

          <div className="space-y-8 rounded-3xl liquid-glass border border-white/10 p-10">

            <div className="flex gap-5">
              <Mail size={28} className="text-[#1677FF] shrink-0" />
              <div>
                <h3 className="font-bold text-white">Email</h3>
                <a
                  href="mailto:support@exronix.store"
                  className="text-gray-300 transition hover:text-[#1677FF] hover:underline"
                >
                  support@exronix.store
                </a>
              </div>
            </div>

            <div className="flex gap-5">
              <Phone size={28} className="text-[#1677FF] shrink-0" />
              <div>
                <h3 className="font-bold text-white">Support Phone</h3>
                <a
                  href="tel:+9876543210"
                  className="block text-gray-300 transition hover:text-[#1677FF] hover:underline"
                >
                  +9876543210
                </a>

                <a
                  href="tel:+8976542310"
                  className="block text-gray-300 transition hover:text-[#1677FF] hover:underline"
                >
                  +8976542310
                </a>
              </div>
            </div>

            <div className="flex gap-5">
              <MapPin size={28} className="text-[#1677FF] shrink-0" />
              <div>
                <h3 className="font-bold text-white">Manufacturing & Office</h3>
                <p className="text-gray-300">Haryana, panipat</p>
              </div>
            </div>

            <div className="flex gap-5">
              <Clock size={28} className="text-[#1677FF] shrink-0" />
              <div>
                <h3 className="font-bold text-white">Working Hours</h3>
                <p className="text-gray-300">Sunday – Friday</p>
                <p className="text-gray-300">10:00 AM – 6:00 PM</p>
              </div>
            </div>

            {/* Socials */}

            <div className="border-t border-white/10 pt-8">
              <h3 className="mb-5 text-xl font-bold text-white">
                Engineering Channels
              </h3>

              <div className="space-y-4">

                {/* Instagram */}

                <a
                  href="https://instagram.com/exronix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-[#1677FF]/50 hover:bg-[#1677FF]/10"
                >
                  <FaInstagram size={24} className="text-[#1677FF]" />

                  <div>
                    <p className="font-semibold text-white">
                      Instagram
                    </p>

                    <p className="text-sm text-gray-400">
                      @exronix
                    </p>
                  </div>
                </a>

              </div>
            </div>

          </div>

          {/* Contact Form */}

          <div className="rounded-3xl liquid-glass border border-white/10 p-10">

            <div className="space-y-5">

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-white/10 bg-[#050608] p-4 text-white placeholder-gray-500 focus:border-[#1677FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-[#050608] p-4 text-white placeholder-gray-500 focus:border-[#1677FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Subject / Project Type
                </label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. Custom Print Request / Product Spec"
                  className="w-full rounded-xl border border-white/10 bg-[#050608] p-4 text-white placeholder-gray-500 focus:border-[#1677FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                  Message Details
                </label>
                <textarea
                  rows={5}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Provide details about dimensions, materials, or your question..."
                  className="w-full rounded-xl border border-white/10 bg-[#050608] p-4 text-white placeholder-gray-500 focus:border-[#1677FF] focus:outline-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#1677FF] py-4 text-white font-semibold shadow-[0_0_20px_rgba(22,119,255,0.35)] transition hover:bg-[#1677FF]/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoadingAnimation size="xs" />
                    <span>Transmitting Inquiry...</span>
                  </>
                ) : (
                  "Submit Inquiry"
                )}
              </button>

            </div>

          </div>

        </div>
      </div>
    </main>
  );
}