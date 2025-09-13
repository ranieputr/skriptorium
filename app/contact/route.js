import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🔑 Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 📩 POST → simpan pesan ke tabel contact
export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    // Validasi input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Simpan ke tabel contact
    const { data, error } = await supabase
      .from("contact")
      .insert([{ name, email, message }])
      .select();

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json(
        { error: "Gagal menyimpan pesan" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pesan berhasil dikirim!",
      data,
    });
  } catch (err) {
    console.error("API Contact Error:", err.message);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
