import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const BUCKET_NAME = 'farm-images'

function EditCategory() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [category, setCategory] = useState(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [newImage, setNewImage] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadCategory()
  }, [id])

  async function loadCategory() {
    setLoading(true)

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error(error)
      setMessage('Category not found.')
      setLoading(false)
      return
    }

    setCategory(data)
    setName(data.name || '')
    setDescription(data.description || '')

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

    if (!name.trim()) {
      setMessage('Category name is required.')
      return
    }

    try {
      setSaving(true)
      setMessage('Saving changes...')

      let imageUrl = category.image_url

      // Upload a new image only if selected
      if (newImage) {
        setMessage('Uploading new image...')

        const fileExt = newImage.name.split('.').pop()

        const filePath =
          `categories/${id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, newImage)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath)

        imageUrl = publicUrlData.publicUrl
      }

      const { error: updateError } = await supabase
        .from('categories')
        .update({
          name: name.trim(),
          slug: createSlug(name),
          description: description.trim() || null,
          image_url: imageUrl,
        })
        .eq('id', id)

      if (updateError) throw updateError

      setMessage('Category updated successfully! 🎉')
      setNewImage(null)

      await loadCategory()

    } catch (error) {
      console.error(error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading category...
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">

        <h1 className="text-3xl font-bold">
          Category not found
        </h1>

        <Link
          to="/admin/categories"
          className="mt-4 text-green-700"
        >
          ← Back to Categories
        </Link>

      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f3ed] px-6 py-10">

      <div className="mx-auto max-w-4xl">

        <Link
          to="/admin/categories"
          className="text-sm font-semibold text-green-700"
        >
          ← Back to Categories
        </Link>

        <h1 className="mt-6 text-4xl font-bold">
          Edit {category.name}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-3xl bg-white p-6 shadow-sm md:p-8"
        >

          <div>

            <label className="mb-2 block font-medium">
              Category Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
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

          {/* CURRENT IMAGE */}

          <div>

            <label className="mb-3 block font-medium">
              Current Image
            </label>

            {category.image_url ? (
              <img
                src={category.image_url}
                alt={category.name}
                className="aspect-[16/9] w-full max-w-xl rounded-2xl object-cover"
              />
            ) : (
              <div className="flex aspect-[16/9] w-full max-w-xl items-center justify-center rounded-2xl bg-stone-200 text-stone-500">
                No image uploaded
              </div>
            )}

          </div>

          {/* REPLACE IMAGE */}

          <div>

            <label className="mb-2 block font-medium">
              Replace Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setNewImage(event.target.files?.[0] || null)
              }
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />

            {newImage && (
              <p className="mt-2 text-sm text-green-700">
                New image selected: {newImage.name}
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
              onClick={() => navigate('/admin/categories')}
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

export default EditCategory