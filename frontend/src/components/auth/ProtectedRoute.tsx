import { useAuthStore } from '@/stores/useAuthStore';

import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const {accessToken, user, loading} = useAuthStore(); //TODO: get auth state from store

    if (!accessToken) {
        return (
            <Navigate to="/signin" replace />
        )
    }


  return (
    <Outlet></Outlet>
  )
}

export default ProtectedRoute