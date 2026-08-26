import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Link } from 'react-router-dom'

const BUCKET_NAME = 'farm-images'

function Categories() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    setLoading(true)
    const {
  data: { user },
} = await supabase.auth.getUser()

console.log('Current logged-in user:', user)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order')

    if (error) {
      console.error(error)
      setMessage(`Error: ${error.message}`)
    } else {
      setCategories(data || [])
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

    if (!name.trim()) {
      setMessage('Please enter a category name.')
      return
    }

    try {
      setSaving(true)
      setMessage('Creating category...')

      const slug = createSlug(name)

      // First create the category
      const { data: newCategory, error: categoryError } = await supabase
        .from('categories')
        .insert({
          name: name.trim(),
          slug,
          description: description.trim() || null,
          is_active: true,
        })
        .select()
        .single()

      if (categoryError) throw categoryError

      // Upload image if selected
      if (imageFile) {
        setMessage('Uploading category image...')

        const fileExt = imageFile.name.split('.').pop()

        const filePath =
          `categories/${newCategory.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, imageFile)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath)

        const { error: updateError } = await supabase
          .from('categories')
          .update({
            image_url: data.publicUrl,
          })
          .eq('id', newCategory.id)

        if (updateError) throw updateError
      }

      setMessage('Category added successfully! 🎉')

      setName('')
      setDescription('')
      setImageFile(null)

      await loadCategories()

    } catch (error) {
      console.error(error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function toggleCategory(category) {
    const { error } = await supabase
      .from('categories')
      .update({
        is_active: !category.is_active,
      })
      .eq('id', category.id)

    if (error) {
      setMessage(`Error: ${error.message}`)
      return
    }

    await loadCategories()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading categories...
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
            Manage Categories
          </h1>

          <p className="mt-2 text-stone-600">
            Add and manage farm categories.
          </p>
        </div>

        {/* ADD CATEGORY */}

        <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm md:p-8">

          <h2 className="text-2xl font-bold">
            Add New Category
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            <div>
              <label className="mb-2 block font-medium">
                Category Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: Rabbits"
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
                required
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
                rows="4"
                placeholder="Short description about this category..."
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Category Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] || null)
                }
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#1f3828] px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Add Category'}
            </button>

          </form>

          {message && (
            <p className="mt-5 rounded-xl bg-stone-100 p-4 text-sm">
              {message}
            </p>
          )}

        </div>

        {/* EXISTING CATEGORIES */}

        <div className="mt-12">

          <h2 className="text-2xl font-bold">
            Existing Categories
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {categories.map((category) => (
              <div
                key={category.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >

                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-stone-200 text-stone-500">
                    No image
                  </div>
                )}

                <div className="p-5">

                  <h3 className="text-xl font-bold">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="mt-2 text-sm text-stone-600">
                      {category.description}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between gap-3">

  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      category.is_active
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-700'
    }`}
  >
    {category.is_active ? 'Active' : 'Inactive'}
  </span>

  <div className="flex items-center gap-4">

    <Link
      to={`/admin/categories/${category.id}/edit`}
      className="text-sm font-semibold text-blue-700"
    >
      Edit
    </Link>

    <button
      onClick={() => toggleCategory(category)}
      className="text-sm font-semibold text-green-700"
    >
      {category.is_active ? 'Deactivate' : 'Activate'}
    </button>

  </div>

</div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </main>
  )
}

export default Categories