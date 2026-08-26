import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useFarmSettings } from '../hooks/useFarmSettings'

function ItemPage() {
  const { categorySlug, itemSlug } = useParams()

  const [item, setItem] = useState(null)
  const [category, setCategory] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { settings } = useFarmSettings()
  console.log('Farm Settings:', settings)

  useEffect(() => {
    async function fetchItem() {
      setLoading(true)
      setError(null)

      // Get category
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', categorySlug)
        .eq('is_active', true)
        .single()

      if (categoryError || !categoryData) {
        setError('Category not found')
        setLoading(false)
        return
      }

      setCategory(categoryData)

      // Get item
      const { data: itemData, error: itemError } = await supabase
        .from('items')
        .select('*')
        .eq('category_id', categoryData.id)
        .eq('slug', itemSlug)
        .eq('is_active', true)
        .single()

      if (itemError || !itemData) {
        setError('Item not found')
        setLoading(false)
        return
      }

      setItem(itemData)

      // Get item images
      const { data: imageData, error: imageError } = await supabase
        .from('item_images')
        .select('*')
        .eq('item_id', itemData.id)
        .order('display_order', { ascending: true })

      if (!imageError) {
        setImages(imageData || [])
      }

      setLoading(false)
    }

    fetchItem()
  }, [categorySlug, itemSlug])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f3ed]">
        Loading item...
      </main>
    )
  }

  if (error || !item || !category) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f5f3ed] px-6">
        <h1 className="text-3xl font-bold">
          {error || 'Item not found'}
        </h1>

        <Link
          to="/"
          className="mt-6 font-semibold text-green-700"
        >
          ← Back to Home
        </Link>
      </main>
    )
  }

  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in ${item.name} from LRC Farm. Please share more details.`
  )

  return (
    <main className="min-h-screen bg-[#f5f3ed]">

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Back Button */}
        <Link
          to={`/category/${category.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-green-700"
        >
          <ArrowLeft size={18} />
          Back to {category.name}
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-2">

          {/* IMAGE SECTION */}
          <div>

            {images.length > 0 ? (
              <div className="space-y-4">

                <div className="overflow-hidden rounded-3xl bg-stone-200">
                  <img
                    src={images[0].image_url}
                    alt={item.name}
                    className="aspect-square w-full object-cover"
                  />
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {images.slice(1).map((image) => (
                      <img
                        key={image.id}
                        src={image.image_url}
                        alt={item.name}
                        className="aspect-square rounded-xl object-cover"
                      />
                    ))}
                  </div>
                )}

              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-3xl bg-stone-200">
                <span className="text-stone-500">
                  Images coming soon
                </span>
              </div>
            )}

          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-center">

            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-green-700">
              LRC Farm · {category.name}
            </p>

            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
              {item.name}
            </h1>

            <span className="mt-6 inline-flex w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-semibold capitalize text-green-800">
              Currently {item.availability_status}
            </span>

            {item.description && (
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-stone-600">
                {item.description}
              </p>
            )}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              {settings?.whatsapp && (
  <a
    href={`https://wa.me/${settings.whatsapp}?text=${whatsappMessage}`}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f3828] px-6 py-3.5 font-semibold text-white transition hover:bg-green-800"
  >
    <MessageCircle size={20} />
    WhatsApp Us
  </a>
)}
{settings?.phone && (
  <a
    href={`tel:${settings.phone}`}
    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1f3828] px-6 py-3.5 font-semibold text-[#1f3828] transition hover:bg-stone-100"
  >
    <Phone size={20} />
    Call LRC Farm
  </a>
)}

            </div>

            <p className="mt-5 text-sm text-stone-500">
              Contact LRC Farm for availability and further information.
            </p>

          </div>

        </div>

      </div>
    </main>
  )
}

export default ItemPage