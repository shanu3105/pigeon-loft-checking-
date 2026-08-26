import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { uploadItemImage } from '../lib/storage'

function UploadTest() {
  const [file, setFile] = useState(null)
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  async function loadItems() {
    const { data, error } = await supabase
      .from('items')
      .select('id, name, category:categories(name)')
      .eq('is_active', true)
      .order('name')

    if (error) {
      setMessage(error.message)
      return
    }

    setItems(data || [])
  }

  async function handleUpload(event) {
    event.preventDefault()

    if (!file || !selectedItem) {
      setMessage('Please select an item and an image.')
      return
    }

    try {
      setUploading(true)
      setMessage('Uploading image...')

      // 1. Upload image to Supabase Storage
      const { publicUrl } = await uploadItemImage(
        file,
        selectedItem
      )

      // 2. Save the URL in the database
      const { error } = await supabase
        .from('item_images')
        .insert({
          item_id: selectedItem,
          image_url: publicUrl,
          display_order: 1,
        })

      if (error) throw error

      setMessage('Image uploaded successfully! 🎉')
      setFile(null)

    } catch (error) {
      console.error(error)
      setMessage(`Upload failed: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f3ed] px-6 py-12">
      <div className="mx-auto max-w-xl">

        <h1 className="text-3xl font-bold">
          LRC Farm Image Upload Test
        </h1>

        <button
          onClick={loadItems}
          className="mt-6 rounded-lg bg-[#1f3828] px-5 py-3 font-semibold text-white"
        >
          Load Farm Items
        </button>

        <form
          onSubmit={handleUpload}
          className="mt-8 space-y-5 rounded-2xl bg-white p-6 shadow-sm"
        >

          <div>
            <label className="mb-2 block font-medium">
              Select Item
            </label>

            <select
              value={selectedItem}
              onChange={(event) =>
                setSelectedItem(event.target.value)
              }
              className="w-full rounded-lg border border-stone-300 px-4 py-3"
            >
              <option value="">
                Choose an item
              </option>

              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.category?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Select Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setFile(event.target.files?.[0] || null)
              }
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full rounded-lg bg-green-700 px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>

          {message && (
            <p className="rounded-lg bg-stone-100 p-4 text-sm">
              {message}
            </p>
          )}

        </form>
      </div>
    </main>
  )
}

export default UploadTest