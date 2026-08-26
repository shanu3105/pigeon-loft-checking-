import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Home() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

      {/* HERO */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center bg-[#1f3828] text-white">
        <p className="mb-4 text-sm tracking-[0.3em] uppercase text-green-300">
          Welcome to
        </p>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
          LRC Farm
        </h1>

        <p className="max-w-xl mt-6 text-lg text-green-100">
          Explore our collection of healthy livestock, poultry,
          ornamental fish and pets.
        </p>

        <a
          href="#categories"
          className="mt-10 rounded-full bg-white px-7 py-3 font-semibold text-[#1f3828] transition hover:scale-105"
        >
          Explore Our Farm
        </a>
      </section>

      {/* CATEGORIES */}
      <section
        id="categories"
        className="max-w-7xl mx-auto px-6 py-20"
      >
        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-green-700">
            What We Have
          </p>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold">
            Explore Our Categories
          </h2>
        </div>

        {loading && (
          <p className="text-center mt-12">
            Loading categories...
          </p>
        )}

        {error && (
          <p className="text-center mt-12 text-red-600">
            Error: {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {categories.map((category) => (
                    <Link
        key={category.id}
        to={`/category/${category.slug}`}
        className="group block min-h-56 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
        <p className="text-sm font-medium text-green-700">
            LRC FARM
        </p>

        <h3 className="mt-3 text-2xl font-bold">
            {category.name}
        </h3>

        <p className="mt-3 leading-relaxed text-stone-600">
            {category.description}
        </p>

        <span className="mt-6 inline-block font-semibold text-green-800 transition group-hover:translate-x-1">
            Explore →
        </span>
        </Link>
          ))}
        </div>
      </section>

    </main>
  )
}

export default Home