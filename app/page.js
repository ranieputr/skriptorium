"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");

  // 🔎 Search & Filter
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  // 🔄 Ambil data buku dari API
  const refresh = async () => {
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        console.error("API tidak mengembalikan array:", data);
        setBooks([]);
      }
    } catch (error) {
      console.error("Gagal fetch data:", error);
      setBooks([]);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // ➕ Tambah buku
  const addBook = async (e) => {
    e.preventDefault();
    await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author, year, genre, rating, review }),
    });
    setTitle("");
    setAuthor("");
    setYear("");
    setGenre("");
    setRating("");
    setReview("");
    refresh();
  };

  // 🔄 Toggle status buku
  const toggleStatus = async (id, status) => {
    const newStatus = status === "available" ? "borrowed" : "available";
    await fetch(`/api/books?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    refresh();
  };

  // ❌ Hapus buku
  const removeBook = async (id) => {
    await fetch(`/api/books?id=${id}`, { method: "DELETE" });
    refresh();
  };

  // 📌 Filter + Sort
  const filteredBooks = books
    .filter(
      (b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        (b.genre && b.genre.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "ratingHigh") return (b.rating || 0) - (a.rating || 0);
      if (sort === "ratingLow") return (a.rating || 0) - (b.rating || 0);
      return 0;
    });

  return (
    <section>
      <h1>📜 Koleksi Buku</h1>

      {/* 🔎 Search & Sort */}
      <div className="controls">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul, penulis, atau genre..."
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">📅 Terbaru</option>
          <option value="oldest">📅 Terlama</option>
          <option value="ratingHigh">⭐ Rating Tertinggi</option>
          <option value="ratingLow">⭐ Rating Terendah</option>
        </select>
      </div>

      {/* ➕ Form tambah buku */}
      <form className="book-form" onSubmit={addBook}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul Buku"
          required
        />
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Penulis"
          required
        />
        <input
          value={year}
          onChange={(e) => setYear(e.target.value)}
          type="number"
          placeholder="Tahun"
          required
        />
        <input
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Genre (Novel, Sains, dll)"
        />
        <input
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          type="number"
          min="1"
          max="5"
          placeholder="Rating 1-5"
        />
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Ulasan singkat"
        />
        <button type="submit">Tambah Buku</button>
      </form>

      {/* 📖 List buku */}
      <ul className="book-list">
        {filteredBooks.map((b) => (
          <li key={b.id}>
            <strong>{b.title}</strong> — {b.author} ({b.year})
            <br />
            <em>Genre: {b.genre || "Umum"}</em> | ⭐ {b.rating || "-"}
            {b.review && <p className="review">“{b.review}”</p>}
            <em> [{b.status}]</em>

            <div className="actions">
              <button type="button" onClick={() => toggleStatus(b.id, b.status)}>
                {b.status === "available" ? "📖 Pinjam" : "🔙 Kembalikan"}
              </button>
              <button type="button" onClick={() => removeBook(b.id)}>
                ❌ Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
