import { Link } from 'react-router-dom'
import { MapPin, Phone, MessageCircle } from 'lucide-react'
import { useFarmSettings } from '../hooks/useFarmSettings'

function Footer() {
  const { settings } = useFarmSettings()

  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#14261b] px-6 pt-16 text-white">

      <div className="mx-auto grid max-w-7xl gap-12 pb-12 md:grid-cols-2 lg:grid-cols-4">

        {/* FARM INFO */}

        <div>

          <h2 className="text-2xl font-bold">
            {settings?.farm_name || 'LRC Farm'}
          </h2>

          <p className="mt-4 max-w-sm leading-relaxed text-green-100/70">
            {settings?.about_text ||
              'Healthy animals, quality poultry, pigeons, fish, pets and more.'}
          </p>

        </div>


        {/* QUICK LINKS */}

        <div>

          <h3 className="font-semibold text-green-200">
            Quick Links
          </h3>

          <div className="mt-5 flex flex-col gap-3">

            <Link
              to="/"
              className="text-sm text-green-100/70 transition hover:text-white"
            >
              Home
            </Link>

            <a
              href="#about"
              className="text-sm text-green-100/70 transition hover:text-white"
            >
              About Us
            </a>

            <a
              href="#categories"
              className="text-sm text-green-100/70 transition hover:text-white"
            >
              Categories
            </a>

            <a
              href="#contact"
              className="text-sm text-green-100/70 transition hover:text-white"
            >
              Contact
            </a>

          </div>

        </div>


        {/* CONTACT */}

        <div>

          <h3 className="font-semibold text-green-200">
            Contact
          </h3>

          <div className="mt-5 space-y-4">

            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-3 text-sm text-green-100/70 transition hover:text-white"
              >
                <Phone size={17} />
                {settings.phone}
              </a>
            )}

            {settings?.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm text-green-100/70 transition hover:text-white"
              >
                <MessageCircle size={17} />
                WhatsApp Us
              </a>
            )}

            {settings?.address && (
              <div className="flex items-start gap-3 text-sm leading-relaxed text-green-100/70">
                <MapPin size={17} className="mt-0.5 shrink-0" />
                {settings.address}
              </div>
            )}

          </div>

        </div>


        {/* FARM MESSAGE */}

        <div>

          <h3 className="font-semibold text-green-200">
            Visit LRC Farm
          </h3>

          <p className="mt-5 text-sm leading-relaxed text-green-100/70">
            Explore our available farm categories and contact us directly
            for availability and further information.
          </p>

          <a
            href="#contact"
            className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#1f3828] transition hover:bg-green-100"
          >
            Contact Us
          </a>

        </div>

      </div>


      {/* BOTTOM BAR */}

      <div className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 py-6 text-sm text-green-100/50 sm:flex-row">

          <p>
            © {year} {settings?.farm_name || 'LRC Farm'}. All rights reserved.
          </p>

          <p>
            Fresh · Healthy · Farm Raised
          </p>

        </div>

      </div>

    </footer>
  )
}

export default Footer