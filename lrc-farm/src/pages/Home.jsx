import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import heroImage from '../assets/background.jpeg'
import {
  ArrowRight,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
} from 'lucide-react'
import { useFarmSettings } from '../hooks/useFarmSettings'

function Home() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { settings } = useFarmSettings()

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) {
        setError(error.message)
      } else {
        setCategories(data)
      }

      setLoading(false)
    }

    fetchCategories()
  }, [])

  return (

      
    <main className="min-h-screen bg-[#f5f3ed] text-stone-900">
{/* HERO SECTION */}
<section
  className="relative isolate min-h-[720px] overflow-hidden bg-[#163326] bg-cover bg-center"
  style={{
    backgroundImage: `url(${heroImage})`,
  }}
>
  {/* Dark readable overlay */}
  <div className="absolute inset-0 bg-[#10281c]/70" />

  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#10281c]/90 via-[#163326]/65 to-[#163326]/30" />

  {/* Bottom fade */}
  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#10281c]/60 to-transparent" />

  <div className="relative z-10 mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-8">

    {/* LEFT CONTENT */}
    <div className="max-w-2xl">

      <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-green-400" />

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-200">
          Welcome to LRC Farm
        </p>
      </div>

      <h1 className="mt-7 text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
        Fresh From
        <span className="block text-green-300">
          Our Farm.
        </span>
      </h1>

      <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
        Healthy animals, quality poultry, beautiful pigeons,
        guppy fish, pets, eggs and more — directly from LRC Farm.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">

        <a
          href="#categories"
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 font-semibold text-[#1f3828] shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-green-100"
        >
          Explore Our Farm

          <ArrowRight
            size={20}
            className="transition duration-300 group-hover:translate-x-1"
          />
        </a>

        {settings?.phone && (
          <a
            href={`tel:${settings.phone}`}
            className="inline-flex items-center justify-center gap-3 rounded-full border border-white/30 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/15"
          >
            <Phone size={20} />
            Contact Us
          </a>
        )}

      </div>

      <div className="mt-12 flex items-center gap-6 text-sm text-white/60">

        <div>
          <p className="font-semibold text-white">
            Healthy
          </p>

          <p className="mt-1">
            Farm raised
          </p>
        </div>

        <div className="h-10 w-px bg-white/20" />

        <div>
          <p className="font-semibold text-white">
            Quality
          </p>

          <p className="mt-1">
            Carefully maintained
          </p>
        </div>

        <div className="h-10 w-px bg-white/20" />

        <div>
          <p className="font-semibold text-white">
            Direct
          </p>

          <p className="mt-1">
            Contact the farm
          </p>
        </div>

      </div>

    </div>


    {/* RIGHT GLASS CARD */}
    <div className="relative hidden lg:block">

      {/* Glow */}
      <div className="absolute -inset-10 rounded-full bg-green-400/10 blur-3xl" />

      <div className="relative ml-auto max-w-md rounded-[2rem] border border-white/20 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-green-400/15 text-3xl">
          🌿
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-green-300">
          LRC Farm
        </p>

        <h2 className="mt-4 text-4xl font-bold leading-tight text-white">
          Fresh.
          <br />
          Healthy.
          <br />
          Farm Raised.
        </h2>

        <p className="mt-6 leading-relaxed text-white/70">
          Explore our available varieties and discover what LRC Farm has to offer.
        </p>

        <a
          href="#categories"
          className="mt-8 inline-flex items-center gap-2 font-semibold text-green-300 transition hover:text-white"
        >
          View categories
          <ArrowRight size={18} />
        </a>

      </div>

    </div>

  </div>
</section>
{/* ABOUT SECTION */}

<section
  id="about"
  className="bg-[#f5f3ed] px-6 py-24"
>
  <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

    {/* LEFT SIDE */}

    <div className="relative">

      <div className="aspect-square overflow-hidden rounded-[2rem] bg-[#dfe8dc] p-8">

        <div className="flex h-full flex-col items-center justify-center text-center">

          <span className="text-7xl">
            🌾
          </span>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-green-700">
            LRC Farm
          </p>

          <h3 className="mt-3 text-3xl font-bold text-[#1f3828]">
            Quality Raised With Care
          </h3>

        </div>

      </div>

      {/* Decorative box */}

      <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-[#1f3828] p-6 text-white shadow-xl md:block">

        <p className="text-3xl">
          🌿
        </p>

        <p className="mt-2 font-semibold">
          Fresh from the farm
        </p>

      </div>

    </div>


    {/* RIGHT SIDE */}

    <div>

      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-700">
        About Us
      </p>

      <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#1f3828] sm:text-5xl">
        More Than Just a Farm
      </h2>

      <p className="mt-7 max-w-xl text-lg leading-relaxed text-stone-600">
        {settings?.about_text ||
          'Welcome to LRC Farm. We provide a variety of healthy poultry, pigeons, guppy fish, pets and other farm supplies.'}
      </p>

      <p className="mt-5 max-w-xl leading-relaxed text-stone-500">
        Browse our available categories and contact us directly for
        availability, further information, and orders.
      </p>

      <a
        href="#categories"
        className="mt-8 inline-flex items-center gap-2 font-semibold text-green-700 transition hover:text-green-900"
      >
        Explore our categories
        <ArrowRight size={18} />
      </a>

    </div>

  </div>
</section>

      {/* CATEGORIES SECTION */}

<section
  id="categories"
  className="bg-white px-6 py-24"
>
  <div className="mx-auto max-w-7xl">

    {/* SECTION HEADER */}

    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-700">
          Explore LRC Farm
        </p>

        <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#1f3828] sm:text-5xl">
          What We Have
        </h2>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
          Explore the different varieties available at our farm.
          Select a category to see more details.
        </p>

      </div>

      <p className="text-sm text-stone-500">
        {categories.length} categories available
      </p>

    </div>


    {/* LOADING */}

    {loading ? (

      <div className="mt-12 flex justify-center py-16">
        <p className="text-stone-500">
          Loading categories...
        </p>
      </div>

    ) : categories.length === 0 ? (

      <div className="mt-12 rounded-3xl bg-[#f5f3ed] p-12 text-center">

        <p className="text-lg text-stone-500">
          Categories will be available soon.
        </p>

      </div>

    ) : (

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {categories.map((category) => (

          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="group overflow-hidden rounded-3xl bg-[#f5f3ed] shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
          >

            {/* CATEGORY IMAGE */}

            <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">

              {category.image_url ? (

                <img
                  src={category.image_url}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />

              ) : (

                <div className="flex h-full items-center justify-center text-stone-400">
                  Image coming soon
                </div>

              )}

              {/* IMAGE OVERLAY */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

            </div>


            {/* CATEGORY CONTENT */}

            <div className="p-6">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h3 className="text-2xl font-bold text-[#1f3828]">
                    {category.name}
                  </h3>

                  {category.description && (

                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-stone-600">
                      {category.description}
                    </p>

                  )}

                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 transition group-hover:bg-[#1f3828] group-hover:text-white">

                  <ArrowRight size={20} />

                </div>

              </div>


              <p className="mt-6 text-sm font-semibold text-green-700">
                Explore category →
              </p>

            </div>

          </Link>

        ))}

      </div>

    )}

  </div>
</section>
{/* CONTACT SECTION */}

<section
  id="contact"
  className="bg-[#1f3828] px-6 py-24"
>
  <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">

    {/* LEFT SIDE */}

    <div>

      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-300">
        Contact LRC Farm
      </p>

      <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Interested in Something?
      </h2>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-green-100">
        Contact us directly to know more about availability,
        varieties, and other details.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">

        {settings?.whatsapp && (
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-[#1f3828] transition hover:bg-green-100"
          >
            <MessageCircle size={20} />
            WhatsApp Us
          </a>
        )}

        {settings?.phone && (
          <a
            href={`tel:${settings.phone}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-green-300 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
          >
            <Phone size={20} />
            Call Us
          </a>
        )}

      </div>

    </div>


    {/* RIGHT SIDE - CONTACT DETAILS */}

    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <h3 className="text-2xl font-bold text-[#1f3828]">
        Get in Touch
      </h3>

      <div className="mt-8 space-y-6">

        {/* PHONE */}

        {settings?.phone && (
          <div className="flex gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Phone size={22} />
            </div>

            <div>
              <p className="text-sm text-stone-500">
                Phone
              </p>

              <a
                href={`tel:${settings.phone}`}
                className="font-semibold text-[#1f3828]"
              >
                {settings.phone}
              </a>
            </div>

          </div>
        )}


        {/* WHATSAPP */}

        {settings?.whatsapp && (
          <div className="flex gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
              <MessageCircle size={22} />
            </div>

            <div>
              <p className="text-sm text-stone-500">
                WhatsApp
              </p>

              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#1f3828]"
              >
                Chat with us
              </a>
            </div>

          </div>
        )}


        {/* EMAIL */}

        {settings?.email && (
          <div className="flex gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Mail size={22} />
            </div>

            <div>
              <p className="text-sm text-stone-500">
                Email
              </p>

              <a
                href={`mailto:${settings.email}`}
                className="font-semibold text-[#1f3828]"
              >
                {settings.email}
              </a>
            </div>

          </div>
        )}


        {/* ADDRESS */}

        {settings?.address && (
          <div className="flex gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
              <MapPin size={22} />
            </div>

            <div>
              <p className="text-sm text-stone-500">
                Location
              </p>

              <p className="font-semibold leading-relaxed text-[#1f3828]">
                {settings.address}
              </p>

              {settings?.google_maps_url && (
                <a
                  href={settings.google_maps_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-green-700"
                >
                  View on Google Maps →
                </a>
              )}
            </div>

          </div>
        )}

      </div>

    </div>

  </div>
</section>

    </main>
  )
}

export default Home