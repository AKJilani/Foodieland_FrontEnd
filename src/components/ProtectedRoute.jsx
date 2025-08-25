import { Navigate, useLocation } from 'react-router-dom'
import { getAccessToken } from '../api/client'

export default function ProtectedRoute({ children }) {
	const token = getAccessToken()
	const location = useLocation()
	if (!token) return <Navigate to="/login" state={{ from: location }} replace />
	return children
}


