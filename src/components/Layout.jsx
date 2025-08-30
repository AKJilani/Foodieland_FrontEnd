import { Link, NavLink } from 'react-router-dom'
import { getAccessToken, clearTokens } from '../api/client'
import Footer from './Footer'

export default function Layout({ children }) {
  const navLinkClass = (isActive) => `
    relative px-2 py-1 transition-all duration-300 ease-in-out
    ${isActive ? "font-sm text-gray-900 text-lg" : "text-gray-700 text-lg hover:text-gray-900"}
    before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-0 before:bg-blue-500 before:transition-all before:duration-300 hover:before:w-full
  `

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-3xl font-semibold">FoodieLand</Link>
          <nav className="flex items-center gap-6 text-sm">
            <NavLink to="/" className={({ isActive }) => navLinkClass(isActive)}>Home</NavLink>
            <NavLink to="/recipes" className={({ isActive }) => navLinkClass(isActive)}>Recipes</NavLink>
            <NavLink to="/blogs" className={({ isActive }) => navLinkClass(isActive)}>Blogs</NavLink>
            <NavLink to="/contact" className={({ isActive }) => navLinkClass(isActive)}>Messenger</NavLink>
            <NavLink to="/contact_US" className={({ isActive }) => navLinkClass(isActive)}>Contact Us</NavLink>

            {getAccessToken() ? (
              <>
                <NavLink to="/profile" className={({ isActive }) => navLinkClass(isActive)}>Profile</NavLink>
                <button
                  onClick={() => { clearTokens(); window.location.reload() }}
                  className="relative px-2 py-1 text-gray-700 text-lg hover:text-gray-900 transition-all duration-300 ease-in-out before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-0 before:bg-blue-500 before:transition-all before:duration-300 hover:before:w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => navLinkClass(isActive)}>Login</NavLink>
                <NavLink to="/register" className={({ isActive }) => navLinkClass(isActive)}>Register</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}