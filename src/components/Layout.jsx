import { Link, NavLink } from 'react-router-dom'
import { getAccessToken, clearTokens } from '../api/client'
import Footer from './Footer'

export default function Layout({ children }) {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
				<div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
					<Link to="/" className="text-xl font-semibold">FoodieLand</Link>
					<nav className="flex items-center gap-6 text-sm">
						<NavLink to="/" className={({isActive})=>isActive?"text-gray-900":"text-gray-600 hover:text-gray-900"}>Home</NavLink>
						<NavLink to="/recipes" className={({isActive})=>isActive?"text-gray-900":"text-gray-600 hover:text-gray-900"}>Recipes</NavLink>
						<NavLink to="/blogs" className={({isActive})=>isActive?"text-gray-900":"text-gray-600 hover:text-gray-900"}>Blogs</NavLink>
						<NavLink to="/contact" className={({isActive})=>isActive?"text-gray-900":"text-gray-600 hover:text-gray-900"}>Contact</NavLink>
						{getAccessToken() ? (
							<>
								<NavLink to="/profile" className={({isActive})=>isActive?"text-gray-900":"text-gray-600 hover:text-gray-900"}>Profile</NavLink>
								<button onClick={()=>{clearTokens(); window.location.reload()}} className="text-gray-600 hover:text-gray-900">Logout</button>
							</>
						) : (
							<>
								<NavLink to="/login" className={({isActive})=>isActive?"text-gray-900":"text-gray-600 hover:text-gray-900"}>Login</NavLink>
								<NavLink to="/register" className={({isActive})=>isActive?"text-gray-900":"text-gray-600 hover:text-gray-900"}>Register</NavLink>
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


