import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ItemPage from './pages/ItemPage'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import UploadTest from './pages/UploadTest'

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

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
      </Routes>
    </BrowserRouter>
  )
}

export default App