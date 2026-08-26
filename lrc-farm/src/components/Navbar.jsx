import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#f5f3ed]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-[#1f3828]"
        >
          LRC <span className="text-green-700">Farm</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-stone-700 transition hover:text-green-700"
          >
            Home
          </Link>

          <a
            href="/#categories"
            className="text-sm font-medium text-stone-700 transition hover:text-green-700"
          >
            Categories
          </a>

          <a
            href="#contact"
            className="text-sm font-medium text-stone-700 transition hover:text-green-700"
          >
            Contact
          </a>
        </div>

        {/* Contact Button */}
        <a
          href="#contact"
          className="hidden rounded-full bg-[#1f3828] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 md:block"
        >
          Contact Us
        </a>

        {/* Mobile Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-[#1f3828] md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-stone-200 bg-[#f5f3ed] px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="font-medium text-stone-700"
            >
              Home
            </Link>

            <a
              href="/#categories"
              onClick={() => setMenuOpen(false)}
              className="font-medium text-stone-700"
            >
              Categories
            </a>

            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="font-medium text-stone-700"
            >
              Contact
            </a>

          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar