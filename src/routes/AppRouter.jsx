import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from '../views/HomePage'
import RecipeDetailsPage from '../views/RecipeDetailsPage'
import RecipeFormPage from '../views/RecipeFormPage'
import BlogsPage from '../views/BlogsPage'
import BlogDetailsPage from '../views/BlogDetailsPage'
import BlogFormPage from '../views/BlogFormPage'
import ContactPage from '../views/ContactPage'
import LoginPage from '../views/auth/LoginPage'
import RegisterPage from '../views/auth/RegisterPage'
import VerifyEmailPage from '../views/auth/VerifyEmailPage'
import ProfilePage from '../views/ProfilePage'
import ProtectedRoute from '../components/ProtectedRoute'
import NotFound from '../views/NotFound'
import RecipesPage from '../views/RecipesPage'
import ResetPasswordPage from '../views/auth/ResetPasswordPage'
import ForgotPasswordPage from '../views/auth/ForgotPasswordPage'
import ContactUS from '../views/ContactUS'

export default function AppRouter() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/recipes" element={<RecipesPage />} />
			<Route path="/recipes/:id" element={<RecipeDetailsPage />} />
			<Route path="/recipes/new" element={<ProtectedRoute><RecipeFormPage mode="create" /></ProtectedRoute>} />
			<Route path="/recipes/:id/edit" element={<ProtectedRoute><RecipeFormPage mode="edit" /></ProtectedRoute>} />
			<Route path="/blogs" element={<BlogsPage />} />
			<Route path="/blogs/:id" element={<BlogDetailsPage />} />
			<Route path="/blogs/new" element={<ProtectedRoute><BlogFormPage mode="create" /></ProtectedRoute>} />
			<Route path="/blogs/:id/edit" element={<ProtectedRoute><BlogFormPage mode="edit" /></ProtectedRoute>} />
			<Route path="/contact" element={<ContactPage />} />
			<Route path="/contact_US" element={<ContactUS />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/verify-email" element={<VerifyEmailPage />} />
			<Route path="/reset-password" element={<ResetPasswordPage />} />
			<Route path="/forgot-password" element={<ForgotPasswordPage />} />
			<Route path="/profile" element={<ProfilePage />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	)
}