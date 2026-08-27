import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ItemPage from './pages/ItemPage'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import UploadTest from './pages/UploadTest'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Items from './pages/admin/Items'
import Categories from './pages/admin/Categories'
import EditItem from './pages/admin/EditItem'
import EditCategory from './pages/admin/EditCategory'
import FarmSettings from './pages/admin/FarmSettings'
import Footer from './components/Footer'
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
  path="/admin/items"
  element={
    <ProtectedRoute>
      <Items />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/settings"
  element={
    <ProtectedRoute>
      <FarmSettings />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/categories/:id/edit"
  element={
    <ProtectedRoute>
      <EditCategory />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/categories"
  element={
    <ProtectedRoute>
      <Categories />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/items/:id/edit"
  element={
    <ProtectedRoute>
      <EditItem />
    </ProtectedRoute>
  }
/>

        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center">
              Page not found
            </div>
          }
        />
        <Route
  path="/category/:slug"
  element={<CategoryPage />}
/>
<Route
  path="/category/:categorySlug/item/:itemSlug"
  element={<ItemPage />}
/>
<Route
  path="/upload-test"
  element={<UploadTest />}
/>
<Route
  path="/admin/login"
  element={<Login />}
/>

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

      </Routes>
       <Footer />
    </BrowserRouter>
    
  )
}

export default App