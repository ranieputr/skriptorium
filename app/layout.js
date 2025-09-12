import { Geist, Geist_Mono } from "next/font/google"
import Link from "next/link"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "📜 Skriptorium",
  description: "Perpustakaan digital bergaya vintage",
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* HEADER */}
        <header className="header">
          <nav>
            {/* Logo */}
            <div className="logo">📜 Skriptorium</div>

            {/* Menu */}
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">Tentang</Link>
              </li>
              <li>
                <Link href="/contact">Kontak</Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* MAIN CONTENT */}
        <main>{children}</main>

        {/* FOOTER */}
        <footer className="footer">
          © {new Date().getFullYear()} Skriptorium
        </footer>
      </body>
    </html>
  )
}
