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
    <main className="min-h-screen bg-gray-50 pt-36 pb-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}

        <div className="mb-16 text-center">
          <p className="uppercase tracking-[0.3em] text-gray-500">
            Contact
          </p>

          <h1 className="mt-4 text-5xl font-bold">
            We'd Love to Hear From You
          </h1>

          <p className="mt-5 text-lg text-gray-500">
            Have questions about our products or your order?
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Contact Info */}

          <div className="space-y-8 rounded-3xl bg-white p-10 shadow">

            <div className="flex gap-5">
              <Mail size={28} />
              <div>
                <h3 className="font-bold">Email</h3>
                <a
  href="mailto:support@zaynastudio.store"
  className="transition hover:text-black hover:underline"
>
 support@zaynastudio.store
</a>
              </div>
            </div>

            <div className="flex gap-5">
              <Phone size={28} />
              <div>
                <h3 className="font-bold">Phone</h3>
                <a
  href="tel:+9779842958835"
  className="block transition hover:text-black hover:underline"
>
  +977 9842958835
</a>

<a
  href="tel:+9779807124306"
  className="block transition hover:text-black hover:underline"
>
  +977 9807124306
</a>
              </div>
            </div>

            <div className="flex gap-5">
              <MapPin size={28} />
              <div>
                <h3 className="font-bold">Location</h3>
                <p>Hetauda, Nepal</p>
              </div>
            </div>

            <div className="flex gap-5">
              <Clock size={28} />
              <div>
                <h3 className="font-bold">Working Hours</h3>
                <p>Sunday – Friday</p>
                <p>10:00 AM – 6:00 PM</p>
              </div>
            </div>

            {/* Socials */}

            <div className="border-t pt-8">
              <h3 className="mb-5 text-xl font-bold">
                Connect With Us
              </h3>

              <div className="space-y-4">

                {/* Instagram */}

                <a
                  href="https://instagram.com/zaynastudio_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl border p-4 transition-all duration-300 hover:border-pink-400 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:shadow-md"
                >
                  <FaInstagram size={24} className="text-pink-600" />

                  <div>
                    <p className="font-semibold">
                      Instagram
                    </p>

                    <p className="text-sm text-gray-500">
                      @zaynastudio_
                    </p>
                  </div>
                </a>

                {/* TikTok */}

                <a
                  href="https://www.tiktok.com/@zaynastudio_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl border p-4 transition-all duration-300 hover:border-black hover:bg-gray-50 hover:shadow-md"
                >
                    <FaTiktok size={24} />
                  

                  <div>
                    <p className="font-semibold">
                      TikTok
                    </p>

                    <p className="text-sm text-gray-500">
                      @zaynastudio_
                    </p>
                  </div>
                </a>

              </div>
            </div>

          </div>

          {/* Contact Form */}

          <div className="rounded-3xl bg-white p-10 shadow">

            <div className="space-y-5">

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full rounded-xl border p-4"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full rounded-xl border p-4"
              />

              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full rounded-xl border p-4"
              />

              <textarea
                rows={7}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full rounded-xl border p-4"
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-xl bg-black py-4 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

            </div>

          </div>

        </div>
      </div>
    </main>
  );
}