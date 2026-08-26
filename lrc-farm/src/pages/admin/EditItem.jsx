import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { uploadItemImage } from '../../lib/storage'

function EditItem() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [item, setItem] = useState(null)

  const [categoryId, setCategoryId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [availability, setAvailability] = useState('available')

  const [images, setImages] = useState([])
  const [newFiles, setNewFiles] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [id])

  async function loadData() {
    setLoading(true)

    const { data: categoryData } = await supabase
      .from('categories')
      .select('*')
      .order('display_order')

    setCategories(categoryData || [])

    const { data: itemData, error: itemError } = await supabase
      .from('items')
      .select(`
        *,
        item_images (
          id,
          image_url,
          display_order
        )
      `)
      .eq('id', id)
      .single()

    if (itemError || !itemData) {
      setMessage('Item not found.')
      setLoading(false)
      return
    }

    setItem(itemData)

    setCategoryId(itemData.category_id)
    setName(itemData.name || '')
    setDescription(itemData.description || '')
    setAvailability(itemData.availability_status || 'available')

    const sortedImages = [...(itemData.item_images || [])]
      .sort((a, b) => a.display_order - b.display_order)

    setImages(sortedImages)

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

    if (!name.trim() || !categoryId) {
      setMessage('Name and category are required.')
      return
    }

    try {
      setSaving(true)
      setMessage('Saving changes...')

      const { error: updateError } = await supabase
        .from('items')
        .update({
          category_id: categoryId,
          name: name.trim(),
          slug: createSlug(name),
          description: description.trim() || null,
          availability_status: availability,
        })
        .eq('id', id)

      if (updateError) throw updateError

      // Upload newly selected images
      for (let index = 0; index < newFiles.length; index++) {
        const file = newFiles[index]

        const { publicUrl } = await uploadItemImage(
          file,
          id
        )

        const { error: imageError } = await supabase
          .from('item_images')
          .insert({
            item_id: id,
            image_url: publicUrl,
            display_order: images.length + index + 1,
          })

        if (imageError) throw imageError
      }

      setNewFiles([])
      setMessage('Changes saved successfully! 🎉')

      await loadData()

    } catch (error) {
      console.error(error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function deleteImage(image) {
    const confirmed = window.confirm(
      'Delete this image?'
    )

    if (!confirmed) return

    try {
      const { error } = await supabase
        .from('item_images')
        .delete()
        .eq('id', image.id)

      if (error) throw error

      await loadData()

    } catch (error) {
      console.error(error)
      setMessage(`Error deleting image: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading item...
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">
          Item not found
        </h1>

        <Link
          to="/admin/items"
          className="mt-4 text-green-700"
        >
          ← Back to Items
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f3ed] px-6 py-10">

      <div className="mx-auto max-w-4xl">

        <Link
          to="/admin/items"
          className="text-sm font-semibold text-green-700"
        >
          ← Back to Items
        </Link>

        <h1 className="mt-6 text-4xl font-bold">
          Edit {item.name}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-3xl bg-white p-6 shadow-sm md:p-8"
        >

          <div>
            <label className="mb-2 block font-medium">
              Category
            </label>

            <select
              value={categoryId}
              onChange={(event) =>
                setCategoryId(event.target.value)
              }
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            >
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

          <div>
            <label className="mb-2 block font-medium">
              Item Name
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows="5"
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </div>

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

          {/* CURRENT IMAGES */}

          <div>

            <label className="mb-3 block font-medium">
              Current Images
            </label>

            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative"
                  >

                    <img
                      src={image.image_url}
                      alt={item.name}
                      className="aspect-square w-full rounded-xl object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => deleteImage(image)}
                      className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white"
                    >
                      Delete
                    </button>

                  </div>
                ))}

              </div>
            ) : (
              <p className="text-sm text-stone-500">
                No images uploaded yet.
              </p>
            )}

          </div>

          {/* ADD NEW IMAGES */}

          <div>

            <label className="mb-2 block font-medium">
              Add More Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) =>
                setNewFiles(
                  Array.from(event.target.files || [])
                )
              }
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />

            {newFiles.length > 0 && (
              <p className="mt-2 text-sm text-green-700">
                {newFiles.length} new image(s) selected
              </p>
            )}

          </div>

          {message && (
            <p className="rounded-xl bg-stone-100 p-4 text-sm">
              {message}
            </p>
          )}

          <div className="flex gap-4">

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#1f3828] px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/items')}
              className="rounded-xl border border-stone-300 px-6 py-3 font-semibold"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </main>
  )
}

export default EditItem