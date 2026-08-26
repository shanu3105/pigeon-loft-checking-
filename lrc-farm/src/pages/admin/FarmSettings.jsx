import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

function FarmSettings() {
  const [settingsId, setSettingsId] = useState(null)

  const [farmName, setFarmName] = useState('')
  const [aboutText, setAboutText] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [googleMapsUrl, setGoogleMapsUrl] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)

    const { data, error } = await supabase
      .from('farm_settings')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      console.error(error)
      setMessage(`Error loading settings: ${error.message}`)
      setLoading(false)
      return
    }

    setSettingsId(data.id)
    setFarmName(data.farm_name || '')
    setAboutText(data.about_text || '')
    setPhone(data.phone || '')
    setWhatsapp(data.whatsapp || '')
    setEmail(data.email || '')
    setAddress(data.address || '')
    setGoogleMapsUrl(data.google_maps_url || '')

    setLoading(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!settingsId) {
      setMessage('Farm settings record not found.')
      return
    }

    try {
      setSaving(true)
      setMessage('Saving changes...')

      const { error } = await supabase
        .from('farm_settings')
        .update({
          farm_name: farmName.trim(),
          about_text: aboutText.trim() || null,
          phone: phone.trim() || null,
          whatsapp: whatsapp.trim() || null,
          email: email.trim() || null,
          address: address.trim() || null,
          google_maps_url: googleMapsUrl.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settingsId)

      if (error) throw error

      setMessage('Farm settings updated successfully! 🎉')

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
        Loading farm settings...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f3ed] px-6 py-10">

      <div className="mx-auto max-w-4xl">

        <Link
          to="/admin"
          className="text-sm font-semibold text-green-700"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            LRC Farm Admin
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Farm Settings
          </h1>

          <p className="mt-2 text-stone-600">
            Manage your farm information and contact details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-3xl bg-white p-6 shadow-sm md:p-8"
        >

          <div>
            <label className="mb-2 block font-medium">
              Farm Name
            </label>

            <input
              type="text"
              value={farmName}
              onChange={(event) => setFarmName(event.target.value)}
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
              placeholder="LRC Farm"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              About the Farm
            </label>

            <textarea
              value={aboutText}
              onChange={(event) => setAboutText(event.target.value)}
              rows="5"
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
              placeholder="Tell visitors about your farm..."
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-medium">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                WhatsApp Number
              </label>

              <input
                type="tel"
                value={whatsapp}
                onChange={(event) => setWhatsapp(event.target.value)}
                placeholder="919XXXXXXXXX"
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
              />

              <p className="mt-1 text-xs text-stone-500">
                Use country code without + or spaces. Example: 919876543210
              </p>
            </div>

          </div>

          <div>
            <label className="mb-2 block font-medium">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Farm Address
            </label>

            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              rows="3"
              placeholder="Enter the farm address..."
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Google Maps Link
            </label>

            <input
              type="url"
              value={googleMapsUrl}
              onChange={(event) => setGoogleMapsUrl(event.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </div>

          {message && (
            <p className="rounded-xl bg-stone-100 p-4 text-sm">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#1f3828] px-7 py-3 font-semibold text-white transition hover:bg-green-800 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Farm Settings'}
          </button>

        </form>

      </div>

    </main>
  )
}

export default FarmSettings