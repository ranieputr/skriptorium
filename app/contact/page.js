"use client"

import { useState } from "react"

export default function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("⏳ Mengirim...")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus("✅ Pesan berhasil dikirim!")
        setName("")
        setEmail("")
        setMessage("")
      } else {
        setStatus(`❌ ${data.error || "Gagal mengirim pesan"}`)
      }
    } catch (err) {
      setStatus("❌ Terjadi kesalahan server")
    }
  }

  return (
    <section>
      <h1>📮 Kotak Surat Skriptorium</h1>

      <p>
        Seperti sebuah <em>meja kayu tua</em> di sudut perpustakaan, halaman ini
        adalah tempat untuk meninggalkan pesan, saran, atau sekadar menyapa
        penjaga naskah.
      </p>

      <p>Silakan hubungi saya melalui:</p>
      <ul>
        <li>
          📧 Email:{" "}
          <a href="mailto:ranieputr@gmail.com">ranieputr@gmail.com</a>
        </li>
        <li>📱 WhatsApp: +62 896 3349 9617</li>
      </ul>

      <blockquote>
        “Setiap pesan adalah tinta baru di lembar perjalanan kita.”
      </blockquote>

      {/* 📩 Form Contact */}
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="Tulis pesanmu di sini..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">📨 Kirim Pesan</button>
      </form>

      {status && <p>{status}</p>}
    </section>
  )
}
