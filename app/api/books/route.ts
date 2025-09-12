import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// 📌 GET → ambil semua buku
export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(books)
  } catch (error: any) {
    console.error("API GET Error:", error.message || error)
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 })
  }
}

// 📌 POST → tambah buku baru
export async function POST(req: NextRequest) {
  try {
    const { title, author, year, genre, rating, review } = await req.json()

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        year: Number(year),
        genre,
        rating: rating ? Number(rating) : null,
        review,
      },
    })

    return NextResponse.json(newBook)
  } catch (error: any) {
    console.error("API POST Error:", error.message || error)
    return NextResponse.json({ error: "Gagal menambah buku" }, { status: 500 })
  }
}

// 📌 PUT → update buku (status, review, rating, genre)
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const body = await req.json()

    if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 })

    const updated = await prisma.book.update({
      where: { id },
      data: {
        status: body.status,
        review: body.review,
        genre: body.genre,
        rating: body.rating ? Number(body.rating) : undefined,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("API PUT Error:", error.message || error)
    return NextResponse.json({ error: "Gagal update buku" }, { status: 500 })
  }
}

// 📌 DELETE → hapus buku
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 })

    await prisma.book.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("API DELETE Error:", error.message || error)
    return NextResponse.json({ error: "Gagal menghapus buku" }, { status: 500 })
  }
}
