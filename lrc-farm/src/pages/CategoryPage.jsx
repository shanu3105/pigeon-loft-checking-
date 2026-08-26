import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'

function CategoryPage() {
  const { slug } = useParams()

  const [category, setCategory] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCategoryData() {
      setLoading(true)
      setError(null)

      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (categoryError) {
        setError('Category not found')
        setLoading(false)
        return
      }

      setCategory(categoryData)

      const { data: itemData, error: itemError } = await supabase
        .from('items')
        .select('*')
        .eq('category_id', categoryData.id)
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (itemError) {
        setError(itemError.message)
      } else {
        setItems(itemData)
      }

      setLoading(false)
    }

    fetchCategoryData()
  }, [slug])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f3ed]">
        Loading...
      </main>
    )
  }

  if (error || !category) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f5f3ed] px-6">
        <h1 className="text-3xl font-bold">
          {error || 'Category not found'}
        </h1>

        <Link
          to="/"
          className="mt-6 text-green-700 font-semibold"
        >
          ← Back to Home
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f3ed]">

      {/* Category Header */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-green-700"
          >
            <ArrowLeft size={18} />
            Back to Categories
          </Link>

          <h1 className="mt-8 text-5xl font-bold md:text-6xl">
            {category.name}
          </h1>

          {category.description && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
              {category.description}
            </p>
          )}

        </div>
      </section>

      {/* Items */}
      <section className="mx-auto max-w-7xl px-6 py-16">

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
            <h2 className="text-2xl font-semibold">
              No items available right now
            </h2>

            <p className="mt-3 text-stone-600">
              Please contact LRC Farm for more information.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold">
              Available at LRC Farm
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {items.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white p-7 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-bold">
                      {item.name}
                    </h3>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-800">
                      {item.availability_status}
                    </span>
                  </div>

                  {item.description && (
                    <p className="mt-4 leading-relaxed text-stone-600">
                      {item.description}
                    </p>
                  )}

                  <Link
  to={`/category/${category.slug}/item/${item.slug}`}
  className="mt-6 inline-block font-semibold text-green-700"
>
  View Details →
</Link>
                </article>
              ))}

            </div>
          </>
        )}

      </section>
    </main>
  )
}

export default CategoryPage