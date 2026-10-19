import { supabase } from "./supabase";

export type ContactMessage = {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
};

export async function sendMessage(
  message: ContactMessage
) {
  const { error } = await supabase
    .from("contact_messages")
    .insert(message);

  if (error) throw error;
}

export async function getMessages() {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function deleteMessage(id: number) {
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) throw error;
}