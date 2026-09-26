import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useFarmSettings } from '../hooks/useFarmSettings'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { settings } = useFarmSettings()

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#f5f3ed]/95 backdrop-blur">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* LOGO */}

        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src="/favicon.png"
            alt="LRC Farm"
            className="h-11 w-11 object-contain"
          />

          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-[#1f3828]">
              {settings?.farm_name || 'LRC Farm'}
            </span>

            <span className="text-xs tracking-[0.2em] uppercase text-stone-500">
              Fresh · Healthy · Farm Raised
            </span>
          </div>
        </Link>
        {/* DESKTOP NAVIGATION */}

        <nav className="hidden items-center gap-8 md:flex">

          <a
            href="#about"
            className="text-sm font-medium text-stone-600 transition hover:text-green-700"
          >
            About
          </a>

          <a
            href="#categories"
            className="text-sm font-medium text-stone-600 transition hover:text-green-700"
          >
            Categories
          </a>

          <a
            href="#contact"
            className="rounded-full bg-[#1f3828] px-5 py-2.5 text-sm font-bold !text-white transition hover:bg-green-800"
          >
            Contact Us
          </a>

        </nav>

        {/* MOBILE MENU BUTTON */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-[#1f3828] md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

      </div>

      {/* MOBILE MENU */}

      {menuOpen && (

        <div className="border-t border-stone-200 bg-[#f5f3ed] px-6 py-5 md:hidden">

          <nav className="flex flex-col gap-5">

            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
              className="font-medium text-stone-700"
            >
              About
            </a>

            <a
              href="#categories"
              onClick={() => setMenuOpen(false)}
              className="font-medium text-stone-700"
            >
              Categories
            </a>

            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="font-semibold text-green-700"
            >
              Contact Us
            </a>

          </nav>

        </div>
      )}

    </header>
  )
}

export default Navbar
