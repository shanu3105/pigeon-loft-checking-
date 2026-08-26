import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { uploadItemImage } from '../../lib/storage'

function Items() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])

  const [selectedCategory, setSelectedCategory] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [availability, setAvailability] = useState('available')
  const [files, setFiles] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)

    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .order('display_order')

    if (categoryError) {
      console.error(categoryError)
    } else {
      setCategories(categoryData || [])
    }

    const { data: itemData, error: itemError } = await supabase
      .from('items')
      .select(`
        *,
        category:categories (
          name,
          slug
        ),
        item_images (
          id,
          image_url,
          display_order
        )
      `)
      .order('created_at', { ascending: false })

    if (itemError) {
      console.error(itemError)
    } else {
      setItems(itemData || [])
    }

    setLoading(false)
  }

  function createSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!selectedCategory || !name.trim()) {
      setMessage('Please select a category and enter an item name.')
      return
    }

    try {
      setSaving(true)
      setMessage('Creating item...')

      const slug = createSlug(name)

      // Create item first
      const { data: newItem, error: itemError } = await supabase
        .from('items')
        .insert({
          category_id: selectedCategory,
          name: name.trim(),
          slug,
          description: description.trim() || null,
          availability_status: availability,
          is_active: true,
        })
        .select()
        .single()

      if (itemError) throw itemError

      // Upload images
      if (files.length > 0) {
        setMessage('Uploading images...')

        for (let index = 0; index < files.length; index++) {
          const file = files[index]

          const { publicUrl } = await uploadItemImage(
            file,
            newItem.id
          )

          const { error: imageError } = await supabase
            .from('item_images')
            .insert({
              item_id: newItem.id,
              image_url: publicUrl,
              display_order: index + 1,
            })

          if (imageError) throw imageError
        }
      }

      setMessage('Item added successfully! 🎉')

      // Reset form
      setSelectedCategory('')
      setName('')
      setDescription('')
      setAvailability('available')
      setFiles([])

      // Reload everything
      await loadData()

    } catch (error) {
      console.error(error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function toggleItemStatus(item) {
    const { error } = await supabase
      .from('items')
      .update({
        is_active: !item.is_active,
      })
      .eq('id', item.id)

    if (error) {
      setMessage(`Error: ${error.message}`)
      return
    }

    await loadData()
  }

  if (loading) {
    return (
      <div className="p-10">
        Loading items...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f3ed] px-6 py-10">

      <div className="mx-auto max-w-7xl">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            LRC Farm Admin
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Manage Items
          </h1>

          <p className="mt-2 text-stone-600">
            Add and manage animals, poultry, fish and other farm supplies.
          </p>
        </div>

        {/* ADD ITEM FORM */}

        <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm md:p-8">

          <h2 className="text-2xl font-bold">
            Add New Item
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            {/* CATEGORY */}

            <div>
              <label className="mb-2 block font-medium">
                Category
              </label>

              <select
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
                required
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}

              </select>
            </div>

            {/* NAME */}

            <div>
              <label className="mb-2 block font-medium">
                Item Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Example: Sonali Hen"
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
                required
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-2 block font-medium">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows="4"
                placeholder="Add a short description..."
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
              />
            </div>

            {/* AVAILABILITY */}

            <div>
              <label className="mb-2 block font-medium">
                Availability
              </label>

              <select
                value={availability}
                onChange={(event) =>
                  setAvailability(event.target.value)
                }
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
              >
                <option value="available">
                  Available
                </option>

                <option value="limited">
                  Limited
                </option>

                <option value="unavailable">
                  Currently Unavailable
                </option>
              </select>
            </div>

            {/* IMAGES */}

            <div>
              <label className="mb-2 block font-medium">
                Images
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) =>
                  setFiles(
                    Array.from(event.target.files || [])
                  )
                }
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
              />

              {files.length > 0 && (
                <p className="mt-2 text-sm text-green-700">
                  {files.length} image(s) selected
                </p>
              )}
            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#1f3828] px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Add Item'}
            </button>

          </form>

          {message && (
            <p className="mt-5 rounded-xl bg-stone-100 p-4 text-sm">
              {message}
            </p>
          )}

        </div>

        {/* ITEMS LIST */}

        <div className="mt-12">

          <h2 className="text-2xl font-bold">
            Existing Items
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {items.map((item) => {

              const firstImage = item.item_images?.[0]

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >

                  {firstImage ? (
                    <img
                      src={firstImage.image_url}
                      alt={item.name}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-stone-200 text-stone-500">
                      No image
                    </div>
                  )}

                  <div className="p-5">

                    <p className="text-sm font-medium text-green-700">
                      {item.category?.name}
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-sm capitalize text-stone-600">
                      Availability: {item.availability_status}
                    </p>

                    <div className="mt-5 flex items-center justify-between">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.is_active
                          ? 'Active'
                          : 'Inactive'}
                      </span>

                      <button
                        onClick={() =>
                          toggleItemStatus(item)
                        }
                        className="text-sm font-semibold text-green-700"
                      >
                        {item.is_active
                          ? 'Deactivate'
                          : 'Activate'}
                      </button>

                    </div>

                  </div>

                </div>
              )
            })}

          </div>

          {items.length === 0 && (
            <p className="mt-6 text-stone-500">
              No items added yet.
            </p>
          )}

        </div>

      </div>

    </main>
  )
}

export default Items