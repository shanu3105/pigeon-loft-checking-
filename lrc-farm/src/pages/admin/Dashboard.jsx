import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

function Dashboard() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <main className="min-h-screen bg-[#f5f3ed] px-6 py-12">
      <div className="mx-auto max-w-7xl">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              LRC Farm
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Admin Dashboard
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-stone-300 px-5 py-2.5 font-medium"
          >
            Logout
          </button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <Link
  to="/admin/categories"
  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1"
>
  <h2 className="text-xl font-bold">
    Categories
  </h2>

  <p className="mt-2 text-stone-600">
    Add and manage farm categories.
  </p>

  <p className="mt-5 font-semibold text-green-700">
    Manage Categories →
  </p>
</Link>

         
            <Link
  to="/admin/items"
  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1"
>
  <h2 className="text-xl font-bold">
    Farm Items
  </h2>

  <p className="mt-2 text-stone-600">
    Add and manage livestock and supplies.
  </p>

  <p className="mt-5 font-semibold text-green-700">
    Manage Items →
  </p>
</Link>
    

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Farm Settings
            </h2>

            <p className="mt-2 text-stone-600">
              Update contact information.
            </p>
          </div>

        </div>

      </div>
    </main>
  )
}

export default Dashboard